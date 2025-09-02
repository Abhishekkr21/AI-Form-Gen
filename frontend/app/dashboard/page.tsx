'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Copy, 
  Edit, 
  Trash2, 
  Eye,
  BarChart3,
  Sparkles,
  Loader2,
  FileText,
  Users,
  TrendingUp
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Form {
  _id: string;
  title: string;
  description: string;
  publicId: string;
  submissionCount: number;
  createdAt: string;
  lastSubmissionAt?: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

export default function DashboardPage() {
  const [forms, setForms] = useState<Form[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    fetchForms();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
    }
  };

  const fetchForms = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/forms/my-forms', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch forms');
      }

      const data = await response.json();
      setForms(data.forms);
    } catch (error) {
      toast.error('Failed to fetch forms');
    } finally {
      setIsLoading(false);
    }
  };

  const copyFormLink = (publicId: string) => {
    const link = `${window.location.origin}/form/${publicId}`;
    navigator.clipboard.writeText(link);
    toast.success('Form link copied to clipboard!');
  };

  const deleteForm = async (formId: string) => {
    if (!confirm('Are you sure you want to delete this form? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/forms/${formId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete form');
      }

      toast.success('Form deleted successfully');
      fetchForms();
    } catch (error) {
      toast.error('Failed to delete form');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const filteredForms = forms.filter(form =>
    form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">AI Form Gen</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name}</span>
              <button
                onClick={logout}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your forms and view submissions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="card-content">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Forms</p>
                  <p className="text-2xl font-bold text-gray-900">{forms.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-content">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {forms.reduce((sum, form) => sum + form.submissionCount, 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-content">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Forms</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {forms.filter(form => form.isPublic).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-content">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {forms.filter(form => {
                      const lastMonth = new Date();
                      lastMonth.setMonth(lastMonth.getMonth() - 1);
                      return new Date(form.createdAt) > lastMonth;
                    }).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search forms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
          </div>
          
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn btn-primary"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Form
          </button>
        </div>

        {/* Forms Grid */}
        {filteredForms.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No forms yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first AI-powered form to get started
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn btn-primary"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Form
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredForms.map((form) => (
              <div key={form._id} className="card hover:shadow-md transition-shadow duration-300">
                <div className="card-header">
                  <div className="flex justify-between items-start">
                    <h3 className="card-title text-lg">{form.title}</h3>
                    <div className="relative">
                      <button 
                        className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                        title="More options"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                  <p className="card-description line-clamp-2">{form.description}</p>
                </div>
                
                <div className="card-content">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <span>{form.submissionCount} submissions</span>
                    <span>{new Date(form.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => copyFormLink(form.publicId)}
                      className="btn btn-outline btn-sm flex-1"
                      title="Copy form link"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy Link
                    </button>
                    
                    <Link
                      href={`/form/${form.publicId}`}
                      className="btn btn-outline btn-sm"
                      title="View form"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    
                    <Link
                      href={`/form/${form.publicId}`}
                      className="btn btn-outline btn-sm"
                      title="Open form"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    
                    <button
                      onClick={() => deleteForm(form._id)}
                      className="btn btn-outline btn-sm text-red-600 hover:bg-red-50"
                      title="Delete form"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Form Modal */}
      {showCreateForm && (
        <CreateFormModal
          onClose={() => setShowCreateForm(false)}
          onFormCreated={() => {
            setShowCreateForm(false);
            fetchForms();
          }}
        />
      )}
    </div>
  );
}

// Create Form Modal Component
function CreateFormModal({ onClose, onFormCreated }: { 
  onClose: () => void; 
  onFormCreated: () => void; 
}) {
  const [prompt, setPrompt] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error('Please enter a prompt for form generation');
      return;
    }

    setIsGenerating(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/ai/generate-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          title: title.trim() || undefined,
          description: description.trim() || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate form');
      }

      toast.success('Form generated successfully!');
      onFormCreated();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate form');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="card-header border-b">
          <h2 className="card-title">Create New Form with AI</h2>
          <p className="card-description">
            Describe what kind of form you need and our AI will generate it for you
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="card-content">
          <div className="space-y-6">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                Describe your form *
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="textarea"
                placeholder="e.g., Create a job application form with personal details, experience, resume upload, and cover letter field"
                rows={4}
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Be specific about the fields, validation rules, and file uploads you need
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Form Title (optional)
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input"
                  placeholder="e.g., Job Application Form"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description (optional)
                </label>
                <input
                  id="description"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input"
                  placeholder="e.g., Professional job application form"
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Example Prompts</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• "Create a contact form with name, email, phone, message, and profile picture upload"</li>
                <li>• "Design a customer feedback survey with rating scales and comment sections"</li>
                <li>• "Build a workshop registration form with dietary preferences and file uploads"</li>
              </ul>
            </div>
          </div>
        </form>

        <div className="card-footer border-t">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
              disabled={isGenerating}
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isGenerating || !prompt.trim()}
              className="btn btn-primary"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Form
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
