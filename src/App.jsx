import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageTeachers from './pages/admin/ManageTeachers';
import ManageStudents from './pages/admin/ManageStudents';

// Teacher
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import ManageExams from './pages/teacher/ManageExams';
import ModifyExam from './pages/teacher/ModifyExam';
import ViewReports from './pages/teacher/ViewReports';
import ViewSnapshots from './pages/teacher/ViewSnapshots';
import TeacherManageStudents from './pages/teacher/ManageStudents';

// Student
import StudentDashboard from './pages/student/StudentDashboard';
import ExamQuestions from './pages/student/ExamQuestions';
import Results from './pages/student/Results';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/teachers" element={
            <ProtectedRoute allowedRoles={['admin']}><ManageTeachers /></ProtectedRoute>
          } />
          <Route path="/admin/students" element={
            <ProtectedRoute allowedRoles={['admin']}><ManageStudents /></ProtectedRoute>
          } />

          {/* Teacher */}
          <Route path="/teacher" element={
            <ProtectedRoute allowedRoles={['teacher']}><TeacherDashboard /></ProtectedRoute>
          } />
          <Route path="/teacher/exams" element={
            <ProtectedRoute allowedRoles={['teacher']}><ManageExams /></ProtectedRoute>
          } />
          <Route path="/teacher/exams/:id/edit" element={
            <ProtectedRoute allowedRoles={['teacher']}><ModifyExam /></ProtectedRoute>
          } />
          <Route path="/teacher/students" element={
            <ProtectedRoute allowedRoles={['teacher']}><TeacherManageStudents /></ProtectedRoute>
          } />
          <Route path="/teacher/reports" element={
            <ProtectedRoute allowedRoles={['teacher']}><ViewReports /></ProtectedRoute>
          } />
          <Route path="/teacher/snapshots" element={
            <ProtectedRoute allowedRoles={['teacher']}><ViewSnapshots /></ProtectedRoute>
          } />

          {/* Student */}
          <Route path="/student" element={
            <ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>
          } />
          <Route path="/student/exam/:id" element={
            <ProtectedRoute allowedRoles={['student']}><ExamQuestions /></ProtectedRoute>
          } />
          <Route path="/student/results/:id" element={
            <ProtectedRoute allowedRoles={['student']}><Results /></ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
