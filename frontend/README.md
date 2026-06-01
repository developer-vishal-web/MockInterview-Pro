# MockInterview Pro

A full-stack MERN **mock interview practice platform** for technical interviews with performance analytics.

Users can sign up, attempt mock interviews for different roles and difficulty levels, and see detailed stats like total attempts, average score, best score, weak topics, and a performance trend chart.

---

## 🔗 Live Demo & Repo Links

- 🌐 Live App: [https://mockinterview-pro.vercel.app](https://mockinterview-pro.vercel.app) <!-- apna URL daalo -->
- 📡 Backend API: [https://mockinterview-pro-api.onrender.com](https://mockinterview-pro-api.onrender.com) <!-- optional -->
- 💻 GitHub: [https://github.com/your-username/mockinterview-pro](https://github.com/your-username/mockinterview-pro) <!-- apna repo -->

---

## 🖼 Screenshots

> Paths/URLs ko apne project ke hisaab se change kar lo (e.g. `/screenshots/...png` ya GitHub raw URL).

**Login & Signup**

![Login Page](./screenshots/login.png)  
![Signup Page](./screenshots/signup.png)

**Dashboard (Analytics)**

![Dashboard](./screenshots/dashboard.png)

**Interview Page**

![Interview](./screenshots/interview.png)

**Result Page**

![Result](./screenshots/result.png)

---

## 🔧 Tech Stack

- **Frontend**: React, Vite, React Router, Tailwind CSS, Recharts, React Hot Toast  
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT Authentication  
- **Other**: Axios, Environment variables (.env), REST API (JSON-based)

---

## ✨ Features

- User **authentication** (signup & login) with JWT
- **Protected routes** for dashboard, interview, and result pages
- Start interview with selected **role** and **difficulty**
- Type answers for each question and submit the attempt
- **Dashboard analytics**:
  - Total attempts
  - Average score
  - Best score
  - Weakest topic (calculated from attempts)
  - Score trend chart using Recharts
  - Recent attempts table with dates and scores
- **Result page**:
  - Final score and performance label (Excellent / Good / Needs Work)
  - Weak topics list
  - Improvement suggestions
- Clean, dark UI with fully responsive layout (mobile, tablet, desktop)

---

## 📂 Project Structure (High Level)

```txt
frontend/
  src/
    App.jsx
    main.jsx
    services/api.js
    pages/
      Login.jsx
      Signup.jsx
      Dashboard.jsx
      Interview.jsx
      Result.jsx
    components/
      ProtectedRoute.jsx

backend/
  server.js
  config/
    db.js
  routes/
    authRoutes.js
    questionRoutes.js
    attemptRoutes.js
  models/
    User.js
    Question.js
    Attempt.js
  middleware/
    authMiddleware.js
```

*(Folder names can be adjusted to your exact structure.)*

---

## 🚀 Getting Started (Local Development)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd <your-repo-folder>
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<Password>@cluster0.6km62q2.mongodb.net/mock-interview-app?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
```

Run the backend:

```bash
npm run dev
# or
node server.js
```

Expected output:

```txt
Server is listening on port 5000
MongoDB connected
```

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend`:

```env
VITE_API_URL=http://localhost:5000/api
```

Run the frontend:

```bash
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

---

## 🧠 How It Works (Flow)

1. **Signup & Login**  
   - User signs up using name, email, and password.  
   - On login, backend returns a JWT token.  
   - Token is stored in `localStorage` and attached to all API requests via Axios interceptor.

2. **Protected Routes**  
   - `ProtectedRoute` checks `localStorage.getItem("token")`.  
   - If no token, user is redirected to `/login`.  
   - Protected pages: `/dashboard`, `/interview`, `/result/:attemptId`.

3. **Dashboard**  
   - Fetches attempts from `GET /api/attempts/my`.  
   - Calculates stats: total attempts, average score, best score, weakest topic.  
   - Renders a line chart of scores and a table of recent attempts.

4. **Interview**  
   - Started from dashboard with selected `role` and `difficulty`.  
   - Fetches questions from `GET /api/questions?role=...&difficulty=...`.  
   - User writes answers in textareas.  
   - On submit, sends payload to `POST /api/attempts`, then redirects to result page.

5. **Result**  
   - Fetches a single attempt by ID: `GET /api/attempts/:attemptId`.  
   - Shows final score, total questions, performance category, and weak topics.  
   - Displays suggestions to help the user improve in weak areas.

---

## 📊 Data Model (High Level)

### User

```js
{
  name: String,
  email: String,
  password: String, // hashed
  createdAt: Date
}
```

### Question

```js
{
  role: String,          // e.g. "React", "JavaScript"
  difficulty: String,    // "easy" | "medium" | "hard"
  topic: String,         // e.g. "Hooks", "Promises"
  question: String,
  correctAnswer: String,
  keywords: [String]     // used for answer evaluation
}
```

### Attempt

```js
{
  user: ObjectId,        // ref: User
  role: String,
  difficulty: String,
  answers: [
    {
      questionId: ObjectId, // ref: Question
      userAnswer: String,
      score: Number,
      topic: String
    }
  ],
  totalScore: Number,
  createdAt: Date
}
```

---

## 🌐 Deployment Notes (Optional)

- **Frontend**: Vercel (build command: `npm run build`, output dir: `dist`)  
- **Backend**: Render / Railway / Cyclic (start command: `node server.js`)  
- **Database**: MongoDB Atlas (replace local `MONGO_URI` with Atlas connection string) [web:296]

Make sure to update:

- `VITE_API_URL` in frontend `.env` to your deployed backend URL (e.g. `https://mockinterview-pro-api.onrender.com/api`).  
- CORS settings in backend to allow your frontend domain.

---

## ✅ Future Improvements

- Add user profile page with avatar and more stats
- Add more roles & question categories (DSA, System Design, CS fundamentals)
- Add timer per question or total interview duration
- Add admin panel to manage questions and view global stats
- Integrate AI/LLM to auto‑evaluate answers instead of simple keyword checks [web:295]
- Add export/share feature for results (PDF or shareable link)

---

## ✍️ Author

- **Your Name** – [@your-github](https://github.com/your-username)  
- Open to feedback, issues, and pull requests.

---

## 📜 License

This project is for learning and portfolio purposes.  
You can modify and adapt it as needed.