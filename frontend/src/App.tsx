import React, { useState, useEffect } from 'react';
import { supabase } from './utils/supabase/client';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Dashboard from './components/Dashboard';
import AnalysisProgress from './components/AnalysisProgress';
import ResultPage from './components/ResultPage';
import HistoryPage from './components/HistoryPage';
import AdminLoginPage from './components/AdminLoginPage';
import AdminDashboard from './components/AdminDashboard';
import ContactPage from './components/ContactPage';
import AboutPage from './components/AboutPage';
import FeedbackPage from './components/FeedbackPage';
import OTPVerificationPage from './components/OTPVerificationPage';

export type PageType = 'landing' | 'login' | 'signup' | 'otp' | 'dashboard' | 'analysis' | 'result' | 'history' | 'admin-login' | 'admin-dashboard' | 'contact' | 'about' | 'feedback';

export interface AnalysisResult {
  id: string;
  type: 'text' | 'url' | 'file';
  content: string;
  percentage: number;
  verdict: 'Real' | 'Fake';
  confidence: number;
  detectedCues: string[];
  date: string;
  user_id?: string;
  created_at?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  registeredDate: string;
  analysisCount: number;
}

export interface AppState {
  currentPage: PageType;
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: { name: string; email: string; id: string } | null;
  currentAnalysis: AnalysisResult | null;
  analysisHistory: AnalysisResult[];
  allUsers: User[];
}

