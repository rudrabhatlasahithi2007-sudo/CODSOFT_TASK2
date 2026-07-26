# TaskPulse - Full Stack Project Management Tool (MERN)

TaskPulse is a full-stack MERN (MongoDB, Express, React, Node.js) project management application built with JavaScript. It allows teams to create projects, assign tasks, set deadlines, track progress with Kanban boards, upload file attachments, manage roles, and monitor velocity analytics.

## 🚀 Features

- **User Authentication & Roles**: Secure JWT authentication with password hashing using `bcryptjs`. Switch roles seamlessly between Project Manager, Lead Developer, UI/UX Designer, QA, and Product Lead.
- **Project Tracking**: Create and manage projects with custom categories, budgets, priority levels, deadlines, and completion progress bars.
- **Task Management & Kanban Board**: Create tasks, set estimated vs. logged hours, assign team members, and move tasks across Kanban columns (`Backlog`, `To Do`, `In Progress`, `Review`, `Completed`).
- **Checklists & Comments**: Subtask checklists with progress indicators, interactive comment discussions on tasks.
- **File Uploads**: Attachment uploading powered by `Multer` with size validation and preview links.
- **Analytics Dashboard**: Project completion rates, task priority distribution, and status breakdown metrics.
- **Dual DB Architecture**: Supports real MongoDB with Mongoose when `MONGODB_URI` is provided, and automatically falls back to a memory-backed database engine for fast local sandbox preview execution.

---

## 📁 Project Structure

```
project/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .env.example
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   ├── taskController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── uploadMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── taskRoutes.js
│   │   └── userRoutes.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── projectService.js
│   │   ├── taskService.js
│   │   └── userService.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── seedData.js
│   ├── uploads/
│   ├── package.json
│   ├── server.js
│   ├── app.js
│   └── .env.example
│
└── README.md
```

---

## 🛠️ Installation & Run Instructions

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB Atlas account or local MongoDB instance (Optional: app falls back to memory store if no connection string is present)

---

### Running Full App Directly (Single Command)

In the root directory:

```bash
# Install root dependencies
npm install

# Run full-stack dev server (Express backend + Vite React frontend on port 3000)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### Running Separately (Frontend + Backend)

#### 1. Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend will run at `http://localhost:3000`.

#### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run at `http://localhost:5173`.

---

## 🔑 Environment Variables

### Backend (`backend/.env.example`)
```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/taskpulse?retryWrites=true&w=majority
JWT_SECRET=taskpulse_secret_key_2026_jwt_token
NODE_ENV=development
```

### Frontend (`frontend/.env.example`)
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

---

## 🧪 Default Test Accounts

You can sign in with any of these pre-seeded accounts or click **Switch Role** in the top navigation bar:

| Name | Role | Email | Password |
|---|---|---|---|
| **Alex Morgan** | Project Manager | `alex.morgan@company.com` | `password123` |
| **Sarah Chen** | Lead Developer | `sarah.chen@company.com` | `password123` |
| **David Miller** | UI/UX Designer | `david.miller@company.com` | `password123` |
| **Emma Watson** | QA Engineer | `emma.watson@company.com` | `password123` |
| **Michael Scott** | Product Lead | `michael.scott@company.com` | `password123` |

---

## 📄 License
Apache-2.0
