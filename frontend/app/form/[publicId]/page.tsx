'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';

interface FormField {
  name: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    minLength?: number;
    maxLength?: number;
  };
  fileConfig?: {
    accept: string;
    maxSize: number;
    multiple: boolean;
  };
  order: number;
}

interface Form {
  id: string;
  publicId: string;
  title: string;
  description: string;
  fields: FormField[];
  settings: {
    theme: string;
    showProgressBar: boolean;
    redirectUrl?: string;
  };
  creatorName: string;
}

interface FormResponse {
  fieldName: string;
  value: any;
  files?: File[];
}

export default function FormPage() {
  const params = useParams();
  const publicId = params.publicId as string;
  
  const [form, setForm] = useState<Form | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [fileUploads, setFileUploads] = useState<{ [key: string]: File[] }>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  useEffect(() => {
    fetchForm();
  }, [publicId]);

  const fetchForm = async () => {
    try {
      const response = await fetch(`/api/forms/public/${publicId}`);
      
      if (!response.ok) {
        throw new Error('Form not found');
      }

      const data = await response.json();
      setForm(data.form);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load form');
    } finally {
      setIsLoading(false);
    }
  };

  const onDrop = (acceptedFiles: File[], fieldName: string) => {
    console.log('Files dropped for field:', fieldName, acceptedFiles);
    setFileUploads(prev => ({
      ...prev,
      [fieldName]: acceptedFiles
    }));
  };

  const onDropRejected = (fileRejections: any[], fieldName: string) => {
    console.log('Files rejected for field:', fieldName, fileRejections);
    fileRejections.forEach(rejection => {
      rejection.errors.forEach((error: any) => {
        toast.error(`File ${rejection.file.name}: ${error.message}`);
      });
    });
  };

  // Create a generic dropzone configuration
  const getDropzoneConfig = (fieldName: string, fieldConfig?: any) => ({
    onDrop: (files: File[]) => onDrop(files, fieldName),
    onDropRejected: (fileRejections: any[]) => onDropRejected(fileRejections, fieldName),
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: fieldConfig?.maxSize || 10 * 1024 * 1024, // 10MB default
    multiple: fieldConfig?.multiple || false,
  });

  // File upload component
  const FileUploadField = ({ field }: { field: FormField }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone(getDropzoneConfig(field.name, field.fileConfig));
    const fieldId = `field-${field.name}`;
    
    return (
      <div className="space-y-2">
        <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">
            {isDragActive
              ? 'Drop files here...'
              : 'Drag & drop files here, or click to select'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Accepted: {field.fileConfig?.accept || 'images, PDFs, documents'} 
            (Max: {Math.round((field.fileConfig?.maxSize || 10 * 1024 * 1024) / (1024 * 1024))}MB)
          </p>
        </div>
        
        {fileUploads[field.name] && fileUploads[field.name].length > 0 && (
          <div className="mt-2">
            <p className="text-sm font-medium text-gray-700 mb-2">Selected files:</p>
            <div className="space-y-1">
              {fileUploads[field.name].map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                  <span className="text-sm text-gray-700">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const newFiles = fileUploads[field.name].filter((_, i) => i !== index);
                      setFileUploads(prev => ({
                        ...prev,
                        [field.name]: newFiles
                      }));
                    }}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderField = (field: FormField) => {
    const fieldId = `field-${field.name}`;
    const isFileField = field.type === 'file';

    if (isFileField) {
      return <FileUploadField key={fieldId} field={field} />;
    }

    const commonProps = {
      id: fieldId,
      className: `input ${errors[field.name] ? 'border-red-500' : ''}`,
      placeholder: field.placeholder,
      ...register(field.name, {
        required: field.required ? `${field.label} is required` : false,
        minLength: field.validation?.minLength ? {
          value: field.validation.minLength,
          message: `${field.label} must be at least ${field.validation.minLength} characters`
        } : undefined,
        maxLength: field.validation?.maxLength ? {
          value: field.validation.maxLength,
          message: `${field.label} must be no more than ${field.validation.maxLength} characters`
        } : undefined,
        min: field.validation?.min ? {
          value: field.validation.min,
          message: `${field.label} must be at least ${field.validation.min}`
        } : undefined,
        max: field.validation?.max ? {
          value: field.validation.max,
          message: `${field.label} must be no more than ${field.validation.max}`
        } : undefined,
        pattern: field.validation?.pattern ? {
          value: new RegExp(field.validation.pattern),
          message: `${field.label} format is invalid`
        } : undefined,
      })
    };

    switch (field.type) {
      case 'textarea':
        return (
          <div key={fieldId} className="space-y-2">
            <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              {...commonProps}
              rows={4}
              className={`textarea ${errors[field.name] ? 'border-red-500' : ''}`}
            />
            {errors[field.name] && (
              <p className="text-sm text-red-600">{errors[field.name].message}</p>
            )}
          </div>
        );

      case 'select':
        return (
          <div key={fieldId} className="space-y-2">
            <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select {...commonProps}>
              <option value="">Select an option</option>
              {field.options?.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors[field.name] && (
              <p className="text-sm text-red-600">{errors[field.name].message}</p>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div key={fieldId} className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                {...commonProps}
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor={fieldId} className="text-sm font-medium text-gray-700">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            </div>
            {errors[field.name] && (
              <p className="text-sm text-red-600">{errors[field.name].message}</p>
            )}
          </div>
        );

      case 'radio':
        return (
          <div key={fieldId} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {field.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    {...commonProps}
                    type="radio"
                    value={option}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label className="text-sm text-gray-700">{option}</label>
                </div>
              ))}
            </div>
            {errors[field.name] && (
              <p className="text-sm text-red-600">{errors[field.name].message}</p>
            )}
          </div>
        );

      default:
        return (
          <div key={fieldId} className="space-y-2">
            <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              {...commonProps}
              type={field.type}
            />
            {errors[field.name] && (
              <p className="text-sm text-red-600">{errors[field.name].message}</p>
            )}
          </div>
        );
    }
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      // Prepare form data for submission
      const formData = new FormData();
      
      // Add form responses
      const responses: FormResponse[] = [];
      form?.fields.forEach(field => {
        if (field.type === 'file') {
          const files = fileUploads[field.name] || [];
          responses.push({
            fieldName: field.name,
            value: files.length > 0 ? files.map(f => f.name) : null,
            files: files
          });
        } else {
          responses.push({
            fieldName: field.name,
            value: data[field.name]
          });
        }
      });

      formData.append('responses', JSON.stringify(responses));

      // Add files with field name
      Object.entries(fileUploads).forEach(([fieldName, files]) => {
        files.forEach(file => {
          formData.append('files', file);
          formData.append('fileFields', fieldName);
        });
      });

      const response = await fetch(`/api/submissions/submit/${publicId}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit form');
      }

      setSubmitted(true);
      toast.success('Form submitted successfully!');
      
      // Redirect if specified
      if (form?.settings.redirectUrl) {
        setTimeout(() => {
          window.location.href = form.settings.redirectUrl!;
        }, 2000);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to submit form');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Form Not Found</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <a
            href="/"
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Return to home
          </a>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h1>
          <p className="text-gray-600 mb-4">
            Your form has been submitted successfully.
          </p>
          {form?.settings.redirectUrl && (
            <p className="text-sm text-gray-500">
              Redirecting you to {form.settings.redirectUrl}...
            </p>
          )}
        </div>
      </div>
    );
  }

  if (!form) return null;

  const sortedFields = [...form.fields].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Form Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{form.title}</h1>
          {form.description && (
            <p className="text-lg text-gray-600">{form.description}</p>
          )}
          <p className="text-sm text-gray-500 mt-2">
            Created by {form.creatorName}
          </p>
        </div>

        {/* Progress Bar */}
        {form.settings.showProgressBar && (
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Step {currentStep} of {sortedFields.length}</span>
              <span>{Math.round((currentStep / sortedFields.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / sortedFields.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Form */}
        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {sortedFields.map((field, index) => (
              <div key={field.name}>
                {renderField(field)}
                {index < sortedFields.length - 1 && (
                  <div className="border-t border-gray-200 my-6" />
                )}
              </div>
            ))}

            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-full py-3 text-lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Form'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Powered by AI Form Generator
          </p>
        </div>
      </div>
    </div>
  );
}
