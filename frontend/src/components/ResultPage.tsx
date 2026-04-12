import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  Share2, 
  Download, 
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Shield,
  Brain,
  Clock,
  FileText
} from 'lucide-react';
import { PageType, AnalysisResult } from '../App';

interface ResultPageProps {
  result: AnalysisResult | null;
  navigateTo: (page: PageType) => void;
}

export default function ResultPage({ result, navigateTo }: ResultPageProps) {
  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">No analysis result available</p>
      </div>
    );
  }

  const isFake = result.verdict === 'Fake';
  const confidenceColor = result.confidence >= 80 ? 'text-[var(--neon-green)]' : 
                          result.confidence >= 60 ? 'text-yellow-400' : 'text-red-400';

  const getGaugeColor = (percentage: number) => {
    if (percentage <= 30) return 'from-[var(--neon-green)] to-green-400';
    if (percentage <= 70) return 'from-yellow-400 to-orange-400';
    return 'from-red-400 to-[var(--destructive)]';
  };

  const getVerdictIcon = () => {
    return isFake ? (
      <AlertTriangle className="h-12 w-12 text-red-400" />
    ) : (
      <CheckCircle className="h-12 w-12 text-[var(--neon-green)]" />
    );
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Eye className="h-8 w-8 text-[var(--neon-blue)] glow-effect" />
            <span className="neon-text text-xl" style={{ color: 'var(--neon-blue)' }}>TruthLens</span>
          </div>
          <Button 
            onClick={() => navigateTo('dashboard')}
            variant="ghost"
            className="text-gray-300 hover:text-white"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            New Analysis
          </Button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12 slide-in">
          <h1 className="mb-4 bg-gradient-to-r from-[var(--neon-blue)] via-white to-[var(--neon-purple)] bg-clip-text text-transparent">
            Analysis Complete
          </h1>
          <p className="text-gray-400 text-lg">
            Here's what our AI found about your content
          </p>
        </div>

        {/* Main Result Card */}
        <Card className={`mb-8 slide-in border-2 ${
          isFake 
            ? 'bg-gradient-to-br from-red-900/20 to-red-800/20 border-red-400/50' 
            : 'bg-gradient-to-br from-green-900/20 to-green-800/20 border-[var(--neon-green)]/50'
        } backdrop-blur-md`}>
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="mb-6">
                {getVerdictIcon()}
              </div>
              <h2 className={`mb-4 ${isFake ? 'text-red-400' : 'text-[var(--neon-green)]'}`}>
                {result.percentage}% {result.verdict} News Probability
              </h2>
              
              {/* Gauge Chart */}
              <div className="relative w-64 h-32 mx-auto mb-6">
                <div className="absolute inset-0 bg-gray-700 rounded-t-full"></div>
                <div 
                  className={`absolute inset-0 bg-gradient-to-r ${getGaugeColor(result.percentage)} rounded-t-full`}
                  style={{
                    clipPath: `polygon(0 100%, 0 0, ${result.percentage}% 0, ${result.percentage}% 100%)`
                  }}
                ></div>
                <div className="absolute inset-4 bg-gray-900 rounded-t-full"></div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center">
                  <div className={`text-3xl mb-1 ${isFake ? 'text-red-400' : 'text-[var(--neon-green)]'}`}>
                    {result.percentage}%
                  </div>
                  <div className="text-gray-400 text-sm">Confidence</div>
                </div>
              </div>

              <Badge 
                variant={isFake ? "destructive" : "default"}
                className={`text-lg px-6 py-2 ${
                  isFake 
                    ? 'bg-red-500/20 text-red-300 border-red-400' 
                    : 'bg-[var(--neon-green)]/20 text-[var(--neon-green)] border-[var(--neon-green)]'
                }`}
              >
                {result.verdict} News
              </Badge>
            </div>

            {/* Confidence Meter */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">AI Confidence Level</span>
                <span className={confidenceColor}>{result.confidence}%</span>
              </div>
              <Progress 
                value={result.confidence} 
                className="h-3 bg-gray-700"
              />
            </div>
          </CardContent>
        </Card>

        {/* Detected Indicators */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-[var(--neon-blue)]/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Brain className="h-5 w-5 text-[var(--neon-blue)]" />
                <span>Detected Indicators</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.detectedCues.map((cue, index) => (
                  <div 
                    key={index}
                    className={`flex items-center space-x-3 p-3 rounded-lg ${
                      isFake 
                        ? 'bg-red-500/10 border border-red-400/20' 
                        : 'bg-[var(--neon-green)]/10 border border-[var(--neon-green)]/20'
                    }`}
                  >
                    {isFake ? (
                      <TrendingDown className="h-5 w-5 text-red-400" />
                    ) : (
                      <TrendingUp className="h-5 w-5 text-[var(--neon-green)]" />
                    )}
                    <span className="text-gray-300">{cue}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-[var(--neon-purple)]/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <FileText className="h-5 w-5 text-[var(--neon-purple)]" />
                <span>Analysis Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Content Type</span>
                  <Badge variant="outline" className="border-gray-600 text-gray-300">
                    {result.type.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Analysis Date</span>
                  <span className="text-gray-300">{result.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Processing Time</span>
                  <span className="text-gray-300">2.4 seconds</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Model Version</span>
                  <span className="text-gray-300">TruthLens v3.2</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Preview */}
        <Card className="mb-8 bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-600/30">
          <CardHeader>
            <CardTitle className="text-white">Analyzed Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-600">
              <p className="text-gray-300 leading-relaxed">
                {result.content}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigateTo('dashboard')}
            size="lg"
            className="bg-gradient-to-r from-[var(--electric-blue)] to-[var(--neon-blue)] hover:opacity-90"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Analyze Another Article
          </Button>
          <Button
            onClick={() => navigateTo('history')}
            variant="outline"
            size="lg"
            className="border-[var(--neon-purple)] text-[var(--neon-purple)] hover:bg-[var(--neon-purple)] hover:text-black"
          >
            <Clock className="h-5 w-5 mr-2" />
            View History
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <Share2 className="h-5 w-5 mr-2" />
            Share Result
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <Download className="h-5 w-5 mr-2" />
            Download Report
          </Button>
        </div>

        {/* Disclaimer */}
        <Card className="mt-8 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-yellow-400/30">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-yellow-400 mt-1" />
              <div>
                <h4 className="text-yellow-400 mb-2">Important Disclaimer</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  This analysis is provided by AI and should be used as a supplementary tool. 
                  Always verify information through multiple trusted sources and exercise critical thinking. 
                  TruthLens is not responsible for decisions made based on these results.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}