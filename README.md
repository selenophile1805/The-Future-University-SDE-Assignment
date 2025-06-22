# Storylane - Social Media Platform

A modern social media platform built with FastAPI backend and React frontend.

## 🌐 Live Demo

- **Frontend**: https://airy-strength-production.up.railway.app/
- **Backend API**: https://the-future-university-sde-assignment-production.up.railway.app
- **Backend API DOCS**: https://the-future-university-sde-assignment-production.up.railway.app/docs


## 🚀 Project Setup

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python main.py
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 🛠️ Technologies Used

**Backend:**
- FastAPI
- Supabase (PostgreSQL)
- JWT Authentication
- Cloudinary (Image Storage)
- Railway (Deployment)

**Frontend:**
- React
- Tailwind CSS
- Axios
- JWT Token Management

## ✨ Key Features

- **User Authentication**: Register, login, JWT-based auth
- **User Profiles**: Edit name, bio, profile picture
- **Post Creation**: Text posts with image uploads
- **Global Feed**: View all posts with real-time updates
- **Like System**: Like posts with counter
- **Responsive Design**: Mobile-friendly UI
- **Image Upload**: Cloudinary integration
- **Modern UI**: Tailwind CSS with animations

## ⚠️ Limitations & Known Issues

- **No Real-time Updates**: Posts require page refresh
- **No Comments**: Like system only, no commenting
- **No User Search**: Can't search for other users
- **No Follow System**: All posts visible to everyone
- **Image Size Limit**: No explicit file size validation
- **No Password Reset**: Basic auth only
