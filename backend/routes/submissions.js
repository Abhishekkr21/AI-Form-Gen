const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Form = require('../models/Form');
const Submission = require('../models/Submission');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow common file types
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|csv/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image, PDF, and document files are allowed'));
    }
  }
});

// Submit a form response
router.post('/submit/:publicId', optionalAuth, upload.array('files'), async (req, res) => {
  try {
    const { publicId } = req.params;
    const { responses, fileFields } = req.body;
    
    // Get the form
    const form = await Form.findOne({ publicId });
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    if (!form.isPublic) {
      return res.status(403).json({ error: 'This form is not public' });
    }

    // Parse responses
    let parsedResponses;
    try {
      parsedResponses = JSON.parse(responses);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid responses format' });
    }

    // Validate responses against form fields
    const formFields = form.fields.reduce((acc, field) => {
      acc[field.name] = field;
      return acc;
    }, {});

    const validatedResponses = [];
    let totalFileSize = 0;
    let totalFiles = 0;

    for (const response of parsedResponses) {
      const field = formFields[response.fieldName];
      if (!field) {
        return res.status(400).json({ error: `Unknown field: ${response.fieldName}` });
      }

      // Validate required fields
      if (field.required && (!response.value || 
          (Array.isArray(response.value) && response.value.length === 0))) {
        return res.status(400).json({ 
          error: `Field '${field.label}' is required` 
        });
      }

      // Handle file uploads
      if (field.type === 'file' && req.files) {
        // Parse fileFields array to map files to their fields
        const fileFieldsArray = Array.isArray(fileFields) ? fileFields : [];
        const fieldFiles = req.files.filter((file, index) => 
          fileFieldsArray[index] === response.fieldName
        );

        if (fieldFiles.length === 0 && field.required) {
          return res.status(400).json({ 
            error: `File upload required for '${field.label}'` 
          });
        }

        // Upload files to Cloudinary
        const fileUrls = [];
        for (const file of fieldFiles) {
          try {
            // Wait for upload to complete
            const uploadResult = await new Promise((resolve, reject) => {
              cloudinary.uploader.upload_stream(
                {
                  resource_type: 'auto',
                  folder: `ai-forms/${form._id}/${response.fieldName}`,
                  public_id: `${Date.now()}-${Math.random().toString(36).substring(7)}`
                },
                (error, result) => {
                  if (error) reject(error);
                  else resolve(result);
                }
              ).end(file.buffer);
            });

            fileUrls.push(uploadResult.secure_url);
            totalFileSize += uploadResult.bytes;
            totalFiles++;
          } catch (uploadError) {
            console.error('File upload error:', uploadError);
            return res.status(500).json({ 
              error: `Failed to upload file: ${file.originalname}` 
            });
          }
        }

        response.fileUrls = fileUrls;
        response.value = fileUrls.length > 0 ? fileUrls : null;
      }

      // Validate field values
      if (response.value && field.validation) {
        const validation = field.validation;
        
        if (validation.minLength && response.value.length < validation.minLength) {
          return res.status(400).json({ 
            error: `'${field.label}' must be at least ${validation.minLength} characters` 
          });
        }
        
        if (validation.maxLength && response.value.length > validation.maxLength) {
          return res.status(400).json({ 
            error: `'${field.label}' must be no more than ${validation.maxLength} characters` 
          });
        }
        
        if (validation.min !== undefined && response.value < validation.min) {
          return res.status(400).json({ 
            error: `'${field.label}' must be at least ${validation.min}` 
          });
        }
        
        if (validation.max !== undefined && response.value > validation.max) {
          return res.status(400).json({ 
            error: `'${field.label}' must be no more than ${validation.max}` 
          });
        }
      }

      validatedResponses.push({
        fieldName: response.fieldName,
        fieldType: field.type,
        value: response.value,
        fileUrls: response.fileUrls || [],
        submittedAt: new Date()
      });
    }

    // Create submission
    const submission = new Submission({
      formId: form._id,
      submitterInfo: {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date()
      },
      responses: validatedResponses,
      totalFiles,
      totalFileSize
    });

    await submission.save();

    // Update form submission count
    form.submissionCount += 1;
    form.lastSubmissionAt = new Date();
    await form.save();

    res.status(201).json({
      message: 'Form submitted successfully',
      submissionId: submission._id
    });

  } catch (error) {
    console.error('Form submission error:', error);
    res.status(500).json({ 
      error: 'Error submitting form',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get submissions for a form (form creator only)
router.get('/form/:formId', auth, async (req, res) => {
  try {
    const { formId } = req.params;
    const { page = 1, limit = 20, status } = req.query;
    
    // Get the form and check ownership
    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    if (form.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Build query
    const query = { formId };
    if (status) {
      query.status = status;
    }

    const submissions = await Submission.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Submission.countDocuments(query);

    res.json({
      submissions,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ 
      error: 'Error fetching submissions',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get a specific submission
router.get('/:submissionId', auth, async (req, res) => {
  try {
    const { submissionId } = req.params;
    
    const submission = await Submission.findById(submissionId)
      .populate('formId', 'title creator');
    
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Check if user owns the form
    if (submission.formId.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ submission });
  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({ 
      error: 'Error fetching submission',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Update submission status
router.put('/:submissionId/status', auth, async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { status, notes } = req.body;
    
    const submission = await Submission.findById(submissionId)
      .populate('formId', 'creator');
    
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Check if user owns the form
    if (submission.formId.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update status and notes
    submission.status = status;
    if (notes !== undefined) submission.notes = notes;
    
    await submission.save();

    res.json({
      message: 'Submission status updated successfully',
      submission: {
        id: submission._id,
        status: submission.status,
        notes: submission.notes,
        updatedAt: submission.updatedAt
      }
    });
  } catch (error) {
    console.error('Error updating submission status:', error);
    res.status(500).json({ 
      error: 'Error updating submission status',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Delete a submission
router.delete('/:submissionId', auth, async (req, res) => {
  try {
    const { submissionId } = req.params;
    
    const submission = await Submission.findById(submissionId)
      .populate('formId', 'creator');
    
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Check if user owns the form
    if (submission.formId.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Delete files from Cloudinary if they exist
    if (submission.totalFiles > 0) {
      for (const response of submission.responses) {
        if (response.fileUrls && response.fileUrls.length > 0) {
          for (const fileUrl of response.fileUrls) {
            try {
              const publicId = fileUrl.split('/').pop().split('.')[0];
              await cloudinary.uploader.destroy(publicId);
            } catch (deleteError) {
              console.error('Error deleting file from Cloudinary:', deleteError);
            }
          }
        }
      }
    }

    await Submission.findByIdAndDelete(submissionId);

    res.json({ message: 'Submission deleted successfully' });
  } catch (error) {
    console.error('Error deleting submission:', error);
    res.status(500).json({ 
      error: 'Error deleting submission',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;
