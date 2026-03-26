import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/config';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const snap = await getDoc(doc(db, 'users', cred.user.uid));
      if (!snap.exists()) throw new Error('User data not found.');
      const data = snap.data();

      if ((data.role === 'teacher' || data.role === 'student') && !data.approved) {
        await auth.signOut();
        setError(`Your ${data.role} account is pending approval. Please wait for an admin or teacher to approve you.`);
        setLoading(false);
        return;
      }

      if (data.role === 'admin') navigate('/admin');
      else if (data.role === 'teacher') navigate('/teacher');
      else navigate('/student');
    } catch (err) {
      setError(err.message.includes('auth/')
        ? 'Invalid email or password.'
        : err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-10
                      bg-gradient-to-br from-primary-container to-secondary-container blur-3xl pointer-events-none" />

      <Link to="/" className="flex items-center gap-2 mb-10 relative z-10">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-container to-secondary-container flex items-center justify-center">
          <span className="text-white font-bold font-display">Q</span>
        </div>
        <span className="font-bold font-display text-on-surface">Quizora</span>
      </Link>

      <div className="relative z-10 w-full max-w-sm">
        <div className="glass-card p-8 animate-slide-up">
          <h1 className="text-2xl font-bold font-display text-on-surface mb-1">Welcome back</h1>
          <p className="text-sm text-on-surface-variant mb-7">Sign in to your account to continue.</p>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-error/10 border border-error/20 text-error text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Email</label>
              <input
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Password</label>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2 py-3 disabled:opacity-60">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-xs text-center text-on-surface-variant mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:underline font-medium">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
