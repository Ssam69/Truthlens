import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { 
  Eye, 
  Search, 
  Filter, 
  Trash2, 
  FileText, 
  Link, 
  Upload,
  Brain,
  History,
  User,
  LogOut,
  AlertTriangle,
  CheckCircle,
  Calendar,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { PageType, AnalysisResult } from '../App';

interface HistoryPageProps {
  user: { name: string; email: string } | null;
  history: AnalysisResult[];
  navigateTo: (page: PageType) => void;
  onLogout: () => void;
  onDeleteAnalysis: (id: string) => void;
}

export default function HistoryPage({ 
  user, 
  history, 
  navigateTo, 
  onLogout, 
  onDeleteAnalysis 
}: HistoryPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'fake' | 'real'>('all');

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'fake' && item.verdict === 'Fake') ||
                         (filterType === 'real' && item.verdict === 'Real');
    return matchesSearch && matchesFilter;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'text': return <FileText className="h-4 w-4" />;
      case 'url': return <Link className="h-4 w-4" />;
      case 'file': return <Upload className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getVerdictBadge = (verdict: string, percentage: number) => {
    const isFake = verdict === 'Fake';
    return (
      <Badge 
        variant={isFake ? "destructive" : "default"}
        className={`${
          isFake 
            ? 'bg-red-500/20 text-red-300 border-red-400' 
            : 'bg-[var(--neon-green)]/20 text-[var(--neon-green)] border-[var(--neon-green)]'
        }`}
      >
        {isFake ? (
          <AlertTriangle className="h-3 w-3 mr-1" />
        ) : (
          <CheckCircle className="h-3 w-3 mr-1" />
        )}
        {percentage}% {verdict}
      </Badge>
    );
  };

  const getTotalStats = () => {
    const total = history.length;
    const fake = history.filter(item => item.verdict === 'Fake').length;
    const real = history.filter(item => item.verdict === 'Real').length;
    const avgAccuracy = total > 0 ? 
      Math.round(history.reduce((sum, item) => sum + item.confidence, 0) / total) : 0;
    
    return { total, fake, real, avgAccuracy };
  };

  const stats = getTotalStats();

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
              className="text-gray-300 hover:text-white"
            >
              <Brain className="h-5 w-5 mr-2" />
              Home
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigateTo('history')}
              className="text-[var(--neon-blue)] hover:text-white"
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

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12 slide-in">
          <h1 className="mb-4 bg-gradient-to-r from-[var(--neon-blue)] via-white to-[var(--neon-purple)] bg-clip-text text-transparent">
            Analysis History
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            Review your past fake news analyses and track your verification activity.
          </p>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-[var(--neon-blue)]/30">
              <CardContent className="p-6 text-center">
                <History className="h-8 w-8 text-[var(--neon-blue)] mx-auto mb-3" />
                <div className="text-2xl text-white mb-1">{stats.total}</div>
                <div className="text-gray-400 text-sm">Total Analyses</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-red-400/30">
              <CardContent className="p-6 text-center">
                <TrendingDown className="h-8 w-8 text-red-400 mx-auto mb-3" />
                <div className="text-2xl text-white mb-1">{stats.fake}</div>
                <div className="text-gray-400 text-sm">Fake News Detected</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-[var(--neon-green)]/30">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-[var(--neon-green)] mx-auto mb-3" />
                <div className="text-2xl text-white mb-1">{stats.real}</div>
                <div className="text-gray-400 text-sm">Real News Verified</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-[var(--neon-purple)]/30">
              <CardContent className="p-6 text-center">
                <Brain className="h-8 w-8 text-[var(--neon-purple)] mx-auto mb-3" />
                <div className="text-2xl text-white mb-1">{stats.avgAccuracy}%</div>
                <div className="text-gray-400 text-sm">Avg Confidence</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Search and Filter */}
        <Card className="mb-8 bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-[var(--neon-blue)]/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Search className="h-5 w-5 text-[var(--neon-blue)]" />
              <span>Search & Filter</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-[var(--neon-blue)] focus:ring-[var(--neon-blue)]"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterType === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilterType('all')}
                  className={filterType === 'all' ? 'bg-[var(--neon-blue)] text-white' : 'border-gray-600 text-gray-300'}
                >
                  All
                </Button>
                <Button
                  variant={filterType === 'fake' ? 'default' : 'outline'}
                  onClick={() => setFilterType('fake')}
                  className={filterType === 'fake' ? 'bg-red-500 text-white' : 'border-gray-600 text-gray-300'}
                >
                  Fake
                </Button>
                <Button
                  variant={filterType === 'real' ? 'default' : 'outline'}
                  onClick={() => setFilterType('real')}
                  className={filterType === 'real' ? 'bg-[var(--neon-green)] text-white' : 'border-gray-600 text-gray-300'}
                >
                  Real
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* History Table */}
        {filteredHistory.length > 0 ? (
          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-600/30">
            <CardHeader>
              <CardTitle className="text-white">Analysis Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-600">
                      <TableHead className="text-gray-400">Date</TableHead>
                      <TableHead className="text-gray-400">Type</TableHead>
                      <TableHead className="text-gray-400">Content</TableHead>
                      <TableHead className="text-gray-400">Result</TableHead>
                      <TableHead className="text-gray-400">Confidence</TableHead>
                      <TableHead className="text-gray-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredHistory.map((item) => (
                      <TableRow key={item.id} className="border-gray-700 hover:bg-gray-800/50">
                        <TableCell className="text-gray-300">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span>{item.date}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-gray-600 text-gray-300">
                            {getTypeIcon(item.type)}
                            <span className="ml-1">{item.type.toUpperCase()}</span>
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-300 max-w-xs">
                          <div className="truncate" title={item.content}>
                            {item.content}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getVerdictBadge(item.verdict, item.percentage)}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          <div className="flex items-center space-x-2">
                            <div 
                              className={`w-2 h-2 rounded-full ${
                                item.confidence >= 80 ? 'bg-[var(--neon-green)]' :
                                item.confidence >= 60 ? 'bg-yellow-400' : 'bg-red-400'
                              }`}
                            ></div>
                            <span>{item.confidence}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-[var(--neon-blue)] text-[var(--neon-blue)] hover:bg-[var(--neon-blue)] hover:text-black"
                            >
                              View Details
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onDeleteAnalysis(item.id)}
                              className="border-red-400 text-red-400 hover:bg-red-400 hover:text-black"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-600/30">
            <CardContent className="p-12 text-center">
              <History className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-white mb-2">No Analysis History</h3>
              <p className="text-gray-400 mb-6">
                {searchTerm || filterType !== 'all' 
                  ? 'No results match your current search or filter criteria.'
                  : 'You haven\'t performed any analyses yet. Start by analyzing your first news article!'
                }
              </p>
              <Button
                onClick={() => navigateTo('dashboard')}
                className="bg-gradient-to-r from-[var(--electric-blue)] to-[var(--neon-blue)] hover:opacity-90"
              >
                <Brain className="h-5 w-5 mr-2" />
                Start First Analysis
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Profile Section */}
        <Card className="mt-8 bg-gradient-to-r from-gray-900/50 to-gray-800/50 border-[var(--neon-purple)]/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <User className="h-5 w-5 text-[var(--neon-purple)]" />
              <span>Profile Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-gray-300 mb-2">Account Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Name:</span>
                    <span className="text-white">{user?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Email:</span>
                    <span className="text-white">{user?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Member since:</span>
                    <span className="text-white">October 2024</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-gray-300 mb-2">Account Actions</h4>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    Edit Profile
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    Change Password
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    Export History
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}