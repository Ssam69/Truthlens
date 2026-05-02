import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import {
  Eye,
  ArrowLeft,
  Target,
  Shield,
  Zap,
  Users,
  Award,
  Globe,
  TrendingUp,
  CheckCircle,
  Brain,
  Sparkles
} from 'lucide-react';
import { PageType } from '../App';

interface AboutPageProps {
  navigateTo: (page: PageType) => void;
}

export default function AboutPage({ navigateTo }: AboutPageProps) {
  const teamMembers = [
    {
      name: 'Sam Alfrin',
      role: 'CEO & Co-Founder',
      description: 'AI researcher with 15+ years in NLP and machine learning',
      icon: Brain
    },
    {
      name: 'Parth Shinde',
      role: 'CTO & Co-Founder',
      description: 'Former Google engineer specializing in deep learning systems',
      icon: Zap
    },
    {
      name: 'Omkar Kurkute',
      role: 'Head of Research',
      description: 'PhD in Computational Linguistics from MIT',
      icon: Award
    },
    {
      name: 'Mayuresh More',
      role: 'Head of Product',
      description: 'Product leader with background in media verification',
      icon: Target
    }
  ];

  const milestones = [
    { year: '2022', event: 'TruthLens founded with mission to combat misinformation' },
    { year: '2023', event: 'Launched beta version with 10,000 early adopters' },
    { year: '2024', event: 'Reached 1M+ analyses and 98.7% accuracy rate' },
    { year: '2025', event: 'Expanded to enterprise solutions and API partnerships' }
  ];

  const values = [
    {
      icon: Shield,
      title: 'Truth & Transparency',
      description: 'We believe in radical transparency about our methods, limitations, and accuracy.'
    },
    {
      icon: Users,
      title: 'Accessibility',
      description: 'Making fact-checking technology available to everyone, everywhere.'
    },
    {
      icon: Brain,
      title: 'Continuous Learning',
      description: 'Our AI evolves daily, learning from new patterns and emerging threats.'
    },
    {
      icon: Globe,
      title: 'Global Impact',
      description: 'Working towards a world where truth prevails over misinformation.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Eye className="h-8 w-8 text-[var(--neon-blue)] glow-effect" />
            <span className="neon-text text-xl" style={{ color: 'var(--neon-blue)' }}>TruthLens</span>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigateTo('landing')}
            className="text-gray-300 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 slide-in">
          <h1 className="mb-6 bg-gradient-to-r from-[var(--neon-blue)] via-white to-[var(--neon-purple)] bg-clip-text text-transparent">
            About TruthLens
          </h1>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto mb-8">
            We're on a mission to combat misinformation with cutting-edge AI technology,
            empowering people to distinguish fact from fiction in the digital age.
          </p>
          <div className="flex items-center justify-center space-x-8">
            <div className="text-center">
              <p className="text-3xl text-[var(--neon-blue)] mb-1">90.7%</p>
              <p className="text-gray-400 text-sm">Accuracy Rate</p>
            </div>
            <div className="w-px h-12 bg-gray-600"></div>
            <div className="text-center">
              <p className="text-3xl text-[var(--neon-green)] mb-1">1M+</p>
              <p className="text-gray-400 text-sm">Analyses</p>
            </div>
            <div className="w-px h-12 bg-gray-600"></div>
            <div className="text-center">
              <p className="text-3xl text-[var(--neon-purple)] mb-1">150+</p>
              <p className="text-gray-400 text-sm">Countries</p>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-[var(--neon-blue)]/30 backdrop-blur-md">
            <CardContent className="p-12">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <Target className="h-12 w-12 text-[var(--neon-blue)] glow-effect" />
                </div>
                <div>
                  <h2 className="text-white mb-4">Our Mission</h2>
                  <p className="text-gray-300 text-lg mb-4">
                    In an era where misinformation spreads faster than truth, TruthLens stands as a guardian
                    of factual information. We leverage advanced artificial intelligence and natural language
                    processing to analyze news articles, social media posts, and documents, helping users make
                    informed decisions based on verified information.
                  </p>
                  <p className="text-gray-300 text-lg">
                    Our technology doesn't just flag fake news—it provides detailed analysis, confidence scores,
                    and educational insights to help users develop critical thinking skills and media literacy.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-white text-center mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card
                key={index}
                className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-600/30 hover:border-[var(--neon-blue)]/50 transition-all"
              >
                <CardContent className="p-6 text-center">
                  <value.icon className="h-10 w-10 text-[var(--neon-blue)] mx-auto mb-4" />
                  <h3 className="text-white mb-3">{value.title}</h3>
                  <p className="text-gray-400 text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-white text-center mb-12">How TruthLens Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-[var(--neon-purple)]/30">
              <CardContent className="p-8">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--neon-purple)]/20 border border-[var(--neon-purple)] mb-4">
                  <span className="text-[var(--neon-purple)]">1</span>
                </div>
                <h3 className="text-white mb-3">Advanced NLP Analysis</h3>
                <p className="text-gray-400 text-sm">
                  Our neural networks analyze linguistic patterns, source credibility, and contextual signals
                  using state-of-the-art transformer models.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-[var(--neon-blue)]/30">
              <CardContent className="p-8">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--neon-blue)]/20 border border-[var(--neon-blue)] mb-4">
                  <span className="text-[var(--neon-blue)]">2</span>
                </div>
                <h3 className="text-white mb-3">Multi-Source Verification</h3>
                <p className="text-gray-400 text-sm">
                  We cross-reference claims against our database of verified sources and fact-checking
                  organizations worldwide.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-[var(--neon-green)]/30">
              <CardContent className="p-8">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--neon-green)]/20 border border-[var(--neon-green)] mb-4">
                  <span className="text-[var(--neon-green)]">3</span>
                </div>
                <h3 className="text-white mb-3">Detailed Insights</h3>
                <p className="text-gray-400 text-sm">
                  Receive comprehensive reports with confidence scores, detected cues, and actionable
                  recommendations for verification.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-white text-center mb-12">Meet Our Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-600/30 hover:border-[var(--neon-purple)]/50 transition-all"
              >
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] mx-auto mb-4">
                    <member.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-white mb-1">{member.name}</h3>
                  <p className="text-[var(--neon-blue)] text-sm mb-3">{member.role}</p>
                  <p className="text-gray-400 text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-16">
          <h2 className="text-white text-center mb-12">Our Journey</h2>
          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start mb-8 last:mb-0">
                <div className="flex flex-col items-center mr-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] border-2 border-gray-900">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="w-0.5 h-16 bg-gradient-to-b from-[var(--neon-blue)] to-[var(--neon-purple)] opacity-30"></div>
                  )}
                </div>
                <div className="flex-1 pt-2">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-[var(--neon-blue)]">{milestone.year}</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-[var(--neon-blue)]/30 to-transparent"></div>
                  </div>
                  <p className="text-gray-300">{milestone.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technology Stack */}
        <div className="mb-16">
          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-[var(--neon-green)]/30">
            <CardContent className="p-12">
              <div className="text-center mb-8">
                <Sparkles className="h-12 w-12 text-[var(--neon-green)] mx-auto mb-4 glow-effect" />
                <h2 className="text-white mb-4">Powered by Advanced AI</h2>
                <p className="text-gray-300 max-w-2xl mx-auto">
                  Our technology stack combines the latest advances in artificial intelligence,
                  machine learning, and natural language processing.
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <h4 className="text-[var(--neon-blue)] mb-2">Neural Architecture</h4>
                  <p className="text-gray-400 text-sm">Transformer-based models with 175M+ parameters</p>
                </div>
                <div className="text-center">
                  <h4 className="text-[var(--neon-purple)] mb-2">Training Data</h4>
                  <p className="text-gray-400 text-sm">2.1M+ verified articles from global sources</p>
                </div>
                <div className="text-center">
                  <h4 className="text-[var(--neon-green)] mb-2">Real-time Updates</h4>
                  <p className="text-gray-400 text-sm">Continuous learning from new data patterns</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-[var(--neon-blue)]/10 via-[var(--neon-purple)]/10 to-[var(--neon-blue)]/10 border-[var(--neon-blue)]/30">
            <CardContent className="p-12">
              <h2 className="text-white mb-4">Join Our Mission</h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Be part of the fight against misinformation. Start using TruthLens today and help
                create a more informed society.
              </p>
              <div className="flex items-center justify-center space-x-4">
                <Button
                  onClick={() => navigateTo('signup')}
                  className="bg-gradient-to-r from-[var(--electric-blue)] to-[var(--neon-blue)] hover:opacity-90"
                >
                  Get Started Free
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigateTo('contact')}
                  className="border-[var(--neon-purple)] text-[var(--neon-purple)] hover:bg-[var(--neon-purple)] hover:text-black"
                >
                  Contact Us
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}