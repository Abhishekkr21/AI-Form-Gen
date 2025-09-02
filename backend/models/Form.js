const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['text', 'email', 'number', 'textarea', 'select', 'checkbox', 'radio', 'file', 'date', 'tel', 'url']
  },
  required: {
    type: Boolean,
    default: false
  },
  placeholder: String,
  options: [String], // For select, radio, checkbox
  validation: {
    min: Number,
    max: Number,
    pattern: String,
    minLength: Number,
    maxLength: Number
  },
  fileConfig: {
    accept: String, // e.g., "image/*,.pdf"
    maxSize: Number, // in bytes
    multiple: Boolean
  },
  order: {
    type: Number,
    required: true
  }
});

const formSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  prompt: {
    type: String,
    required: true
  },
  fields: [fieldSchema],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  allowMultipleSubmissions: {
    type: Boolean,
    default: true
  },
  submissionCount: {
    type: Number,
    default: 0
  },
  lastSubmissionAt: Date,
  settings: {
    theme: {
      type: String,
      default: 'default',
      enum: ['default', 'dark', 'minimal', 'colorful']
    },
    showProgressBar: {
      type: Boolean,
      default: true
    },
    redirectUrl: String
  },
  aiGeneratedAt: {
    type: Date,
    default: Date.now
  },
  publicId: {
    type: String,
    unique: true,
    sparse: true
  }
}, {
  timestamps: true
});

// Generate unique public ID for sharing
formSchema.pre('save', function(next) {
  if (!this.publicId) {
    this.publicId = Math.random().toString(36).substring(2, 15) + 
                   Math.random().toString(36).substring(2, 15);
  }
  next();
});

// Index for faster queries
formSchema.index({ creator: 1, createdAt: -1 });
formSchema.index({ publicId: 1 });

module.exports = mongoose.model('Form', formSchema);
