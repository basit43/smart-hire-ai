# Smart Hire AI 🚀

AI-powered resume screening backend built with MERN stack and HuggingFace NLP models.

## Features

- JWT Authentication
- Resume Upload (PDF)
- PDF Text Extraction
- AI Resume Summarization
- AI Job Description Summarization
- Match Score Calculation
- MongoDB Persistence

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- Multer
- pdfjs-dist
- HuggingFace Inference API

## Setup

```bash
git clone https://github.com/basit43/smart-hire-ai.git
cd smart-hire-ai
npm install
```

Create `.env` file:

```
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret
HF_API_KEY=your_key
```

Run:

```bash
npm run dev
```

## API Endpoints

### Register
POST `/api/auth/register`

### Login
POST `/api/auth/login`

### Upload Resume
POST `/api/resume/upload`

Headers:
Authorization: Bearer token

Form-data:
- resume (file)
- jobDescription (text)

---

Built by Abdul Basit