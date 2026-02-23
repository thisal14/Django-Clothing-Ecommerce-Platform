---
description: How to run the Ecommerce Application (Backend & Frontend)
---

### Backend (Django)
// turbo
1. Navigate to the backend directory:
   `cd backend`
2. Activate the virtual environment (if not already active):
   `.\venv\Scripts\activate` (Windows)
3. Install dependencies:
   `pip install -r requirements.txt`
4. Run migrations:
   `python manage.py migrate`
5. Start the server:
   `python manage.py runserver`
   *Server will be available at http://127.0.0.1:8000/*

### Frontend (React + Vite)
// turbo
1. Navigate to the frontend directory:
   `cd frontend`
2. Install dependencies:
   `npm install`
3. Start the development server:
   `npm run dev`
   *Application will be available at http://localhost:5173/*
