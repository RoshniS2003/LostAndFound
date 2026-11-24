# Lost & Found Management System

## Subject Details

- **Subject Name:** Backend Development using Node.js
- **Subject Code:** RU-600-05-00086
- **Project Name:** Lost & Found Management System

## Team Members

- Roshni Sahu


## Project Description

The Lost & Found Management System is a web-based application designed to help students and faculty report, find, and manage lost and found items within an institution.

Users can submit lost or found item reports with relevant details and images. The administrator can review reports, approve found item submissions, and help manage the verification process.

The main objective of this project is to make the lost and found process more organized, accessible, and efficient.

## Features

- User registration and login
- Role-based access for students, faculty, and administrators
- Report lost items with details and images
- Report found items with details and images
- Browse available lost and found reports
- View item details
- Admin dashboard for managing reports
- Admin approval of found item reports
- Item status management
- Image upload and storage using Cloudinary
- Secure authentication using JWT

## Technology Stack

### Frontend
- React.js
- Vite
- JavaScript
- CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js
- JavaScript
- MongoDB
- Mongoose
- JWT Authentication

### Image Storage
- Cloudinary

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## Project Structure

```text
LostAndFound/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   ├── middleware/
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/RoshniS2003/LostAndFound.git
```

```bash
cd LostAndFound
```

### 2. Backend Setup

Open the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the backend folder and configure the required environment variables.

Example:

```env
PORT=8000
MONGODB_URL=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

STAFF_CODE=your_staff_code
```

Start the backend server:

```bash
npm start
```

### 3. Frontend Setup

Open a new terminal and navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the frontend folder:

```env
VITE_API_URL=http://localhost:8000/api
```

Start the frontend:

```bash
npm run dev
```

The application will run locally at:

```text
http://localhost:5173
```

**Note:** Use the actual environment variable names required by the source code. Never upload real passwords, API keys, database URLs, or secret keys to GitHub.

## Live Deployment

- **Frontend Website:** https://lost-and-found-two-zeta.vercel.app
- **Backend API:** https://lostandfound-api-plxg.onrender.com
- **Backend Health Check:** https://lostandfound-api-plxg.onrender.com/api/health

## GitHub Repository

https://github.com/RoshniS2003/LostAndFound

## Security

- Environment variables are used to store sensitive credentials.
- The `.env` file should not be committed to GitHub.
- Authentication is implemented using JWT.
- Passwords are handled securely by the backend.

## Conclusion

The Lost & Found Management System provides a centralized platform for reporting and managing lost and found items within an institution. It reduces the manual effort involved in managing item reports and helps administrators organize the verification process.