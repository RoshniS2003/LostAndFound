<!-- README.md -->
# Lost & Found Network

## Project Description
A campus-based web app where students report lost and found items and get connected with each other, without using WhatsApp groups.

## Target Users
1. College Students - lose ID cards, wallets, notes, earphones
2. College Admin / Security - collect found items
3. Faculty - verify and approve items

## Tech Stack
- Frontend: React + Vite + Plain CSS
- Backend: Node.js + Express
- Database: MongoDB Atlas (Mongoose)
- Others: JWT Auth, Multer + Cloudinary (photos), Fuse.js (matching)

## Key Features
1. Signup / Login with JWT (roles: student, faculty, admin)
2. Report Lost Item and Found Item (title, category, description, photo, location, date)
3. Home page with cards, search, and Lost/Found/Category filters
4. Item detail page with Possible Matches
5. My Items page with delete
6. Admin / Faculty can approve items (isApproved true/false)

## Innovation Highlight
AI-Powered Smart Matching: when a student reports a Lost item, the system compares its title + description with all Found items using Fuse.js and shows ranked "Possible Matches" with a match percentage. The reverse also works for Found items. No more scrolling the full list.

## Run Locally

Requirements: Node.js 18+, a MongoDB Atlas cluster, a Cloudinary account.

Backend:
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```
Fill `.env` with your MongoDB URI, JWT secret, staff code and Cloudinary keys.

Frontend (new terminal):
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173

Faculty/Admin signup needs the `STAFF_CODE` value from `backend/.env`.

## Deploy

Push the project to GitHub:
```bash
git init
git add .
git commit -m "Lost and Found Network"
git branch -M main
git remote add origin https://github.com/<your-username>/lost-found-network.git
git push -u origin main
```

MongoDB Atlas: Network Access -> Add IP Address -> Allow access from anywhere (0.0.0.0/0).

Backend on Render:
1. New -> Web Service -> connect your GitHub repo
2. Root Directory: `backend`
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `STAFF_CODE`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
6. Deploy and copy the URL, e.g. `https://lostfound-api.onrender.com`

Frontend on Vercel:
1. Add New -> Project -> import the same repo
2. Root Directory: `frontend`
3. Framework Preset: Vite
4. Environment variable: `VITE_API_URL` = `https://lostfound-api.onrender.com/api`
5. Deploy and copy the URL, e.g. `https://lostfound.vercel.app`

Final step: in Render, add `CLIENT_URL` = your Vercel URL (no trailing slash) and redeploy the backend.
