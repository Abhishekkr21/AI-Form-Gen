# 🤖 AI-Powered Form Generator

A full-stack web application that uses Google Gemini AI to generate dynamic forms from natural language prompts. Users can create forms, share them via public links, and collect responses with file uploads.

## ✨ Features

- **AI-Powered Form Generation**: Describe your form in natural language and let AI create it
- **Dynamic Form Rendering**: Forms are automatically generated and rendered based on AI schemas
- **File Upload Support**: Handle images, documents, and other file types
- **Shareable Links**: Generate unique public URLs for anyone to access your forms
- **Response Management**: Track all submissions in your personal dashboard
- **Real-time Updates**: See form submissions as they happen
- **Responsive Design**: Beautiful, modern UI that works on all devices

## 🛠 Tech Stack

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose** ODM
- **Google Gemini AI API** for form generation
- **Cloudinary** for file uploads
- **JWT** authentication
- **Multer** for file handling

### Frontend
- **Next.js 15** with **TypeScript**
- **Tailwind CSS** for styling
- **React Hook Form** for form management
- **React Dropzone** for file uploads
- **Lucide React** for icons
- **React Hot Toast** for notifications

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- Google Gemini API key
- Cloudinary account

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ai-form-generator
```

### 2. Install Dependencies
```bash
npm run install:all
```

### 3. Environment Setup

#### Backend Configuration
Create a `.env` file in the `backend` directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/ai-form-generator
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/ai-form-generator

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Google Gemini API
GEMINI_API_KEY=your-gemini-api-key-here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Server Configuration
PORT=5000
NODE_ENV=development
```

#### Frontend Configuration
The frontend is configured to proxy API calls to the backend. No additional configuration needed.

### 4. Start Development Servers
```bash
npm run dev
```

This will start both:
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

### 5. Access the Application
Open http://localhost:3000 in your browser to start using the app.

## 📝 Example Prompts

Here are some example prompts you can try with the AI form generator:

### Contact Form
```
"Create a contact form with name, email, phone number, message field, and profile picture upload"
```

### Job Application
```
"Design a job application form with personal details, work experience, resume upload, cover letter, and references"
```

### Customer Survey
```
"Build a customer feedback survey with rating scales, comment sections, and file upload for screenshots"
```

### Workshop Registration
```
"Generate a workshop registration form with name, email, dietary preferences, and document uploads"
```

### Product Review
```
"Create a product review form with star ratings, text feedback, photo uploads, and purchase date"
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### AI Form Generation
- `POST /api/ai/generate-form` - Generate new form with AI
- `POST /api/ai/regenerate-form/:id` - Regenerate existing form

### Forms
- `GET /api/forms/my-forms` - Get user's forms
- `GET /api/forms/:id` - Get specific form
- `GET /api/forms/public/:publicId` - Get public form
- `PUT /api/forms/:id` - Update form
- `DELETE /api/forms/:id` - Delete form

### Submissions
- `POST /api/submissions/submit/:publicId` - Submit form response
- `GET /api/submissions/form/:formId` - Get form submissions
- `GET /api/submissions/:id` - Get specific submission

## 📁 Project Structure

```
ai-form-generator/
├── backend/                 # Express.js backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Authentication middleware
│   ├── server.js           # Main server file
│   └── package.json        # Backend dependencies
├── frontend/               # Next.js frontend
│   ├── app/                # App router pages
│   ├── components/         # React components
│   ├── globals.css         # Global styles
│   └── package.json        # Frontend dependencies
├── package.json            # Root package.json
└── README.md               # This file
```

## 🎯 How It Works

1. **Form Creation**: User describes desired form in natural language
2. **AI Processing**: Gemini AI analyzes the prompt and generates a JSON schema
3. **Form Generation**: Backend creates a form based on the AI schema
4. **Dynamic Rendering**: Frontend renders the form using the generated schema
5. **Response Collection**: Users can submit responses including file uploads
6. **Data Storage**: Responses are stored in MongoDB with files in Cloudinary

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting on API endpoints
- CORS configuration
- Helmet.js security headers

## 🚀 Deployment

### Backend Deployment
1. Set environment variables for production
2. Deploy to platforms like Heroku, Railway, or DigitalOcean
3. Ensure MongoDB connection is accessible

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or any static hosting service
3. Update API proxy configuration for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the console for error messages
2. Verify your environment variables are set correctly
3. Ensure MongoDB is running and accessible
4. Check that your API keys are valid

## 🔮 Future Enhancements

- Multi-step form support
- Advanced form themes and customization
- Form templates library
- Advanced analytics and reporting
- Team collaboration features
- Form versioning and history
- Integration with third-party services
- Mobile app development

## 🙏 Acknowledgments

- Google Gemini AI for intelligent form generation
- Cloudinary for reliable file storage
- MongoDB for robust data persistence
- Next.js team for the amazing framework
- Tailwind CSS for beautiful styling utilities

---

**Happy Form Building! 🎉**
