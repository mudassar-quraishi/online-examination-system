import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { auth, db } from '../firebase/config';

const SUBJECTS = ['Math', 'Science', 'History', 'English', 'Geography', 'Computer Science', 'Physics', 'Chemistry', 'Biology'];
const CLASSES = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student', subject: 'Math', studentClass: 'Class 1' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const userData = {
        name: form.name,
        email: form.email,
        role: form.role,
        approved: false, // both teachers and students require approval
        createdAt: new Date().toISOString(),
      };
      if (form.role === 'teacher') userData.subject = form.subject;
      if (form.role === 'student') userData.studentClass = form.studentClass;
      await setDoc(doc(db, 'users', cred.user.uid), userData);

      setSuccess(
        form.role === 'teacher'
          ? 'Registration successful! Please wait for admin approval before logging in.'
          : 'Registration successful! Please wait for approval before logging in.'
      );
      await auth.signOut();
    } catch (err) {
      setError(err.message.includes('auth/email-already-in-use')
        ? 'This email is already registered.'
        : err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-10
                      bg-gradient-to-br from-tertiary-container to-primary-container blur-3xl pointer-events-none" />

      <Link to="/" className="flex items-center gap-2 mb-10 relative z-10">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-container to-secondary-container flex items-center justify-center">
          <span className="text-white font-bold font-display">Q</span>
        </div>
        <span className="font-bold font-display text-on-surface">Quizora</span>
      </Link>

      <div className="relative z-10 w-full max-w-sm">
        <div className="glass-card p-8 animate-slide-up">
          <h1 className="text-2xl font-bold font-display text-on-surface mb-1">Create account</h1>
          <p className="text-sm text-on-surface-variant mb-7">Join Quizora as a Student or Teacher.</p>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-error/10 border border-error/20 text-error text-sm">{error}</div>
          )}
          {success && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm">{success}</div>
          )}

          {!success && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Full Name</label>
                <input className="input-field" type="text" placeholder="Jane Doe" value={form.name}
                  onChange={(e) => set('name', e.target.value)} required />
              </div>
              <div>
                <label className="form-label">Email</label>
                <input className="input-field" type="email" placeholder="you@example.com" value={form.email}
                  onChange={(e) => set('email', e.target.value)} required />
              </div>
              <div>
                <label className="form-label">Password</label>
                <input className="input-field" type="password" placeholder="Min 6 characters" value={form.password}
                  onChange={(e) => set('password', e.target.value)} required minLength={6} />
              </div>
              <div>
                <label className="form-label">Role</label>
                <select className="input-field" value={form.role} onChange={(e) => set('role', e.target.value)}>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
              </div>
              {form.role === 'teacher' && (
                <div>
                  <label className="form-label">Subject</label>
                  <select className="input-field" value={form.subject} onChange={(e) => set('subject', e.target.value)}>
                    {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
              )}
              {form.role === 'student' && (
                <div>
                  <label className="form-label">Class</label>
                  <select className="input-field" value={form.studentClass} onChange={(e) => set('studentClass', e.target.value)}>
                    {CLASSES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              )}
              <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2 disabled:opacity-60">
                {loading ? 'Creating account...' : 'Register'}
              </button>
            </form>
          )}

          <p className="text-xs text-center text-on-surface-variant mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
