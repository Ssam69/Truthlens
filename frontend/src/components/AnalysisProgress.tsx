import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { 
  Eye, 
  Brain, 
  Search, 
  Shield, 
  CheckCircle, 
  Zap,
  FileText,
  Database,
  Sparkles
} from 'lucide-react';

export default function AnalysisProgress() {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: FileText,
      title: "Processing Content",
      description: "Analyzing text structure and extracting key information...",
      duration: 800
    },
    {
      icon: Brain,
      title: "AI Analysis",
      description: "Our AI model is verifying credibility and checking patterns...",
      duration: 1000
    },
    {
      icon: Database,
      title: "Source Verification",
      description: "Cross-referencing with trusted news databases...",
      duration: 700
    },
    {
      icon: Shield,
      title: "Final Assessment",
      description: "Generating confidence scores and authenticity report...",
      duration: 500
    }
  ];

  useEffect(() => {
    let totalDuration = 0;
    
    const runSteps = async () => {
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i);
        const stepDuration = steps[i].duration;
        const stepStartProgress = (i / steps.length) * 100;
        const stepEndProgress = ((i + 1) / steps.length) * 100;
        
        // Animate progress for this step
        const animationDuration = stepDuration;
        const animationSteps = 20;
        const progressIncrement = (stepEndProgress - stepStartProgress) / animationSteps;
        
        for (let j = 0; j <= animationSteps; j++) {
          await new Promise(resolve => setTimeout(resolve, animationDuration / animationSteps));
          setProgress(stepStartProgress + (progressIncrement * j));
        }
      }
    };

    runSteps();
  }, []);

  const getStepStatus = (index: number) => {
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'active';
    return 'pending';
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--electric-blue)]/5 via-transparent to-[var(--neon-purple)]/5"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--neon-blue)]/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--neon-purple)]/5 rounded-full blur-3xl animate-pulse"></div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12 slide-in">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Eye className="h-12 w-12 text-[var(--neon-blue)] glow-effect" />
            <span className="neon-text text-2xl" style={{ color: 'var(--neon-blue)' }}>TruthLens</span>
          </div>
          <h1 className="mb-4 bg-gradient-to-r from-[var(--neon-blue)] via-white to-[var(--neon-purple)] bg-clip-text text-transparent">
            Analysis in Progress
          </h1>
          <p className="text-gray-400 text-lg">
            Our advanced AI is analyzing your content for authenticity...
          </p>
        </div>

        {/* Progress Card */}
        <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-[var(--neon-blue)]/30 backdrop-blur-md mb-8">
          <CardContent className="p-8">
            {/* Overall Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white">Overall Progress</span>
                <span className="text-[var(--neon-blue)]">{Math.round(progress)}%</span>
              </div>
              <Progress 
                value={progress} 
                className="h-3 bg-gray-700"
                style={{
                  background: 'linear-gradient(90deg, var(--electric-blue), var(--neon-blue))'
                }}
              />
            </div>

            {/* Current Step */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-[var(--electric-blue)] to-[var(--neon-blue)] rounded-full flex items-center justify-center mx-auto mb-4 glow-effect">
                {React.createElement(steps[currentStep]?.icon || Brain, { 
                  className: "h-10 w-10 text-white" 
                })}
              </div>
              <h3 className="text-white mb-2">{steps[currentStep]?.title}</h3>
              <p className="text-gray-400">{steps[currentStep]?.description}</p>
            </div>

            {/* Steps List */}
            <div className="space-y-4">
              {steps.map((step, index) => {
                const status = getStepStatus(index);
                const StepIcon = step.icon;
                
                return (
                  <div 
                    key={index}
                    className={`flex items-center space-x-4 p-4 rounded-lg transition-all duration-500 ${
                      status === 'active' 
                        ? 'bg-[var(--neon-blue)]/10 border border-[var(--neon-blue)]/30' 
                        : status === 'completed'
                        ? 'bg-[var(--neon-green)]/10 border border-[var(--neon-green)]/30'
                        : 'bg-gray-800/30 border border-gray-600/30'
                    }`}
                  >
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        status === 'completed'
                          ? 'bg-[var(--neon-green)] text-black'
                          : status === 'active'
                          ? 'bg-[var(--neon-blue)] text-white'
                          : 'bg-gray-600 text-gray-400'
                      }`}
                    >
                      {status === 'completed' ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <StepIcon className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-sm ${
                        status === 'completed' ? 'text-[var(--neon-green)]' :
                        status === 'active' ? 'text-[var(--neon-blue)]' : 'text-gray-400'
                      }`}>
                        {step.title}
                      </h4>
                      <p className="text-xs text-gray-500">{step.description}</p>
                    </div>
                    {status === 'active' && (
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-[var(--neon-blue)] rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-[var(--neon-blue)] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-[var(--neon-blue)] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Fun Facts */}
        <Card className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border-[var(--neon-purple)]/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-3">
              <Sparkles className="h-5 w-5 text-[var(--neon-purple)]" />
              <h4 className="text-white">Did you know?</h4>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Our AI model has been trained on over 2 million news articles and can detect 
              subtle linguistic patterns that indicate misinformation, including emotional 
              manipulation, source credibility issues, and factual inconsistencies.
            </p>
          </CardContent>
        </Card>

        {/* Processing Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="text-center">
            <div className="text-2xl text-[var(--neon-blue)] mb-1">98.7%</div>
            <div className="text-gray-400 text-sm">Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-2xl text-[var(--neon-green)] mb-1">2.1s</div>
            <div className="text-gray-400 text-sm">Avg Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl text-[var(--neon-purple)] mb-1">2M+</div>
            <div className="text-gray-400 text-sm">Articles Trained</div>
          </div>
        </div>
      </div>
    </div>
  );
}