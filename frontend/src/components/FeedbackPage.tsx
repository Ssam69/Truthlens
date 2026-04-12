import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';
import { 
  Eye, 
  ArrowLeft, 
  MessageSquare, 
  Send,
  Star,
  Smile,
  Meh,
  Frown,
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
  Lightbulb,
  Bug,
  Sparkles
} from 'lucide-react';
import { PageType } from '../App';

interface FeedbackPageProps {
  navigateTo: (page: PageType) => void;
}

export default function FeedbackPage({ navigateTo }: FeedbackPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: '',
    experience: '',
    feedback: '',
    features: [] as string[],
    improvements: '',
    recommend: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const fullMessage = `Rating: ${formData.rating || 'Not provided'}\nExperience: ${formData.experience || 'Not provided'}\nFeedback: ${formData.feedback}\nLiked Features: ${formData.features.length > 0 ? formData.features.join(', ') : 'None selected'}\nImprovements: ${formData.improvements || 'None'}\nWould Recommend: ${formData.recommend || 'Not specified'}`;

      const response = await fetch('http://localhost:5001/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name || 'Anonymous',
          email: formData.email || 'noemail@provided.com',
          message: fullMessage
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Failed to submit feedback:', response.status, data);
        alert(`Failed to submit feedback (${response.status}). Ensure the auth backend is running on port 5001.`);
      } else if (!data.success) {
        console.error('Feedback submission error:', data.error);
        alert('Failed to submit feedback: ' + (data.error || 'Unknown error'));
      } else {
        setIsSubmitted(true);
        
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            name: '',
            email: '',
            rating: '',
            experience: '',
            feedback: '',
            features: [],
            improvements: '',
            recommend: ''
          });
        }, 3000);
      }
    } catch (error) {
      console.error('Submit feedback error:', error);
      alert('Failed to connect to feedback service. Ensure the FastAPI backend (port 5001) is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const ratingOptions = [
    { value: '5', label: 'Excellent', icon: Star, color: 'text-yellow-400' },
    { value: '4', label: 'Good', icon: ThumbsUp, color: 'text-[var(--neon-green)]' },
    { value: '3', label: 'Average', icon: Meh, color: 'text-[var(--neon-blue)]' },
    { value: '2', label: 'Poor', icon: ThumbsDown, color: 'text-orange-400' },
    { value: '1', label: 'Very Poor', icon: Frown, color: 'text-red-400' }
  ];

  const experienceOptions = [
    { value: 'excellent', label: 'Excellent', emoji: '😊' },
    { value: 'good', label: 'Good', emoji: '🙂' },
    { value: 'neutral', label: 'Neutral', emoji: '😐' },
    { value: 'poor', label: 'Poor', emoji: '😕' }
  ];

  const featuresList = [
    'Text Analysis',
    'URL Scanning',
    'File Upload',
    'History Tracking',
    'Confidence Scores',
    'Detailed Reports'
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

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12 slide-in">
          <Sparkles className="h-12 w-12 text-[var(--neon-purple)] mx-auto mb-4 glow-effect" />
          <h1 className="mb-4 bg-gradient-to-r from-[var(--neon-purple)] via-white to-[var(--neon-blue)] bg-clip-text text-transparent">
            Share Your Feedback
          </h1>
          <p className="text-gray-400 text-lg">
            Your feedback helps us improve TruthLens. Tell us about your experience!
          </p>
        </div>

        {isSubmitted ? (
          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-[var(--neon-green)]/30 backdrop-blur-md slide-in">
            <CardContent className="py-16 text-center">
              <CheckCircle className="h-20 w-20 text-[var(--neon-green)] mx-auto mb-6 glow-effect" />
              <h2 className="text-white mb-4">Thank You for Your Feedback!</h2>
              <p className="text-gray-400 mb-8">
                We appreciate you taking the time to share your thoughts. Your input helps us make TruthLens better for everyone.
              </p>
              <Button
                onClick={() => navigateTo('landing')}
                className="bg-gradient-to-r from-[var(--electric-blue)] to-[var(--neon-blue)] hover:opacity-90"
              >
                Return to Home
              </Button>
            </CardContent>
          </Card>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-[var(--neon-blue)]/30 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-[var(--neon-blue)]" />
                  <span>Basic Information</span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Let us know who you are (optional)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-300">Name (Optional)</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-[var(--neon-blue)] focus:ring-[var(--neon-blue)]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300">Email (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-[var(--neon-blue)] focus:ring-[var(--neon-blue)]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Overall Rating */}
            <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-[var(--neon-purple)]/30 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Star className="h-5 w-5 text-[var(--neon-purple)]" />
                  <span>Overall Rating</span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  How would you rate your experience with TruthLens?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={formData.rating} onValueChange={(value) => handleInputChange('rating', value)}>
                  <div className="grid md:grid-cols-5 gap-4">
                    {ratingOptions.map((option) => (
                      <label
                        key={option.value}
                        className={`flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          formData.rating === option.value
                            ? 'border-[var(--neon-purple)] bg-[var(--neon-purple)]/10'
                            : 'border-gray-600 hover:border-[var(--neon-purple)]/50'
                        }`}
                      >
                        <RadioGroupItem value={option.value} className="sr-only" />
                        <option.icon className={`h-8 w-8 mb-2 ${option.color}`} />
                        <span className="text-white text-sm">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* User Experience */}
            <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-[var(--neon-green)]/30 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Smile className="h-5 w-5 text-[var(--neon-green)]" />
                  <span>User Experience</span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  How was your overall experience using the platform?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={formData.experience} onValueChange={(value) => handleInputChange('experience', value)}>
                  <div className="grid md:grid-cols-4 gap-4">
                    {experienceOptions.map((option) => (
                      <label
                        key={option.value}
                        className={`flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          formData.experience === option.value
                            ? 'border-[var(--neon-green)] bg-[var(--neon-green)]/10'
                            : 'border-gray-600 hover:border-[var(--neon-green)]/50'
                        }`}
                      >
                        <RadioGroupItem value={option.value} className="sr-only" />
                        <span className="text-4xl mb-2">{option.emoji}</span>
                        <span className="text-white text-sm">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Features Used */}
            <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-[var(--neon-blue)]/30 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-[var(--neon-blue)]" />
                  <span>Features You've Used</span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Select all the features you've tried (optional)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {featuresList.map((feature) => (
                    <label
                      key={feature}
                      className="flex items-center space-x-3 p-3 rounded-lg border border-gray-600 hover:border-[var(--neon-blue)]/50 cursor-pointer transition-all"
                    >
                      <Checkbox
                        checked={formData.features.includes(feature)}
                        onCheckedChange={() => toggleFeature(feature)}
                        className="border-gray-600"
                      />
                      <span className="text-gray-300">{feature}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Detailed Feedback */}
            <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-[var(--neon-purple)]/30 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-[var(--neon-purple)]" />
                  <span>Your Feedback</span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Tell us what you think about TruthLens
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="feedback" className="text-gray-300">What do you like most?</Label>
                  <Textarea
                    id="feedback"
                    placeholder="Share what works well for you..."
                    value={formData.feedback}
                    onChange={(e) => handleInputChange('feedback', e.target.value)}
                    className="min-h-[100px] bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-[var(--neon-purple)] focus:ring-[var(--neon-purple)]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="improvements" className="text-gray-300 flex items-center space-x-2">
                    <Lightbulb className="h-4 w-4 text-yellow-400" />
                    <span>Suggestions for Improvement</span>
                  </Label>
                  <Textarea
                    id="improvements"
                    placeholder="How can we make TruthLens better?"
                    value={formData.improvements}
                    onChange={(e) => handleInputChange('improvements', e.target.value)}
                    className="min-h-[100px] bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-[var(--neon-purple)] focus:ring-[var(--neon-purple)]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Recommendation */}
            <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-[var(--neon-green)]/30 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <ThumbsUp className="h-5 w-5 text-[var(--neon-green)]" />
                  <span>Recommendation</span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Would you recommend TruthLens to others?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={formData.recommend} onValueChange={(value) => handleInputChange('recommend', value)}>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 p-4 rounded-lg border border-gray-600 hover:border-[var(--neon-green)]/50 cursor-pointer transition-all">
                      <RadioGroupItem value="definitely" />
                      <div>
                        <span className="text-white block">Definitely recommend</span>
                        <span className="text-gray-400 text-sm">I'd actively recommend this to friends and colleagues</span>
                      </div>
                    </label>
                    <label className="flex items-center space-x-3 p-4 rounded-lg border border-gray-600 hover:border-[var(--neon-green)]/50 cursor-pointer transition-all">
                      <RadioGroupItem value="probably" />
                      <div>
                        <span className="text-white block">Probably recommend</span>
                        <span className="text-gray-400 text-sm">I'd recommend with some reservations</span>
                      </div>
                    </label>
                    <label className="flex items-center space-x-3 p-4 rounded-lg border border-gray-600 hover:border-[var(--neon-green)]/50 cursor-pointer transition-all">
                      <RadioGroupItem value="not-sure" />
                      <div>
                        <span className="text-white block">Not sure</span>
                        <span className="text-gray-400 text-sm">I need more time to decide</span>
                      </div>
                    </label>
                    <label className="flex items-center space-x-3 p-4 rounded-lg border border-gray-600 hover:border-[var(--neon-green)]/50 cursor-pointer transition-all">
                      <RadioGroupItem value="probably-not" />
                      <div>
                        <span className="text-white block">Probably not recommend</span>
                        <span className="text-gray-400 text-sm">I have significant concerns</span>
                      </div>
                    </label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-center space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigateTo('landing')}
                className="border-gray-600 text-gray-300 hover:border-gray-400"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !formData.feedback}
                className="bg-gradient-to-r from-[var(--electric-blue)] to-[var(--neon-blue)] hover:opacity-90 px-8"
              >
                {isSubmitting ? (
                  'Submitting...'
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Feedback
                  </>
                )}
              </Button>
            </div>
          </form>
        )}

        {/* Additional Info */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card className="bg-gray-900/50 border-gray-600/30">
            <CardContent className="p-6 text-center">
              <Bug className="h-8 w-8 text-red-400 mx-auto mb-3" />
              <h4 className="text-white mb-2">Report a Bug</h4>
              <p className="text-gray-400 text-sm mb-3">
                Found a technical issue?
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigateTo('contact')}
                className="border-red-400 text-red-400 hover:bg-red-400 hover:text-black"
              >
                Report Bug
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-600/30">
            <CardContent className="p-6 text-center">
              <Lightbulb className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
              <h4 className="text-white mb-2">Feature Request</h4>
              <p className="text-gray-400 text-sm mb-3">
                Have an idea for a new feature?
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigateTo('contact')}
                className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
              >
                Suggest Feature
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-600/30">
            <CardContent className="p-6 text-center">
              <MessageSquare className="h-8 w-8 text-[var(--neon-blue)] mx-auto mb-3" />
              <h4 className="text-white mb-2">General Inquiry</h4>
              <p className="text-gray-400 text-sm mb-3">
                Need to reach our team?
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigateTo('contact')}
                className="border-[var(--neon-blue)] text-[var(--neon-blue)] hover:bg-[var(--neon-blue)] hover:text-black"
              >
                Contact Us
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}