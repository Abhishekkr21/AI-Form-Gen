'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, CheckCircle, FileText, Upload, Share2 } from 'lucide-react';

export default function DemoPage() {
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');

  const demoPrompts = [
    {
      title: 'Contact Form',
      description: 'Professional contact form with file uploads',
      prompt: 'Create a contact form with name, email, phone number, message field, and profile picture upload',
      features: ['Text inputs', 'File upload', 'Validation', 'Professional design']
    },
    {
      title: 'Job Application',
      description: 'Comprehensive job application form',
      prompt: 'Design a job application form with personal details, work experience, resume upload, cover letter, and references',
      features: ['Multiple sections', 'File uploads', 'Complex validation', 'Professional layout']
    },
    {
      title: 'Customer Survey',
      description: 'Interactive feedback collection form',
      prompt: 'Build a customer feedback survey with rating scales, comment sections, and file upload for screenshots',
      features: ['Rating scales', 'Text areas', 'File uploads', 'User-friendly design']
    },
    {
      title: 'Workshop Registration',
      description: 'Event registration with preferences',
      prompt: 'Generate a workshop registration form with name, email, dietary preferences, and document uploads',
      features: ['Registration fields', 'Preferences', 'Document uploads', 'Clean interface']
    },
    {
      title: 'Product Review',
      description: 'Comprehensive product feedback form',
      prompt: 'Create a product review form with star ratings, text feedback, photo uploads, and purchase date',
      features: ['Star ratings', 'Photo uploads', 'Date picker', 'Rich feedback']
    },
    {
      title: 'Event RSVP',
      description: 'Simple event response form',
      prompt: 'Make a simple RSVP form with name, email, attendance status, and guest count',
      features: ['Simple fields', 'Dropdown selection', 'Quick response', 'Mobile friendly']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">AI Form Gen</span>
            </Link>
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
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            See AI Form Generation in Action
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Watch how our AI transforms simple text descriptions into fully functional, 
            beautiful forms with validation, file uploads, and responsive design.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/register" 
              className="btn btn-primary text-lg px-8 py-3"
            >
              Try It Yourself
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <a 
              href="#demo-section" 
              className="btn btn-outline text-lg px-8 py-3"
            >
              View Examples
            </a>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How AI Form Generation Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From natural language to functional form in seconds
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Describe Your Form
              </h3>
              <p className="text-gray-600">
                Tell our AI what kind of form you need using simple, natural language
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                AI Generates Schema
              </h3>
              <p className="text-gray-600">
                Our AI analyzes your request and creates a complete form structure
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Instant Form Creation
              </h3>
              <p className="text-gray-600">
                Get a fully functional form with validation, styling, and file uploads
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Examples */}
      <section id="demo-section" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Example Form Prompts
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Click on any example to see how the AI would interpret it
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoPrompts.map((example, index) => (
              <div 
                key={index}
                className="card hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedPrompt(example.prompt)}
              >
                <div className="card-header">
                  <h3 className="card-title text-lg">{example.title}</h3>
                  <p className="card-description">{example.description}</p>
                </div>
                
                <div className="card-content">
                  <div className="space-y-3">
                    {example.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-800 font-medium mb-1">AI Prompt:</p>
                    <p className="text-xs text-blue-700 italic">"{example.prompt}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Selected Prompt Display */}
      {selectedPrompt && (
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                AI Form Generation Example
              </h2>
              <p className="text-lg text-gray-600">
                Here's what our AI would create from your prompt
              </p>
            </div>
            
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Your Prompt</h3>
                <p className="card-description">The natural language description you provided</p>
              </div>
              
              <div className="card-content">
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <p className="text-gray-800 italic">"{selectedPrompt}"</p>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">What AI Would Generate:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium">Form Structure</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Upload className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-medium">File Upload Fields</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-purple-500" />
                          <span className="text-sm font-medium">Validation Rules</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Share2 className="w-4 h-4 text-orange-500" />
                          <span className="text-sm font-medium">Shareable Link</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-indigo-500" />
                          <span className="text-sm font-medium">Responsive Design</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-pink-500" />
                          <span className="text-sm font-medium">Instant Deployment</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Ready to Try?</h4>
                    <p className="text-gray-600 mb-4">
                      Create your account and start generating AI-powered forms in minutes!
                    </p>
                    <Link 
                      href="/register" 
                      className="btn btn-primary"
                    >
                      Get Started Free
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Highlight */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Why Choose AI Form Generator?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">AI-Powered</h3>
              <p className="text-blue-100">
                Advanced AI understands your requirements and creates perfect forms
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Instant Creation</h3>
              <p className="text-blue-100">
                Generate forms in seconds, not hours or days
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">File Support</h3>
              <p className="text-blue-100">
                Handle images, documents, and other file types seamlessly
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Share2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Easy Sharing</h3>
              <p className="text-blue-100">
                Generate shareable links and start collecting responses immediately
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Create Your First AI-Powered Form?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of users who are already creating amazing forms with AI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/register" 
              className="btn btn-primary text-lg px-8 py-3"
            >
              Start Creating Forms
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link 
              href="/login" 
              className="btn btn-outline text-lg px-8 py-3"
            >
              Sign In to Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
