import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "npm:@supabase/supabase-js@2";

const app = new Hono();

// Create Supabase client for auth
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-b599641f/health", (c) => {
  return c.json({ status: "ok" });
});

// User signup endpoint
app.post("/make-server-b599641f/signup", async (c) => {
  try {
    const { name, email, password } = await c.req.json();
    
    if (!name || !email || !password) {
      return c.json({ error: 'Name, email, and password are required' }, 400);
    }

    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log(`Signup error for ${email}: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    // Store additional user profile data in KV store
    await kv.set(`user_profile:${data.user.id}`, {
      id: data.user.id,
      name,
      email,
      registeredDate: new Date().toISOString(),
      analysisCount: 0,
      isAdmin: false
    });

    return c.json({ 
      success: true,
      user: {
        id: data.user.id,
        name,
        email
      }
    });
  } catch (error) {
    console.log(`Signup error: ${error.message}`);
    return c.json({ error: 'Failed to create user' }, 500);
  }
});

// User login endpoint
app.post("/make-server-b599641f/login", async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    // Create a temporary client for login (using anon key)
    const loginClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { data, error } = await loginClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log(`Login error for ${email}: ${error.message}`);
      return c.json({ error: 'Invalid email or password' }, 401);
    }

    // Get user profile from KV store
    const userProfile = await kv.get(`user_profile:${data.user.id}`);

    return c.json({
      success: true,
      accessToken: data.session.access_token,
      user: {
        id: data.user.id,
        name: userProfile?.name || data.user.email?.split('@')[0],
        email: data.user.email
      }
    });
  } catch (error) {
    console.log(`Login error: ${error.message}`);
    return c.json({ error: 'Failed to login' }, 500);
  }
});

// Admin login endpoint
app.post("/make-server-b599641f/admin-login", async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    // Create a temporary client for login using anon key
    const loginClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    // Authenticate with Supabase
    const { data, error } = await loginClient.auth.signInWithPassword({
      email,
      password,
    });

    // Handle authentication failure
    if (error || !data.session) {
      console.log(`Admin login failed for ${email}: ${error?.message}`);
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    // Verify user is admin by checking Supabase metadata
    if (data.user.user_metadata?.role !== 'admin') {
      console.log(`Admin access denied for ${email}: not admin`);
      return c.json({ error: 'Admin access required' }, 403);
    }

    // Return admin session and user data
    return c.json({
      success: true,
      accessToken: data.session.access_token,
      user: {
        id: data.user.id,
        name: data.user.user_metadata?.name || 'Admin',
        email: data.user.email,
        isAdmin: true
      }
    });
  } catch (error) {
    console.log(`Admin login error: ${error.message}`);
    return c.json({ error: 'Failed to login as admin' }, 500);
  }
});

// Get current user session
app.get("/make-server-b599641f/user", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const { data, error } = await supabase.auth.getUser(accessToken);

    if (error || !data.user) {
      return c.json({ error: 'Invalid or expired token' }, 401);
    }

    // Get user profile from KV store
    const userProfile = await kv.get(`user_profile:${data.user.id}`);

    return c.json({
      success: true,
      user: {
        id: data.user.id,
        name: userProfile?.name || data.user.email?.split('@')[0],
        email: data.user.email,
        isAdmin: userProfile?.isAdmin || false
      }
    });
  } catch (error) {
    console.log(`Get user error: ${error.message}`);
    return c.json({ error: 'Failed to get user' }, 500);
  }
});

// Logout endpoint
app.post("/make-server-b599641f/logout", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (accessToken) {
      await supabase.auth.admin.signOut(accessToken);
    }

    return c.json({ success: true });
  } catch (error) {
    console.log(`Logout error: ${error.message}`);
    return c.json({ success: true }); // Still return success
  }
});

// Save analysis result (requires authentication)
app.post("/make-server-b599641f/analysis", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized: Invalid token' }, 401);
    }

    const analysisData = await c.req.json();
    const analysisId = `analysis:${Date.now()}:${user.id}`;

    // Save analysis result
    await kv.set(analysisId, {
      ...analysisData,
      userId: user.id,
      createdAt: new Date().toISOString()
    });

    // Get user's analysis list
    const userAnalysesList = await kv.get(`user_analyses:${user.id}`) || [];
    userAnalysesList.unshift(analysisId);
    await kv.set(`user_analyses:${user.id}`, userAnalysesList);

    // Update analysis count
    const userProfile = await kv.get(`user_profile:${user.id}`);
    if (userProfile) {
      userProfile.analysisCount = (userProfile.analysisCount || 0) + 1;
      await kv.set(`user_profile:${user.id}`, userProfile);
    }

    return c.json({ 
      success: true, 
      analysisId,
      analysis: analysisData 
    });
  } catch (error) {
    console.log(`Save analysis error: ${error.message}`);
    return c.json({ error: 'Failed to save analysis' }, 500);
  }
});

// Get analysis history (requires authentication)
app.get("/make-server-b599641f/analysis-history", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized: Invalid token' }, 401);
    }

    // Get user's analysis list
    const userAnalysesList = await kv.get(`user_analyses:${user.id}`) || [];
    
    // Fetch all analyses
    const analyses = [];
    for (const analysisId of userAnalysesList) {
      const analysis = await kv.get(analysisId);
      if (analysis) {
        analyses.push({
          id: analysisId,
          ...analysis
        });
      }
    }

    return c.json({ 
      success: true, 
      history: analyses 
    });
  } catch (error) {
    console.log(`Get analysis history error: ${error.message}`);
    return c.json({ error: 'Failed to get analysis history' }, 500);
  }
});

// Delete analysis (requires authentication)
app.delete("/make-server-b599641f/analysis/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized: Invalid token' }, 401);
    }

    const analysisId = c.req.param('id');

    // Remove from user's analysis list
    const userAnalysesList = await kv.get(`user_analyses:${user.id}`) || [];
    const updatedList = userAnalysesList.filter((id: string) => id !== analysisId);
    await kv.set(`user_analyses:${user.id}`, updatedList);

    // Delete the analysis
    await kv.del(analysisId);

    return c.json({ success: true });
  } catch (error) {
    console.log(`Delete analysis error: ${error.message}`);
    return c.json({ error: 'Failed to delete analysis' }, 500);
  }
});

// Admin: Get all users (requires admin authentication)
app.get("/make-server-b599641f/admin/users", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const accessToken = authHeader.split(' ')[1];

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized: Invalid token' }, 401);
    }

    // Check if user is admin by checking metadata
    if (user.user_metadata?.role !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403);
    }

    // Get all user profiles
    const allProfiles = await kv.getByPrefix('user_profile:');
    const users = allProfiles.map(profile => ({
      id: profile.id,
      name: profile.name,
      email: profile.email,
      registeredDate: profile.registeredDate,
      analysisCount: profile.analysisCount || 0
    }));

    return c.json({ 
      success: true, 
      users 
    });
  } catch (error) {
    console.log(`Get all users error: ${error.message}`);
    return c.json({ error: 'Failed to get users' }, 500);
  }
});

// Admin: Delete user (requires admin authentication)
app.delete("/make-server-b599641f/admin/user/:userId", async (c) => {
  try {uthHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const accessToken = authHeader.split(' ')[1];

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized: Invalid token' }, 401);
    }

    // Check if user is admin by checking metadata
    if (user.user_metadata?.role !== 'admin') {
      return c.json({ error: ') {
      return c.json({ error: 'Unauthorized: Admin access required' }, 403);
    }

    const userIdToDelete = c.req.param('userId');

    // Delete user from Supabase Auth
    await supabase.auth.admin.deleteUser(userIdToDelete);

    // Delete user profile
    await kv.del(`user_profile:${userIdToDelete}`);

    // Delete user's analyses
    const userAnalysesList = await kv.get(`user_analyses:${userIdToDelete}`) || [];
    for (const analysisId of userAnalysesList) {
      await kv.del(analysisId);
    }
    await kv.del(`user_analyses:${userIdToDelete}`);

    return c.json({ success: true });
  } catch (error) {
    console.log(`Delete user error: ${error.message}`);
    return c.json({ error: 'Failed to delete user' }, 500);
  }
});

// Admin: Get all predictions/analyses (requires admin authentication)
app.get("/make-server-b599641f/admin/predictions", async (c) => {
  try {uthHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const accessToken = authHeader.split(' ')[1];

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized: Invalid token' }, 401);
    }

    // Check if user is admin by checking metadata
    if (user.user_metadata?.role !== 'admin') {
      return c.json({ error: ') {
      return c.json({ error: 'Unauthorized: Admin access required' }, 403);
    }

    // Get all analyses
    const allAnalyses = await kv.getByPrefix('analysis:');
    
    // Enrich with user information
    const predictions = [];
    for (const analysis of allAnalyses) {
      const userProf = await kv.get(`user_profile:${analysis.userId}`);
      predictions.push({
        ...analysis,
        userName: userProf?.name,
        userEmail: userProf?.email
      });
    }

    return c.json({ 
      success: true, 
      predictions 
    });
  } catch (error) {
    console.log(`Get predictions error: ${error.message}`);
    return c.json({ error: 'Failed to get predictions' }, 500);
  }
});

// Initialize admin user (one-time setup)
app.post("/make-server-b599641f/init-admin", async (c) => {
  try {
    const adminEmail = 'admin@truthlens.com';
    const adminPassword = 'admin123';

    // Check if admin already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers().catch(() => ({ data: { users: [] } }));
    const adminExists = existingUsers?.users?.some((u: any) => u.email === adminEmail);

    if (adminExists) {
      console.log('Admin user already exists');
      return c.json({ message: 'Admin user already exists', success: true });
    }

    // Create admin user in Supabase Auth with admin role in metadata
    const { data, error } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        name: 'Admin',
        role: 'admin'
      }
    });

    if (error) {
      console.log(`Admin creation error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    console.log(`Admin user created successfully: ${adminEmail}`);

    return c.json({ 
      success: true,
      message: 'Admin user created successfully',
      credentials: {
        email: adminEmail,
        password: adminPassword
      }
    });
  } catch (error) {
    console.log(`Init admin error: ${error.message}`);
    return c.json({ error: 'Failed to initialize admin' }, 500);
  }
});

// Submit feedback (no authentication required)
app.post("/make-server-b599641f/feedback", async (c) => {
  try {
    const feedbackData = await c.req.json();
    const feedbackId = `feedback:${Date.now()}`;

    // Save feedback
    await kv.set(feedbackId, {
      ...feedbackData,
      submittedAt: new Date().toISOString()
    });

    return c.json({ 
      success: true, 
      message: 'Feedback submitted successfully' 
    });
  } catch (error) {
    console.log(`Submit feedback error: ${error.message}`);
    return c.json({ error: 'Failed to submit feedback' }, 500);
  }
});

// Admin: Get all feedback (requires admin authentication)
app.get("/make-server-b599641f/admin/feedback", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const accessToken = authHeader.split(' ')[1];

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized: Invalid token' }, 401);
    }

    // Check if user is admin by checking metadata
    if (user.user_metadata?.role !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403);
    }

    // Get all feedback
    const allFeedback = await kv.getByPrefix('feedback:');

    return c.json({ 
      success: true, 
      feedback: allFeedback 
    });
  } catch (error) {
    console.log(`Get feedback error: ${error.message}`);
    return c.json({ error: 'Failed to get feedback' }, 500);
  }
});

Deno.serve(app.fetch);