import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Eye, Shield, Zap, Brain, Menu, X } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { PageType } from '../App';
import { motion, AnimatePresence } from 'framer-motion';

interface LandingPageProps {
  navigateTo: (page: PageType) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
};

export default function LandingPage({ navigateTo }: LandingPageProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigateTo('home')}
          >
            <Eye className="h-8 w-8 text-[var(--neon-blue)] glow-effect" />
            <span className="neon-text font-bold text-xl" style={{ color: 'var(--neon-blue)' }}>TruthLens</span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <button className="text-gray-300 hover:text-white transition-colors h-11 px-3">Home</button>
            <button 
              onClick={() => navigateTo('about')}
              className="text-gray-300 hover:text-white transition-colors h-11 px-3"
            >
              About
            </button>
            <button 
              onClick={() => navigateTo('contact')}
              className="text-gray-300 hover:text-white transition-colors h-11 px-3"
            >
              Contact
            </button>
            <Button 
              asChild
              variant="outline" 
              onClick={() => navigateTo('login')}
              className="border-[var(--neon-blue)] text-[var(--neon-blue)] hover:bg-[var(--neon-blue)] hover:text-black cursor-pointer"
            >
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                Login
              </motion.button>
            </Button>
            <Button 
              asChild
              onClick={() => navigateTo('signup')}
              className="bg-gradient-to-r from-[var(--cyber-purple)] to-[var(--electric-blue)] hover:opacity-90 border-0 cursor-pointer"
            >
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                Sign Up
              </motion.button>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-gray-900/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
            >
              <div className="px-4 py-6 flex flex-col space-y-4">
                <button onClick={() => { setIsMobileMenuOpen(false); navigateTo('home'); }} className="text-left text-gray-300 hover:text-white text-lg h-11">Home</button>
                <button onClick={() => { setIsMobileMenuOpen(false); navigateTo('about'); }} className="text-left text-gray-300 hover:text-white text-lg h-11">About</button>
                <button onClick={() => { setIsMobileMenuOpen(false); navigateTo('contact'); }} className="text-left text-gray-300 hover:text-white text-lg h-11">Contact</button>
                <div className="pt-4 flex flex-col space-y-3">
                  <Button 
                    variant="outline" 
                    onClick={() => { setIsMobileMenuOpen(false); navigateTo('login'); }}
                    className="w-full border-[var(--neon-blue)] text-[var(--neon-blue)] h-11"
                  >
                    Login
                  </Button>
                  <Button 
                    onClick={() => { setIsMobileMenuOpen(false); navigateTo('signup'); }}
                    className="w-full bg-gradient-to-r from-[var(--cyber-purple)] to-[var(--electric-blue)] h-11 border-0 text-white"
                  >
                    Sign Up
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h1 
                variants={itemVariants}
                className="mb-6 bg-gradient-to-r from-[var(--neon-blue)] via-white to-[var(--neon-purple)] bg-clip-text text-transparent text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight"
              >
                TruthLens – Detect Fake News with AI
              </motion.h1>
              <motion.p 
                variants={itemVariants}
                className="mb-8 text-gray-300 text-lg md:text-xl leading-relaxed max-w-2xl"
              >
                Upload or paste any news article, and our advanced AI will verify its authenticity 
                in seconds. Stay informed, stay protected in the digital age.
              </motion.p>
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                <Button 
                  asChild
                  size="lg" 
                  onClick={() => navigateTo('signup')}
                  className="bg-gradient-to-r from-[var(--electric-blue)] to-[var(--neon-blue)] hover:opacity-90 glow-effect h-14 px-8 text-lg border-0 cursor-pointer"
                >
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                    <Zap className="h-5 w-5 mr-2" />
                    Get Started
                  </motion.button>
                </Button>
                <Button 
                  asChild
                  size="lg" 
                  variant="outline" 
                  onClick={scrollToFeatures}
                  className="border-[var(--neon-purple)] text-[var(--neon-purple)] hover:bg-[var(--neon-purple)] hover:text-black h-14 px-8 text-lg cursor-pointer"
                >
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                    Learn How It Works
                  </motion.button>
                </Button>
              </motion.div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--neon-blue)]/30 to-[var(--neon-purple)]/30 rounded-2xl blur-3xl animate-pulse"></div>
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1655393001768-d946c97d6fd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwYWklMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc1OTc0MTI4Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="AI Technology"
                className="relative rounded-2xl shadow-[0_0_40px_rgba(0,217,255,0.3)] w-full h-[500px] object-cover border border-white/10"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 md:px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--neon-blue)]/5 to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="mb-4 text-3xl md:text-4xl font-bold bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] bg-clip-text text-transparent">
              Powered by Advanced AI
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Our cutting-edge technology analyzes linguistic patterns, source credibility, 
              and contextual information to provide accurate fake news detection.
            </p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-3 gap-8"
          >
            <motion.div variants={itemVariants}>
              <Card className="h-full p-8 bg-black/40 backdrop-blur-xl border border-white/10 hover:border-[var(--neon-blue)] transition-colors duration-300 transform group">
                <Brain className="h-12 w-12 text-[var(--neon-blue)] mb-6 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_10px_rgba(0,217,255,0.8)]" />
                <h3 className="mb-3 text-xl font-bold text-white">AI-Powered Analysis</h3>
                <p className="text-gray-400 leading-relaxed">
                  Advanced machine learning algorithms trained on millions of articles 
                  to detect subtle patterns in fake news.
                </p>
              </Card>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Card className="h-full p-8 bg-black/40 backdrop-blur-xl border border-white/10 hover:border-[var(--neon-purple)] transition-colors duration-300 transform group">
                <Shield className="h-12 w-12 text-[var(--neon-purple)] mb-6 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_10px_rgba(180,0,255,0.8)]" />
                <h3 className="mb-3 text-xl font-bold text-white">Source Verification</h3>
                <p className="text-gray-400 leading-relaxed">
                  Cross-references sources and checks credibility against our 
                  comprehensive database of trusted news outlets.
                </p>
              </Card>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Card className="h-full p-8 bg-black/40 backdrop-blur-xl border border-white/10 hover:border-[var(--neon-green)] transition-colors duration-300 transform group">
                <Zap className="h-12 w-12 text-[var(--neon-green)] mb-6 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_10px_rgba(0,255,140,0.8)]" />
                <h3 className="mb-3 text-xl font-bold text-white">Instant Results</h3>
                <p className="text-gray-400 leading-relaxed">
                  Get detailed analysis results in seconds, including confidence 
                  scores and specific indicators of authenticity.
                </p>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--neon-purple)]/10 to-transparent"></div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center relative z-10 p-12 rounded-3xl border border-white/10 bg-black/50 backdrop-blur-md shadow-2xl"
        >
          <h2 className="mb-6 text-3xl md:text-5xl font-bold bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] bg-clip-text text-transparent">
            Ready to Fight Fake News?
          </h2>
          <p className="mb-10 text-gray-300 text-lg md:text-xl">
            Join thousands of users who trust TruthLens to verify their news sources.
          </p>
          <Button 
            asChild
            size="lg" 
            onClick={() => navigateTo('signup')}
            className="bg-gradient-to-r from-[var(--electric-blue)] to-[var(--neon-blue)] hover:opacity-90 glow-effect h-14 px-10 text-xl font-semibold border-0 cursor-pointer"
          >
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
              <Eye className="h-6 w-6 mr-3" />
              Start Detecting Now
            </motion.button>
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4 md:px-6 bg-black/60 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <Eye className="h-6 w-6 text-[var(--neon-blue)]" />
                <span className="text-white font-bold tracking-wider">TruthLens</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                AI-powered fake news detection for a more informed world. Ensure the truth prevails.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-[var(--neon-blue)] transition-colors inline-block min-h-[44px] flex items-center">Features</a></li>
                <li><button className="hover:text-[var(--neon-blue)] transition-colors min-h-[44px] flex items-center">API</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>
                  <button 
                    onClick={() => navigateTo('about')}
                    className="hover:text-[var(--neon-blue)] transition-colors min-h-[44px] flex items-center"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigateTo('contact')}
                    className="hover:text-[var(--neon-blue)] transition-colors min-h-[44px] flex items-center"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><button className="hover:text-[var(--neon-blue)] transition-colors min-h-[44px] flex items-center">Terms</button></li>
                <li><button className="hover:text-[var(--neon-blue)] transition-colors min-h-[44px] flex items-center">Privacy Policy</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-500 text-sm flex flex-col md:flex-row justify-between items-center">
            <p>© 2026 TruthLens. All rights reserved.</p>
            <p className="mt-2 md:mt-0">Powered by Artificial Intelligence.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}