'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  FormInput, 
  Upload, 
  Share2, 
  BarChart3, 
  Zap,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

export default function HomePage() {
  const [isGenerating, setIsGenerating] = useState(false);

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Generation',
      description: 'Create forms from natural language descriptions using advanced AI technology.'
    },
    {
      icon: FormInput,
      title: 'Dynamic Forms',
      description: 'Automatically generate form fields, validation rules, and user-friendly layouts.'
    },
    {
      icon: Upload,
      title: 'File Uploads',
      description: 'Support for images, documents, and other file types in your forms.'
    },
    {
      icon: Share2,
      title: 'Shareable Links',
      description: 'Generate unique public links for anyone to access and submit your forms.'
    },
    {
      icon: BarChart3,
      title: 'Response Analytics',
      description: 'Track submissions, view responses, and analyze form performance.'
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
      description: 'See form submissions as they happen with instant notifications.'
    }
  ];

  const examplePrompts = [
    'Create a job application form with personal details, experience, and resume upload',
    'Design a customer feedback survey with rating scales and comment sections',
    'Build a registration form for a workshop with name, email, and dietary preferences',
    'Generate a product review form with star ratings, text feedback, and photo uploads'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">AI Form Gen</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/login" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/register" 
                className="btn btn-primary"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              <span>Powered by Google Gemini AI</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Generate Forms with
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Magic
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your ideas into beautiful, functional forms using natural language. 
              Our AI understands your requirements and creates forms with the perfect fields, 
              validation, and file upload capabilities.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link 
                href="/register" 
                className="btn btn-primary text-lg px-8 py-3"
              >
                Start Creating Forms
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link 
                href="/demo" 
                className="btn btn-outline text-lg px-8 py-3"
              >
                View Demo
              </Link>
            </div>

            {/* Example Prompt */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <p className="text-sm text-gray-500 mb-3">Try this example:</p>
                <p className="text-gray-800 font-medium">
                  "Create a contact form with name, email, phone number, message field, and profile picture upload"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to create amazing forms
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From simple contact forms to complex multi-step applications, 
              our AI-powered platform handles it all.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="card p-6 hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How it works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to create and share your forms
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Describe Your Form
              </h3>
              <p className="text-gray-600">
                Tell our AI what kind of form you need using natural language
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                AI Generates Form
              </h3>
              <p className="text-gray-600">
                Our AI creates a complete form with fields, validation, and styling
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Share & Collect
              </h3>
              <p className="text-gray-600">
                Get a shareable link and start collecting responses immediately
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to create your first AI-powered form?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who are already creating amazing forms with AI
          </p>
          <Link 
            href="/register" 
            className="btn bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">AI Form Gen</span>
              </div>
              <p className="text-gray-400">
                Create dynamic forms with AI and collect responses effortlessly.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AI Form Generator. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
