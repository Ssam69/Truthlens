import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Eye, 
  Upload, 
  FileText, 
  Link, 
  User, 
  History, 
  LogOut, 
  Zap, 
  Shield,
  Brain,
  Sparkles
} from 'lucide-react';
import { PageType } from '../App';

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleAnalyze = () => {
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
      setTimeout(() => setIsSubmitting(false), 2000); // Reset in case of immediate generic error block without navigation
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

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Eye className="h-8 w-8 text-[var(--neon-blue)] glow-effect" />
            <span className="neon-text text-xl" style={{ color: 'var(--neon-blue)' }}>TruthLens</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <Button 
              variant="ghost" 
              onClick={() => navigateTo('dashboard')}
              className="text-[var(--neon-blue)] hover:text-white"
            >
              <Brain className="h-5 w-5 mr-2" />
              Home
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigateTo('history')}
              className="text-gray-300 hover:text-white"
            >
              <History className="h-5 w-5 mr-2" />
              History
            </Button>
            <Button 
              variant="ghost" 
              className="text-gray-300 hover:text-white"
            >
              <User className="h-5 w-5 mr-2" />
              Profile
            </Button>
            <Button 
              variant="ghost" 
              onClick={onLogout}
              className="text-red-400 hover:text-red-300"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12 slide-in">
          <h1 className="mb-4 bg-gradient-to-r from-[var(--neon-blue)] via-white to-[var(--neon-purple)] bg-clip-text text-transparent">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            Ready to detect fake news? Upload content and let our AI analyze its authenticity.
          </p>
          
          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-[var(--neon-blue)]/30">
              <CardContent className="p-6 text-center">
                <Brain className="h-8 w-8 text-[var(--neon-blue)] mx-auto mb-3" />
                <div className="text-2xl text-white mb-1">98.7%</div>
                <div className="text-gray-400 text-sm">Accuracy Rate</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-[var(--neon-green)]/30">
              <CardContent className="p-6 text-center">
                <Zap className="h-8 w-8 text-[var(--neon-green)] mx-auto mb-3" />
                <div className="text-2xl text-white mb-1">&lt; 3s</div>
                <div className="text-gray-400 text-sm">Analysis Time</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-[var(--neon-purple)]/30">
              <CardContent className="p-6 text-center">
                <Shield className="h-8 w-8 text-[var(--neon-purple)] mx-auto mb-3" />
                <div className="text-2xl text-white mb-1">100%</div>
                <div className="text-gray-400 text-sm">Privacy Protected</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Analysis Section */}
        <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-[var(--neon-blue)]/30 backdrop-blur-md slide-in">
          <CardHeader className="text-center">
            <CardTitle className="text-white flex items-center justify-center space-x-2">
              <Sparkles className="h-6 w-6 text-[var(--neon-blue)]" />
              <span>AI News Analysis</span>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Choose how you want to submit your news content for analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-800/50 border-gray-600">
                <TabsTrigger 
                  value="text" 
                  className="data-[state=active]:bg-[var(--neon-blue)] data-[state=active]:text-black"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Paste Text
                </TabsTrigger>
                <TabsTrigger 
                  value="url" 
                  className="data-[state=active]:bg-[var(--neon-blue)] data-[state=active]:text-black"
                >
                  <Link className="h-4 w-4 mr-2" />
                  Enter URL
                </TabsTrigger>
                <TabsTrigger 
                  value="file" 
                  className="data-[state=active]:bg-[var(--neon-blue)] data-[state=active]:text-black"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
                </TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="mt-8">
                <div className="space-y-4">
                  <Label htmlFor="news-text" className="text-gray-300">
                    Paste News Article Text
                  </Label>
                  <Textarea
                    id="news-text"
                    placeholder="Paste the news article content here... We'll analyze the text for authenticity indicators, source credibility, and linguistic patterns."
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    className="min-h-[200px] bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-[var(--neon-blue)] focus:ring-[var(--neon-blue)]"
                  />
                  <div className="text-sm text-gray-400">
                    <span className={textInput.length > 0 ? 'text-[var(--neon-green)]' : ''}>
                      {textInput.length}
                    </span> characters
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="url" className="mt-8">
                <div className="space-y-4">
                  <Label htmlFor="news-url" className="text-gray-300">
                    News Article URL
                  </Label>
                  <Input
                    id="news-url"
                    type="url"
                    placeholder="https://example.com/news-article"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-[var(--neon-blue)] focus:ring-[var(--neon-blue)]"
                  />
                  <p className="text-sm text-gray-400">
                    Enter the URL of the news article you want to verify. We'll fetch and analyze the content.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="file" className="mt-8">
                <div className="space-y-4">
                  <Label htmlFor="news-file" className="text-gray-300">
                    Upload News File
                  </Label>
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-[var(--neon-blue)] transition-colors">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <input
                      id="news-file"
                      type="file"
                      accept=".txt,.docx,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('news-file')?.click()}
                      className="border-gray-600 text-gray-300 hover:border-[var(--neon-blue)] hover:text-[var(--neon-blue)]"
                    >
                      Choose File
                    </Button>
                    <p className="text-sm text-gray-400 mt-2">
                      Supports .txt, .docx, and .pdf files (max 10MB)
                    </p>
                    {selectedFile && (
                      <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
                        <p className="text-[var(--neon-green)] text-sm">
                          ✓ {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Security Notice */}
            <div className="mt-8 p-4 bg-gradient-to-r from-[var(--neon-blue)]/10 to-[var(--neon-purple)]/10 border border-[var(--neon-blue)]/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-[var(--neon-blue)]" />
                <div>
                  <h4 className="text-white text-sm">Your data is safe</h4>
                  <p className="text-gray-400 text-sm">
                    AI will analyze only the text content. We don't store your personal data or share it with third parties.
                  </p>
                </div>
              </div>
            </div>

            {/* Analyze Button */}
            <div className="mt-8 text-center">
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzeDisabled() || isSubmitting}
                size="lg"
                className="bg-gradient-to-r from-[var(--electric-blue)] to-[var(--neon-blue)] hover:opacity-90 glow-effect disabled:opacity-50 disabled:cursor-not-allowed px-12"
              >
                <Brain className="h-5 w-5 mr-2" />
                Analyze News
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* How It Works */}
        <div className="mt-16 text-center">
          <h2 className="mb-8 text-white">How Our AI Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-[var(--electric-blue)] to-[var(--neon-blue)] rounded-full flex items-center justify-center mx-auto">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-white">Content Analysis</h3>
              <p className="text-gray-400">
                Advanced NLP models analyze linguistic patterns, sentiment, and writing style to detect anomalies.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-[var(--cyber-purple)] to-[var(--neon-purple)] rounded-full flex items-center justify-center mx-auto">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-white">Source Verification</h3>
              <p className="text-gray-400">
                Cross-references sources with our database of verified news outlets and fact-checking organizations.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-[var(--neon-green)] to-[var(--neon-blue)] rounded-full flex items-center justify-center mx-auto">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-white">Confidence Score</h3>
              <p className="text-gray-400">
                Generates a confidence score and provides detailed explanations for the authenticity assessment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}