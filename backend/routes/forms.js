const express = require('express');
const Form = require('../models/Form');
const Submission = require('../models/Submission');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all forms for the authenticated user
router.get('/my-forms', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    
    const query = { creator: req.user._id };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const forms = await Form.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('creator', 'name email');

    const total = await Form.countDocuments(query);

    res.json({
      forms,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching forms:', error);
    res.status(500).json({ 
      error: 'Error fetching forms',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get a specific form by ID (for editing)
router.get('/:formId', auth, async (req, res) => {
  try {
    const { formId } = req.params;
    
    const form = await Form.findById(formId)
      .populate('creator', 'name email');
    
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    // Check ownership
    if (form.creator._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ form });
  } catch (error) {
    console.error('Error fetching form:', error);
    res.status(500).json({ 
      error: 'Error fetching form',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get public form by public ID (for submissions)
router.get('/public/:publicId', optionalAuth, async (req, res) => {
  try {
    const { publicId } = req.params;
    
    const form = await Form.findOne({ publicId })
      .populate('creator', 'name');
    
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    if (!form.isPublic) {
      return res.status(403).json({ error: 'This form is not public' });
    }

    // Don't send sensitive information
    const publicForm = {
      id: form._id,
      publicId: form.publicId,
      title: form.title,
      description: form.description,
      fields: form.fields,
      settings: form.settings,
      createdAt: form.createdAt,
      creatorName: form.creator.name
    };

    res.json({ form: publicForm });
  } catch (error) {
    console.error('Error fetching public form:', error);
    res.status(500).json({ 
      error: 'Error fetching form',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Update form settings
router.put('/:formId', auth, async (req, res) => {
  try {
    const { formId } = req.params;
    const { title, description, isPublic, allowMultipleSubmissions, settings } = req.body;
    
    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    // Check ownership
    if (form.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update allowed fields only
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (isPublic !== undefined) updates.isPublic = isPublic;
    if (allowMultipleSubmissions !== undefined) updates.allowMultipleSubmissions = allowMultipleSubmissions;
    if (settings) updates.settings = { ...form.settings, ...settings };

    const updatedForm = await Form.findByIdAndUpdate(
      formId,
      updates,
      { new: true, runValidators: true }
    ).populate('creator', 'name email');

    res.json({
      message: 'Form updated successfully',
      form: updatedForm
    });
  } catch (error) {
    console.error('Error updating form:', error);
    res.status(500).json({ 
      error: 'Error updating form',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Delete a form
router.delete('/:formId', auth, async (req, res) => {
  try {
    const { formId } = req.params;
    
    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    // Check ownership
    if (form.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Delete all submissions first
    await Submission.deleteMany({ formId });
    
    // Delete the form
    await Form.findByIdAndDelete(formId);

    res.json({ message: 'Form and all submissions deleted successfully' });
  } catch (error) {
    console.error('Error deleting form:', error);
    res.status(500).json({ 
      error: 'Error deleting form',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Duplicate a form
router.post('/:formId/duplicate', auth, async (req, res) => {
  try {
    const { formId } = req.params;
    const { title, description } = req.body;
    
    const originalForm = await Form.findById(formId);
    if (!originalForm) {
      return res.status(404).json({ error: 'Form not found' });
    }

    // Check ownership
    if (originalForm.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Create new form with copied data
    const duplicatedForm = new Form({
      title: title || `${originalForm.title} (Copy)`,
      description: description || originalForm.description,
      prompt: originalForm.prompt,
      fields: originalForm.fields,
      creator: req.user._id,
      settings: originalForm.settings
    });

    await duplicatedForm.save();

    res.status(201).json({
      message: 'Form duplicated successfully',
      form: {
        id: duplicatedForm._id,
        title: duplicatedForm.title,
        description: duplicatedForm.description,
        publicId: duplicatedForm.publicId,
        createdAt: duplicatedForm.createdAt
      }
    });
  } catch (error) {
    console.error('Error duplicating form:', error);
    res.status(500).json({ 
      error: 'Error duplicating form',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get form analytics
router.get('/:formId/analytics', auth, async (req, res) => {
  try {
    const { formId } = req.params;
    
    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    // Check ownership
    if (form.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get submission statistics
    const totalSubmissions = await Submission.countDocuments({ formId });
    const recentSubmissions = await Submission.countDocuments({
      formId,
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
    });

    // Get field response statistics
    const fieldStats = await Submission.aggregate([
      { $match: { formId: form._id } },
      { $unwind: '$responses' },
      {
        $group: {
          _id: '$responses.fieldName',
          responseCount: { $sum: 1 },
          fieldType: { $first: '$responses.fieldType' }
        }
      }
    ]);

    res.json({
      analytics: {
        totalSubmissions,
        recentSubmissions,
        fieldStats,
        formCreated: form.createdAt,
        lastSubmission: form.lastSubmissionAt
      }
    });
  } catch (error) {
    console.error('Error fetching form analytics:', error);
    res.status(500).json({ 
      error: 'Error fetching analytics',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;
