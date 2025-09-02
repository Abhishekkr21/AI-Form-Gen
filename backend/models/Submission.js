const mongoose = require('mongoose');

const fieldResponseSchema = new mongoose.Schema({
  fieldName: {
    type: String,
    required: true
  },
  fieldType: {
    type: String,
    required: true
  },
  value: mongoose.Schema.Types.Mixed, // Can be string, number, array, etc.
  fileUrls: [String], // For file uploads
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

const submissionSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
    required: true
  },
  submitterInfo: {
    ip: String,
    userAgent: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  responses: [fieldResponseSchema],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  notes: String, // For form creator to add notes
  totalFiles: {
    type: Number,
    default: 0
  },
  totalFileSize: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for faster queries
submissionSchema.index({ formId: 1, createdAt: -1 });
submissionSchema.index({ 'submitterInfo.timestamp': -1 });

// Virtual for total responses count
submissionSchema.virtual('responseCount').get(function() {
  return this.responses.length;
});

// Method to get file responses only
submissionSchema.methods.getFileResponses = function() {
  return this.responses.filter(response => 
    response.fieldType === 'file' && response.fileUrls.length > 0
  );
};

// Method to get total file count
submissionSchema.methods.getTotalFileCount = function() {
  return this.responses.reduce((total, response) => {
    if (response.fieldType === 'file') {
      return total + (response.fileUrls ? response.fileUrls.length : 0);
    }
    return total;
  }, 0);
};

module.exports = mongoose.model('Submission', submissionSchema);
