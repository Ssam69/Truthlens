import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Eye, 
  ArrowLeft, 
  Mail, 
  MessageSquare, 
  Send,
  MapPin,
  Phone,
  Clock,
  CheckCircle,
  Github,
  Twitter,
  Linkedin
} from 'lucide-react';
import { PageType } from '../App';

interface ContactPageProps {
  navigateTo: (page: PageType) => void;
}

export default function ContactPage({ navigateTo }: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '',
          email: '',
          subject: '',
          category: '',
          message: ''
        });
      }, 3000);
    }, 1500);
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
        {/* Header */}
        <div className="text-center mb-12 slide-in">
          <h1 className="mb-4 bg-gradient-to-r from-[var(--neon-blue)] via-white to-[var(--neon-purple)] bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Have questions or feedback? We'd love to hear from you. Get in touch with our team.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-[var(--neon-blue)]/30 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-[var(--neon-blue)]" />
                  <span>Send us a Message</span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Fill out the form below and we'll get back to you as soon as possible
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="py-12 text-center slide-in">
                    <CheckCircle className="h-16 w-16 text-[var(--neon-green)] mx-auto mb-4" />
                    <h3 className="text-white mb-2">Message Sent Successfully!</h3>
                    <p className="text-gray-400">
                      Thank you for reaching out. We'll respond to your message within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-[var(--neon-blue)] focus:ring-[var(--neon-blue)]"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-[var(--neon-blue)] focus:ring-[var(--neon-blue)]"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-gray-300">Category</Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                        <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white focus:border-[var(--neon-blue)] focus:ring-[var(--neon-blue)]">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="support">Technical Support</SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                          <SelectItem value="bug">Bug Report</SelectItem>
                          <SelectItem value="feature">Feature Request</SelectItem>
                          <SelectItem value="business">Business Inquiry</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-gray-300">Subject</Label>
                      <Input
                        id="subject"
                        type="text"
                        placeholder="What's this about?"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-[var(--neon-blue)] focus:ring-[var(--neon-blue)]"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-gray-300">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us more about your inquiry..."
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        className="min-h-[150px] bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-[var(--neon-blue)] focus:ring-[var(--neon-blue)]"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-[var(--electric-blue)] to-[var(--neon-blue)] hover:opacity-90"
                    >
                      {isSubmitting ? (
                        'Sending...'
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-[var(--neon-purple)]/30">
              <CardHeader>
                <CardTitle className="text-white">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-[var(--neon-blue)] mt-1" />
                  <div>
                    <h4 className="text-white text-sm mb-1">Email</h4>
                    <p className="text-gray-400 text-sm">support@truthlens.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-[var(--neon-green)] mt-1" />
                  <div>
                    <h4 className="text-white text-sm mb-1">Phone</h4>
                    <p className="text-gray-400 text-sm">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-[var(--neon-purple)] mt-1" />
                  <div>
                    <h4 className="text-white text-sm mb-1">Address</h4>
                    <p className="text-gray-400 text-sm">
                      123 AI Street<br />
                      San Francisco, CA 94102<br />
                      United States
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-yellow-400 mt-1" />
                  <div>
                    <h4 className="text-white text-sm mb-1">Business Hours</h4>
                    <p className="text-gray-400 text-sm">
                      Monday - Friday: 9:00 AM - 6:00 PM PST<br />
                      Saturday - Sunday: Closed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-[var(--neon-blue)]/30">
              <CardHeader>
                <CardTitle className="text-white">Follow Us</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-gray-600 text-gray-300 hover:border-[var(--neon-blue)] hover:text-[var(--neon-blue)]"
                  >
                    <Twitter className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-gray-600 text-gray-300 hover:border-[var(--neon-blue)] hover:text-[var(--neon-blue)]"
                  >
                    <Linkedin className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-gray-600 text-gray-300 hover:border-[var(--neon-blue)] hover:text-[var(--neon-blue)]"
                  >
                    <Github className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-[var(--neon-blue)]/10 to-[var(--neon-purple)]/10 border-[var(--neon-blue)]/30">
              <CardContent className="p-6">
                <h4 className="text-white mb-2">Need Immediate Help?</h4>
                <p className="text-gray-400 text-sm mb-4">
                  Check out our FAQ section or documentation for quick answers to common questions.
                </p>
                <Button
                  variant="outline"
                  className="w-full border-[var(--neon-blue)] text-[var(--neon-blue)] hover:bg-[var(--neon-blue)] hover:text-black"
                >
                  View Documentation
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-white text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gray-900/50 border-gray-600/30">
              <CardContent className="p-6">
                <h3 className="text-white mb-2">How accurate is the AI detection?</h3>
                <p className="text-gray-400 text-sm">
                  Our AI model achieves 98.7% accuracy on validated datasets. However, we always recommend 
                  using it as a supplementary tool alongside critical thinking and source verification.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900/50 border-gray-600/30">
              <CardContent className="p-6">
                <h3 className="text-white mb-2">Is my data kept private?</h3>
                <p className="text-gray-400 text-sm">
                  Yes, we take privacy seriously. Your analyzed content is encrypted and automatically deleted 
                  after 30 days. We never share your data with third parties.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900/50 border-gray-600/30">
              <CardContent className="p-6">
                <h3 className="text-white mb-2">What file formats are supported?</h3>
                <p className="text-gray-400 text-sm">
                  You can upload .txt, .docx, and .pdf files. You can also paste text directly or provide 
                  a URL to a news article for analysis.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900/50 border-gray-600/30">
              <CardContent className="p-6">
                <h3 className="text-white mb-2">Can I use TruthLens for my organization?</h3>
                <p className="text-gray-400 text-sm">
                  Absolutely! We offer enterprise plans with API access, custom integrations, and dedicated 
                  support. Contact our business team for more information.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}