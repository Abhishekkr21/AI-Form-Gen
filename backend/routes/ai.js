const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Form = require('../models/Form');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// AI Form Generation
router.post('/generate-form', auth, async (req, res) => {
  try {
    const { prompt, title, description } = req.body;

    if (!prompt) {
      return res.status(400).json({ 
        error: 'Please provide a prompt for form generation' 
      });
    }

    // Enhanced prompt for better AI understanding
    const enhancedPrompt = `
You are an expert form designer. Based on the following user request, generate a JSON schema for a web form.

User Request: "${prompt}"

Requirements:
1. Create a logical, user-friendly form structure
2. Include appropriate field types (text, email, number, textarea, select, checkbox, radio, file, date, tel, url)
3. For file uploads, specify fileConfig with appropriate accept types and size limits
4. Add validation rules where appropriate
5. Make the form intuitive and easy to fill out
6. Include a title and description for the form

Return ONLY a valid JSON object with this exact structure:
{
  "title": "Form Title",
  "description": "Form description",
  "fields": [
    {
      "name": "field_name",
      "label": "Human Readable Label",
      "type": "field_type",
      "required": true/false,
      "placeholder": "Placeholder text if applicable",
      "options": ["option1", "option2"] // for select, radio, checkbox
      "validation": {
        "min": number,
        "max": number,
        "pattern": "regex_pattern",
        "minLength": number,
        "maxLength": number
      },
      "fileConfig": {
        "accept": "file_types",
        "maxSize": number_in_bytes,
        "multiple": true/false
      },
      "order": number
    }
  ]
}

Important: Ensure the JSON is valid and follows the exact structure above. Do not include any additional text or explanations.
`;

    // Generate form schema using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from response
    let formSchema;
    try {
      // Find JSON content in the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in AI response');
      }
      
      formSchema = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.error('AI response:', text);
      return res.status(500).json({ 
        error: 'Failed to parse AI-generated form schema',
        message: 'The AI response could not be parsed. Please try again with a different prompt.'
      });
    }

    // Validate the generated schema
    if (!formSchema.title || !formSchema.fields || !Array.isArray(formSchema.fields)) {
      return res.status(500).json({ 
        error: 'Invalid form schema generated',
        message: 'The AI generated an incomplete form schema. Please try again.'
      });
    }

    // Add order to fields if not present
    formSchema.fields = formSchema.fields.map((field, index) => ({
      ...field,
      order: field.order || index + 1
    }));

    // Create the form in database
    const form = new Form({
      title: title || formSchema.title,
      description: description || formSchema.description,
      prompt: prompt,
      fields: formSchema.fields,
      creator: req.user._id
    });

    await form.save();

    res.status(201).json({
      message: 'Form generated successfully',
      form: {
        id: form._id,
        title: form.title,
        description: form.description,
        fields: form.fields,
        publicId: form.publicId,
        createdAt: form.createdAt
      }
    });

  } catch (error) {
    console.error('AI form generation error:', error);
    
    if (error.message.includes('API_KEY_INVALID')) {
      return res.status(500).json({ 
        error: 'AI service configuration error',
        message: 'Please check your Gemini API configuration.'
      });
    }
    
    res.status(500).json({ 
      error: 'Error generating form',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Failed to generate form. Please try again.'
    });
  }
});

// Regenerate form with modifications
router.post('/regenerate-form/:formId', auth, async (req, res) => {
  try {
    const { formId } = req.params;
    const { prompt, modifications } = req.body;

    if (!prompt) {
      return res.status(400).json({ 
        error: 'Please provide a prompt for regeneration' 
      });
    }

    // Get existing form
    const existingForm = await Form.findById(formId);
    if (!existingForm) {
      return res.status(404).json({ error: 'Form not found' });
    }

    // Check ownership
    if (existingForm.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Enhanced prompt for regeneration
    const enhancedPrompt = `
You are an expert form designer. The user wants to modify an existing form based on their feedback.

Original Form: ${JSON.stringify(existingForm.fields, null, 2)}

User Request: "${prompt}"

Additional Modifications: ${modifications || 'None specified'}

Requirements:
1. Modify the existing form based on the user's request
2. Keep the good parts and improve the problematic areas
3. Maintain the same JSON structure
4. Ensure all fields have proper validation and configuration
5. Make the form more user-friendly and intuitive

Return ONLY a valid JSON object with the updated fields array. Maintain the same structure as the original form.
`;

    // Generate updated form schema
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    const text = response.text();

    // Parse the updated schema
    let updatedFields;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in AI response');
      }
      
      const parsed = JSON.parse(jsonMatch[0]);
      updatedFields = parsed.fields || parsed;
    } catch (parseError) {
      return res.status(500).json({ 
        error: 'Failed to parse regenerated form schema',
        message: 'Please try again with a different prompt.'
      });
    }

    // Update the form
    existingForm.fields = updatedFields.map((field, index) => ({
      ...field,
      order: field.order || index + 1
    }));
    existingForm.prompt = prompt;
    existingForm.aiGeneratedAt = new Date();

    await existingForm.save();

    res.json({
      message: 'Form regenerated successfully',
      form: {
        id: existingForm._id,
        title: existingForm.title,
        fields: existingForm.fields,
        updatedAt: existingForm.updatedAt
      }
    });

  } catch (error) {
    console.error('Form regeneration error:', error);
    res.status(500).json({ 
      error: 'Error regenerating form',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Failed to regenerate form. Please try again.'
    });
  }
});

module.exports = router;
