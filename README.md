# 🎓 Online Examination System

A comprehensive, secure, and user-friendly Online Examination System built with **React**, **Tailwind CSS**, and **Firebase**. The platform is designed to facilitate seamless online assessments with advanced features like role-based access control, timed exams, and robust webcam proctoring to ensure exam integrity.

---

## ✨ Key Features

### 🔐 Role-Based Access Control (RBAC)
The application provides distinct interfaces and permissions for three types of users:
- **Admin:** Complete control over the platform. Can manage, add, and remove both teachers and students.
- **Teacher:** Can create, modify, and manage exams. View detailed performance reports and analyze student snapshots captured during exams.
- **Student:** Can view available exams, attempt them within a set time limit, and instantly view their results and scorecards.

### 🛡️ Smart Anti-Cheat & Webcam Proctoring
- Integrates webcam capture (`WebcamProctor`) during the exam to periodically take snapshots of the student.
- Teachers can review these snapshots via the **View Snapshots** dashboard to ensure fairness and prevent cheating.

### ⏱️ Real-Time Exam Environment
- Automatic exam timer that tracks remaining time and auto-submits the exam when the time expires.
- Instant grading and result generation immediately after submission.

### 📊 Comprehensive Dashboards
- **Admin Dashboard:** Overview of total users, active exams, and quick management links.
- **Teacher Dashboard:** Quick insights into creation of new exams, modification of existing ones, and student reports.
- **Student Dashboard:** Clean interface to start new exams and review past performance.

---

## 🛠️ Tech Stack

- **Frontend:** React (Vite), React Router DOM, Tailwind CSS (for modern, responsive styling)
- **Backend/Database:** Firebase Authentication, Cloud Firestore (NoSQL Database)
- **Storage:** Firebase Storage (for storing webcam snapshots)
- **Tooling:** ESLint, PostCSS, Autoprefixer

---

## 📂 Project Structure

```text
online-examination-system/
├── public/                 # Static assets
├── src/                    
│   ├── components/         # Reusable UI components (Navbar, Timer, WebcamProctor, StatsCard, ProtectedRoute)
│   ├── firebase/           # Firebase configuration and initialization
│   ├── pages/              
│   │   ├── admin/          # Admin functionality (Dashboard, Manage Users)
│   │   ├── student/        # Student functionality (Exam Interface, Results)
│   │   └── teacher/        # Teacher functionality (Manage Exams, View Reports/Snapshots)
│   ├── App.jsx             # Main Application routing and layout
│   └── main.jsx            # Entry point
├── package.json            # Project dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
└── vite.config.js          # Vite build configuration
```

---

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- A [Firebase](https://firebase.google.com/) account and project.

### 1. Clone the Repository
```bash
git clone https://github.com/mudassar-quraishi/online-examination-system.git
cd online-examination-system
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Firebase
1. Create a new project on the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Firestore**, **Authentication** (Email/Password), and **Storage**.
3. Create a `.env` file in the root directory based on the `.env.example` file:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Start the Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

---

## 💡 Usage Guide

### First-Time Setup (Admin)
Since the app relies on Firebase, you will need to manually set your first user as an `admin` directly within your Firestore Database in the `users` collection to gain access to the Admin Dashboard.

### Creating an Exam
1. Log in as a **Teacher**.
2. Navigate to "Manage Exams" and create a new exam with questions, options, and a correct answer.
3. Set the time limit for the exam.

### Taking an Exam
1. Log in as a **Student**.
2. Grant camera permissions (required for proctoring).
3. Start the exam. Ensure you submit before the timer runs out!

---

## 📝 License
This project is open-source and available under the terms of the MIT License.