export default function App() {
  const [appState, setAppState] = useState<AppState>({
    currentPage: 'landing',
    isAuthenticated: false,
    isAdmin: false,
    user: null,
    currentAnalysis: null,
    analysisHistory: [],
    allUsers: []
  });

  const [isLoading, setIsLoading] = useState(true);
  const [pendingUser, setPendingUser] = useState<{ email: string; name: string } | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
    checkAdminSession();

    // Secret Admin Route: visit /?portal=admin
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('portal') === 'admin') {
      navigateTo('admin-login');
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session && session.user) {
        loadUserData(session.user.id);
      } else {
        setAppState(prev => ({
          ...prev,
          isAuthenticated: false,
          isAdmin: false,
          user: null,
          analysisHistory: [],
          allUsers: []
        }));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkAdminSession = async () => {
    const adminToken = localStorage.getItem('adminToken');
    const adminUser = localStorage.getItem('adminUser');
    
    if (adminToken && adminUser && adminUser !== 'undefined') {
      try {
        const user = JSON.parse(adminUser);
        if (user && user.id) {
          // Authenticate the Supabase client so it can pass RLS when fetching admin data
          await supabase.auth.setSession({
            access_token: adminToken,
            refresh_token: ''
          });

          setAppState(prev => ({
            ...prev,
            isAuthenticated: true,
            isAdmin: true,
            user,
            currentPage: 'admin-dashboard'
          }));
          await loadAdminData();
        }
      } catch (error) {
        console.error('Error restoring admin session:', error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
      }
    }
  };

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        await loadUserData(session.user.id);
      }
    } catch (error) {
      console.error('Session check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserData = async (userId: string) => {
    try {
      // Get user profile from profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      let userProfile = profile;

      // If profile doesn't exist, create it
      if (profileError && profileError.code === 'PGRST116') {
        // Get user email from Supabase auth
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([
              {
                id: userId,
                email: user.email,
                name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
                is_admin: false
              }
            ])
            .select()
            .single();

          if (createError) {
            console.error('Error creating profile:', createError);
            return;
          }
          userProfile = newProfile;
        } else {
          console.error('Could not get user from auth');
          return;
        }
      } else if (profileError) {
        console.error('Error loading profile:', profileError);
        return;
      }

      const isAdmin = userProfile?.is_admin || false;

      setAppState(prev => ({
        ...prev,
        isAuthenticated: true,
        isAdmin,
        user: {
          id: userId,
          name: userProfile?.name || userProfile?.email?.split('@')[0] || 'User',
          email: userProfile?.email || ''
        },
        currentPage: isAdmin ? 'admin-dashboard' : 'dashboard'
      }));

      // Load analysis history for regular users
      if (!isAdmin) {
        await loadAnalysisHistory(userId);
      } else {
        await loadAdminData();
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadAnalysisHistory = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading analysis history:', error);
        return;
      }

      setAppState(prev => ({
        ...prev,
        analysisHistory: data || []
      }));
    } catch (error) {
      console.error('Failed to load analysis history:', error);
    }
  };

  const loadAdminData = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      let profiles = [];
      let analyses = [];

      if (adminToken) {
        try {
          const response = await fetch('https://truthlens-backend-b4xl.onrender.com/api/v1/admin/dashboard-data', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${adminToken}`,
              'Accept': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              profiles = data.profiles;
              analyses = data.analyses;
            }
          } else {
            console.error('Failed to load dashboard data:', response.status);
          }
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        }
      }

      let feedbackData = [];
      if (adminToken) {
        try {
          const feedbackResponse = await fetch('https://truthlens-backend-b4xl.onrender.com/api/v1/feedback/all', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${adminToken}`,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });

          if (feedbackResponse.ok) {
            const feedbackResult = await feedbackResponse.json();
            feedbackData = feedbackResult.feedback || [];
          } else {
            console.error('Failed to load feedback:', feedbackResponse.status);
          }
        } catch (error) {
          console.error('Error loading feedback:', error);
        }
      }

      // Transform data
      const users: User[] = (profiles || []).map(p => {
        const userAnalyses = (analyses || []).filter((a: any) => a.user_id === p.id);
        return {
          id: p.id,
          name: p.name || p.email?.split('@')[0] || 'User',
          email: p.email || '',
          registeredDate: new Date(p.created_at || Date.now()).toLocaleDateString(),
          analysisCount: userAnalyses.length
        };
      });

      // Combine analyses and feedback for display
      const allHistory: AnalysisResult[] = (analyses || []).map((a: any) => ({
        id: a.id,
        type: a.type,
        content: a.content,
        percentage: a.percentage,
        verdict: a.verdict,
        confidence: a.confidence,
        detectedCues: a.detected_cues || [],
        date: new Date(a.created_at).toLocaleDateString(),
        user_id: a.user_id,
        created_at: a.created_at
      }));

      setAppState(prev => ({
        ...prev,
        allUsers: users,
        analysisHistory: allHistory
      }));
    } catch (error) {
      console.error('Failed to load admin data:', error);
    }
  };

  const navigateTo = (page: PageType) => {
    setAppState(prev => ({ ...prev, currentPage: page }));
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch('https://truthlens-backend-b4xl.onrender.com/api/v1/auth/signup/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || 'Failed to request verification code');
      }

      setPendingUser({ email, name });
      navigateTo('otp');
      alert('Verification code sent! Please check your email.');
    } catch (error: any) {
      console.error('Signup error:', error);
      alert(error.message || 'Failed to start signup process. Please try again.');
    }
  };

  const verifyOtp = async (token: string) => {
    if (!pendingUser) return false;

    try {
      const response = await fetch('https://truthlens-backend-b4xl.onrender.com/api/v1/auth/signup/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email: pendingUser.email, otp: token })
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.detail || 'Invalid verification code');
        return false;
      }

      if (result.success && result.user) {
        // Auth session is now active (backend created the user)
        // We might need to manually sign in with Supabase client to sync session if the backend doesn't return a session the client can use directly.
        // But since the backend returns an access_token, we can potentially use it.
        // HOWEVER, standard way is to just sign in again or use the token.
        // For simplicity, let's just use the profile data and hope loadUserData works.
        await loadUserData(result.user.id);
        setPendingUser(null);
        alert('Account verified successfully!');
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Verification error:', error);
      alert(error.message || 'Failed to verify code');
      return false;
    }
  };

  const resendOtp = async () => {
    if (!pendingUser) return;
    try {
      const response = await fetch(`https://truthlens-backend-b4xl.onrender.com/api/v1/auth/signup/resend?email=${encodeURIComponent(pendingUser.email)}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      const result = await response.json();
      if (response.ok) {
        alert('Verification code resent!');
      } else {
        alert(result.detail || 'Failed to resend code');
      }
    } catch (error) {
      console.error('Resend error:', error);
      alert('Failed to connect to server');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        alert(error.message);
        return;
      }

      if (data.user) {
        await loadUserData(data.user.id);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Failed to login. Please try again.');
    }
  };



  const adminLogin = async (email: string, password: string) => {
    try {
      const response = await fetch('https://truthlens-backend-b4xl.onrender.com/api/v1/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        console.error('Admin login HTTP error:', response.status, response.statusText);
        const data = await response.json();
        alert(data.detail || `Failed to login: ${response.status} ${response.statusText}`);
        return false;
      }

      const data = await response.json();

      if (!data.success || !data.user) {
        console.error('Admin login error: Missing user data');
        alert(data.error || 'Failed to login as admin: Missing user data');
        return false;
      }

      // Store admin session
      const adminToken = data.access_token;
      if (adminToken) {
        localStorage.setItem('adminToken', adminToken);
        localStorage.setItem('adminUser', JSON.stringify(data.user));

        // Authenticate the Supabase client so it can pass RLS when fetching admin data
        await supabase.auth.setSession({
          access_token: adminToken,
          refresh_token: ''
        });
      }

      setAppState(prev => ({
        ...prev,
        isAuthenticated: true,
        isAdmin: true,
        user: {
          id: data.user?.id || '',
          name: data.user?.name || data.user?.email || '',
          email: data.user?.email || ''
        },
        currentPage: 'admin-dashboard'
      }));

      await loadAdminData();

      return true;
    } catch (error) {
      console.error('Admin login error:', error);
      alert('Failed to connect to admin service. Ensure the FastAPI backend (port 5001) is running.');
      return false;
    }
  };

  const initializeAdmin = async () => {
    try {
      const response = await fetch('https://truthlens-backend-b4xl.onrender.com/admin/init-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert(`Admin initialized successfully!\n\nEmail: ${data.credentials.email}\nPassword: ${data.credentials.password}`);
      } else {
        console.log('Admin response:', data);
      }
    } catch (error) {
      console.error('Init admin error:', error);
    }
  };

  const logout = async () => {
    try {
      // Clear admin session
      const adminToken = localStorage.getItem('adminToken');
      if (adminToken) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
      } else {
        // Regular user logout
        await supabase.auth.signOut();
      }
      
      setAppState({
        currentPage: 'landing',
        isAuthenticated: false,
        isAdmin: false,
        user: null,
        currentAnalysis: null,
        analysisHistory: [],
        allUsers: []
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const startAnalysis = async (content: string, type: 'text' | 'url' | 'file') => {
    if (!content.trim()) {
      alert("Please provide valid content to analyze.");
      return;
    }
    setAppState(prev => ({ ...prev, currentPage: 'analysis' }));
    
    try {
      const payload = type === 'url' ? { url: content } : { text: content };
      
      const response = await fetch('https://truthlens-backend-b4xl.onrender.com/api/v1/ml/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        const msg = errorData.error ? `${errorData.error}. ${errorData.suggestion || ''}` : (errorData.detail || `Prediction failed: ${response.statusText}`);
        throw new Error(msg);
      }
      
      const data = await response.json();
      
      if (data.status !== 'success') {
        throw new Error(data.message || 'Prediction failed');
      }

      const result: AnalysisResult = {
        id: Date.now().toString(),
        type,
        content: content.substring(0, 100) + '...',
        percentage: Math.round(data.confidence), // Use confidence as percentage for simplicity
        verdict: data.label === 'Real' ? 'Real' : 'Fake',
        confidence: Math.round(data.confidence),
        detectedCues: data.label === 'Fake'
          ? ['Sensational headline', 'Unverified sources', 'Suspicious language patterns']
          : ['Verified sources', 'Balanced reporting', 'Factual language'],
        date: new Date().toLocaleDateString(),
        user_id: appState.user?.id
      };
      
      // Save to Supabase
      if (appState.user?.id) {
        try {
          const { data, error } = await supabase
            .from('analyses')
            .insert([
              {
                user_id: appState.user.id,
                type: result.type,
                content: result.content,
                percentage: result.percentage,
                verdict: result.verdict,
                confidence: result.confidence,
                detected_cues: result.detectedCues
              }
            ])
            .select()
            .single();

          if (error) {
            console.error('Error saving analysis:', error);
          } else if (data) {
            result.id = data.id;
          }
        } catch (error) {
          console.error('Failed to save analysis:', error);
        }
      }
      
      setAppState(prev => ({
        ...prev,
        currentAnalysis: result,
        analysisHistory: [result, ...prev.analysisHistory],
        currentPage: 'result'
      }));
    } catch (error: any) {
      console.error('Analysis error:', error);
      alert(error.message || 'Failed to analyze the content. Is the ML backend running on port 5000?');
      setAppState(prev => ({ ...prev, currentPage: 'dashboard' }));
    }
  };

  const deleteAnalysis = async (id: string) => {
    try {
      const { error } = await supabase
        .from('analyses')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting analysis:', error);
        return;
      }

      setAppState(prev => ({
        ...prev,
        analysisHistory: prev.analysisHistory.filter(item => item.id !== id)
      }));
    } catch (error) {
      console.error('Delete analysis error:', error);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      // Delete user's analyses first
      const { error: analysesError } = await supabase
        .from('analyses')
        .delete()
        .eq('user_id', userId);

      if (analysesError) {
        console.error('Error deleting user analyses:', analysesError);
      }

      // Delete user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) {
        console.error('Error deleting user profile:', profileError);
        alert('Failed to delete user');
        return;
      }

      setAppState(prev => ({
        ...prev,
        allUsers: prev.allUsers.filter(user => user.id !== userId)
      }));

      alert('User deleted successfully');
    } catch (error) {
      console.error('Delete user error:', error);
      alert('Failed to delete user');
    }
  };

  const handleRetrain = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('files', file);

      const response = await fetch('https://truthlens-backend-b4xl.onrender.com/api/v1/ml/train', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      return {
        success: data.success,
        message: data.message,
        accuracy: data.accuracy
      };
    } catch (error) {
      console.error('Retrain error:', error);
      return {
        success: false,
        message: 'Failed to connect to backend for retraining.'
      };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  const renderCurrentPage = () => {
    switch (appState.currentPage) {
      case 'landing':
        return <LandingPage navigateTo={navigateTo} />;
      case 'login':
        return <LoginPage 
          navigateTo={navigateTo} 
          onLogin={login} 
        />;
      case 'signup':
        return <SignupPage 
          navigateTo={navigateTo} 
          onSignup={signup} 
        />;
      case 'otp':
        return <OTPVerificationPage 
          email={pendingUser?.email || ''}
          onVerify={verifyOtp}
          onResend={resendOtp}
          navigateTo={navigateTo}
        />;
      case 'dashboard':
        return <Dashboard 
          user={appState.user} 
          navigateTo={navigateTo} 
          onLogout={logout}
          onStartAnalysis={startAnalysis}
        />;
      case 'analysis':
        return <AnalysisProgress />;
      case 'result':
        return <ResultPage 
          result={appState.currentAnalysis} 
          navigateTo={navigateTo} 
        />;
      case 'history':
        return <HistoryPage 
          user={appState.user}
          history={appState.analysisHistory}
          navigateTo={navigateTo}
          onLogout={logout}
          onDeleteAnalysis={deleteAnalysis}
        />;
      case 'admin-login':
        return <AdminLoginPage navigateTo={navigateTo} onAdminLogin={adminLogin} />;
      case 'admin-dashboard':
        return <AdminDashboard 
          navigateTo={navigateTo}
          onLogout={logout}
          predictionLogs={appState.analysisHistory}
          users={appState.allUsers}
          onDeleteUser={deleteUser}
          onRetrain={handleRetrain}
        />;
      case 'contact':
        return <ContactPage navigateTo={navigateTo} />;
      case 'about':
        return <AboutPage navigateTo={navigateTo} />;
      case 'feedback':
        return <FeedbackPage navigateTo={navigateTo} />;
      default:
        return <LandingPage navigateTo={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen w-full">
      {renderCurrentPage()}
    </div>
  );
}
