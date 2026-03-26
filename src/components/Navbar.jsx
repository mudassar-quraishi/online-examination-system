import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

const navLinks = {
  admin: [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/teachers', label: 'Teachers' },
    { to: '/admin/students', label: 'Students' },
  ],
  teacher: [
    { to: '/teacher', label: 'Dashboard' },
    { to: '/teacher/exams', label: 'Exams' },
    { to: '/teacher/students', label: 'Students' },
    { to: '/teacher/reports', label: 'Reports' },
    { to: '/teacher/snapshots', label: 'Snapshots' },
  ],
  student: [
    { to: '/student', label: 'My Exams' },
  ],
};

export default function Navbar() {
  const { role, userData } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const links = navLinks[role] || [];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14
                    flex items-center justify-between px-6
                    bg-surface-lowest/80 backdrop-blur-xl
                    border-b border-outline-variant/15">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-container to-secondary-container flex items-center justify-center">
          <span className="text-white text-xs font-bold font-display">Q</span>
        </div>
        <span className="font-bold font-display text-on-surface tracking-wide text-sm">Quizora</span>
      </Link>

      {/* Nav Links */}
      <div className="flex items-center gap-1">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="px-3 py-1.5 rounded-lg text-sm text-on-surface-variant
                       hover:text-on-surface hover:bg-surface-highest
                       transition-all duration-200 font-medium"
          >
            {l.label}
          </Link>
        ))}
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {userData && (
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-on-surface leading-none">{userData.name}</p>
            <p className="text-xs text-on-surface-variant capitalize mt-0.5">{role}</p>
          </div>
        )}
        <button onClick={handleLogout} className="btn-ghost py-1.5 px-4 text-xs">
          Logout
        </button>
      </div>
    </nav>
  );
}
