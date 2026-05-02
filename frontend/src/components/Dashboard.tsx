import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Eye, Upload, FileText, Link, User, History, LogOut, 
  Zap, Shield, Brain, Sparkles, Moon, Sun 
} from 'lucide-react';
import { PageType } from '../App';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Drawer } from 'vaul';

interface DashboardProps {
  user: { name: string; email: string } | null;
  navigateTo: (page: PageType) => void;
  onLogout: () => void;
  onStartAnalysis: (content: string, type: 'text' | 'url' | 'file') => void;
}

export default function Dashboard({ user, navigateTo, onLogout, onStartAnalysis }: DashboardProps) {
  const [textInput, setTextInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState('text');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { theme, setTheme } = useTheme();

  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleAnalyze = () => {
    triggerHaptic();
    let content = '';
    let type: 'text' | 'url' | 'file' = 'text';

    switch (activeTab) {
      case 'text':
        content = textInput;
        type = 'text';
        break;
      case 'url':
        content = urlInput;
        type = 'url';
        break;
      case 'file':
        content = selectedFile?.name || '';
        type = 'file';
        break;
    }

    if (content.trim()) {
      setIsSubmitting(true);
      onStartAnalysis(content, type);
      setTimeout(() => setIsSubmitting(false), 2000); 
    }
  };

  const isAnalyzeDisabled = () => {
    switch (activeTab) {
      case 'text':
        return !textInput.trim();
      case 'url':
        return !urlInput.trim();
      case 'file':
        return !selectedFile;
      default:
        return true;
    }
  };

  // Framer Motion Variants for Spring Physics & Stagger
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    show: { 
      y: 0, opacity: 1, scale: 1,
      transition: { type: "spring", stiffness: 280, damping: 20 }
    }
  };

  const springHover = {
    scale: 1.02,
    transition: { type: "spring", stiffness: 400, damping: 15 }
  };

  const springTap = {
    scale: 0.96
  };

  const toggleTheme = () => {
    triggerHaptic();
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen">
      {/* Navigation Layer */}
      <nav className="sticky top-0 z-50 backdrop-blur-md border-b-[1px] border-[var(--border-color)] bg-[var(--surface-color)]/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={springHover}
            whileTap={springTap}
          >
            <Eye className="h-8 w-8 text-[var(--accent-primary)] glow-effect" />
            <span className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>TruthLens</span>
          </motion.div>
          
          <div className="flex items-center space-x-2 md:space-x-6">
            <button 
              className="theme-toggle" 
              onClick={toggleTheme}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <div className="hidden md:flex items-center space-x-2">
              <Button 
                variant="ghost" 
                onClick={() => { triggerHaptic(); navigateTo('dashboard'); }}
                className="text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 rounded-full font-medium"
              >
                <Brain className="h-5 w-5 mr-2" />
                Home
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => { triggerHaptic(); navigateTo('history'); }}
                className="hover:bg-[var(--surface-tonal)] rounded-full font-medium"
              >
                <History className="h-5 w-5 mr-2" />
                History
              </Button>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => { triggerHaptic(); onLogout(); }}
              className="text-red-500 hover:bg-red-500/10 rounded-full font-medium hidden md:flex"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </Button>
            
            {/* Mobile Bottom Sheet Modal */}
            <div className="md:hidden">
              <Drawer.Root>
                <Drawer.Trigger asChild>
                  <Button variant="ghost" className="rounded-full w-12 h-12 p-0" onClick={triggerHaptic}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                  </Button>
                </Drawer.Trigger>
                <Drawer.Portal>
                  <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity" />
                  <Drawer.Content className="vaul-content flex flex-col rounded-t-[32px] h-[350px] mt-24 fixed bottom-0 left-0 right-0 z-50 p-6">
                    <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-[var(--text-secondary)]/30 mb-8" />
                    <div className="flex flex-col space-y-4 w-full">
                      <Button 
                        variant="ghost" 
                        onClick={() => { triggerHaptic(); navigateTo('dashboard'); }}
                        className="w-full justify-start text-[var(--accent-primary)] rounded-2xl h-14 text-lg font-bold bg-[var(--accent-primary)]/10"
                      >
                        <Brain className="h-6 w-6 mr-4" />
                        Home
                      </Button>
                      <Button 
                        variant="ghost" 
                        onClick={() => { triggerHaptic(); navigateTo('history'); }}
                        className="w-full justify-start rounded-2xl h-14 text-lg font-semibold hover:bg-[var(--surface-tonal)]"
                      >
                        <History className="h-6 w-6 mr-4" />
                        History
                      </Button>
                      <Button 
                        variant="ghost" 
                        onClick={() => { triggerHaptic(); onLogout(); }}
                        className="w-full justify-start text-red-500 rounded-2xl h-14 text-lg font-semibold hover:bg-red-500/10"
                      >
                        <LogOut className="h-6 w-6 mr-4" />
                        Logout
                      </Button>
                    </div>
                  </Drawer.Content>
                </Drawer.Portal>
              </Drawer.Root>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <motion.div 
          className="mb-12 md:mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <h1 className="mb-4">
            Welcome back, <span className="text-gradient font-extrabold">{user?.name}</span>!
          </h1>
          <p className="text-xl max-w-2xl font-medium">
            Hyper-modern AI news authentication. Experience precision verification backed by Deep Space logic.
          </p>
        </motion.div>

        {/* Bento Grid Architecture */}
        <motion.div 
          className="bento-grid"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Main Analysis Bento Card - Spans 2 Rows / 2 Cols on large screens */}
          <motion.div 
            variants={itemVariants}
            className="bento-card bento-col-span-2 bento-row-span-2 flex flex-col"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-[var(--accent-primary)]/10 rounded-2xl">
                <Sparkles className="h-6 w-6 text-[var(--accent-primary)] glow-effect" />
              </div>
              <div>
                <h2 className="text-2xl font-bold m-0">AI Core Analysis</h2>
                <p className="text-sm m-0">Input content for instant neural verification</p>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={(val) => { triggerHaptic(); setActiveTab(val); }} className="w-full flex-grow flex flex-col">
              <TabsList className="grid w-full grid-cols-3 bg-[var(--surface-tonal)]/50 rounded-2xl p-1 mb-6 border-[1px] border-[var(--glass-border)]">
                <TabsTrigger value="text" className="rounded-xl data-[state=active]:bg-[var(--surface-color)] data-[state=active]:shadow-sm font-semibold transition-all">
                  <FileText className="h-4 w-4 mr-2" /> Paste
                </TabsTrigger>
                <TabsTrigger value="url" className="rounded-xl data-[state=active]:bg-[var(--surface-color)] data-[state=active]:shadow-sm font-semibold transition-all">
                  <Link className="h-4 w-4 mr-2" /> URL
                </TabsTrigger>
                <TabsTrigger value="file" className="rounded-xl data-[state=active]:bg-[var(--surface-color)] data-[state=active]:shadow-sm font-semibold transition-all">
                  <Upload className="h-4 w-4 mr-2" /> File
                </TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="flex-grow flex flex-col mt-0 space-y-4">
                <Textarea
                  placeholder="Paste article text here for deep analysis..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="bento-input flex-grow min-h-[220px] resize-none"
                />
              </TabsContent>

              <TabsContent value="url" className="flex-grow flex flex-col mt-0 space-y-4">
                <Input
                  type="url"
                  placeholder="https://example.com/article"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="bento-input h-16 text-lg"
                />
                <div className="p-4 bg-[var(--surface-tonal)] rounded-2xl mt-4 border border-[var(--glass-border)]">
                  <p className="text-sm text-[var(--text-secondary)] m-0">
                    The Deep Space engine will fetch the remote URL and process linguistic markers.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="file" className="flex-grow flex flex-col mt-0 space-y-4">
                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="border-2 border-dashed border-[var(--accent-primary)]/30 rounded-3xl p-10 flex flex-col items-center justify-center flex-grow bg-[var(--accent-primary)]/5 cursor-pointer transition-colors hover:bg-[var(--accent-primary)]/10"
                  onClick={() => { triggerHaptic(); document.getElementById('news-file')?.click(); }}
                >
                  <Upload className="h-12 w-12 text-[var(--accent-primary)] mb-4 drop-shadow-md" />
                  <input id="news-file" type="file" accept=".txt,.docx,.pdf" onChange={handleFileChange} className="hidden" />
                  <h3 className="text-lg font-semibold mb-2">Tap to Upload Document</h3>
                  <p className="text-sm opacity-70">Supports PDF, DOCX, TXT (Max 10MB)</p>
                  
                  {selectedFile && (
                    <div className="mt-6 p-4 w-full bg-[var(--surface-color)] rounded-xl border border-[var(--glass-border)] flex items-center justify-between">
                      <span className="font-medium truncate mr-4">{selectedFile.name}</span>
                      <span className="text-sm font-bold text-green-500 bg-green-500/10 px-3 py-1 rounded-full">Ready</span>
                    </div>
                  )}
                </motion.div>
              </TabsContent>
            </Tabs>

            <motion.div 
              className="mt-6"
              whileHover={isAnalyzeDisabled() ? {} : springHover} 
              whileTap={isAnalyzeDisabled() ? {} : springTap}
            >
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzeDisabled() || isSubmitting}
                className={`w-full h-16 rounded-2xl text-lg font-bold shadow-xl transition-all ${
                  isAnalyzeDisabled() 
                  ? 'bg-[var(--surface-tonal)] text-[var(--text-secondary)] border-[var(--glass-border)] opacity-60' 
                  : 'bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white hover:shadow-2xl hover:opacity-100 border-none'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <Brain className="animate-pulse h-6 w-6 mr-3" /> Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Zap className="h-6 w-6 mr-3" /> Initiate Scan
                  </span>
                )}
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats Bento Items */}
          <motion.div variants={itemVariants} className="bento-card tonal flex flex-col justify-center">
            <div className="p-3 bg-[var(--accent-primary)]/10 w-fit rounded-2xl mb-4">
              <Brain className="h-8 w-8 text-[var(--accent-primary)]" />
            </div>
            <div className="text-4xl font-extrabold text-[var(--text-primary)] mb-1 tracking-tight">98.7%</div>
            <div className="text-[var(--text-secondary)] font-medium">Neural Accuracy Rate</div>
          </motion.div>

          <motion.div variants={itemVariants} className="bento-card tonal flex flex-col justify-center">
            <div className="p-3 bg-[var(--accent-secondary)]/10 w-fit rounded-2xl mb-4">
              <Zap className="h-8 w-8 text-[var(--accent-secondary)]" />
            </div>
            <div className="text-4xl font-extrabold text-[var(--text-primary)] mb-1 tracking-tight">&lt; 3s</div>
            <div className="text-[var(--text-secondary)] font-medium">Quantum Analysis Time</div>
          </motion.div>

          {/* Privacy Notice Bento */}
          <motion.div variants={itemVariants} className="bento-card border border-[var(--accent-primary)]/20 bento-row-span-1 bg-[var(--accent-primary)]/5">
            <div className="flex items-start space-x-4 h-full">
              <div className="p-3 bg-[var(--surface-color)] shadow-sm rounded-2xl border border-[var(--glass-border)]">
                <Shield className="h-6 w-6 text-[var(--accent-primary)]" />
              </div>
              <div className="flex flex-col justify-center h-full pb-2">
                <h3 className="text-lg font-bold mb-1 m-0">Fort Knox Privacy</h3>
                <p className="text-sm m-0 leading-relaxed font-medium">
                  We process data directly without retaining payloads. Your search history remains strictly local to your user profile.
                </p>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="bento-card border border-[var(--accent-secondary)]/20 bento-row-span-1 bg-[var(--accent-secondary)]/5">
            <div className="flex items-start space-x-4 h-full">
              <div className="p-3 bg-[var(--surface-color)] shadow-sm rounded-2xl border border-[var(--glass-border)]">
                <Eye className="h-6 w-6 text-[var(--accent-secondary)]" />
              </div>
              <div className="flex flex-col justify-center h-full pb-2">
                <h3 className="text-lg font-bold mb-1 m-0">Beyond Surface Level</h3>
                <p className="text-sm m-0 leading-relaxed font-medium">
                  Cross-referencing global databases and fact-checking origins in real-time.
                </p>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>

      <style>{`
        /* Hide scrollbars strictly for modern look */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: var(--bg-color); }
        ::-webkit-scrollbar-thumb { background: var(--surface-tonal); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: var(--accent-primary); }
      `}</style>
    </div>
  );
}