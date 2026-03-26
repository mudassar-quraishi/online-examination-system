import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import StatsCard from '../../components/StatsCard';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { userData } = useAuth();
  const [counts, setCounts] = useState({ teachers: 0, students: 0, pending: 0 });

  useEffect(() => {
    const load = async () => {
      const usersSnap = await getDocs(collection(db, 'users'));
      const users = usersSnap.docs.map((d) => d.data());
      const teachers = users.filter((u) => u.role === 'teacher').length;
      const students = users.filter((u) => u.role === 'student').length;
      const pending = users.filter((u) => u.role === 'teacher' && !u.approved).length;
      setCounts({ teachers, students, pending });
    };
    load();
  }, []);

  const quickLinks = [
    { to: '/admin/teachers', label: 'Manage Teachers', icon: '👨‍🏫', desc: 'Approve, view and remove teachers' },
    { to: '/admin/students', label: 'Manage Students', icon: '🎓', desc: 'View and remove students' },
  ];

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="pt-20 px-6 max-w-5xl mx-auto pb-12">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="section-title">Admin Dashboard</h1>
          <p className="section-subtitle">Welcome back, {userData?.name}. Here's your system overview.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          <StatsCard icon="👨‍🏫" label="Total Teachers" value={counts.teachers} accent="primary" />
          <StatsCard icon="🎓" label="Total Students" value={counts.students} accent="secondary" />
          <StatsCard icon="⏳" label="Pending Approvals" value={counts.pending} accent="tertiary" />
        </div>

        {/* Quick links */}
        <h2 className="text-lg font-bold font-display text-on-surface mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {quickLinks.map((link) => (
            <Link key={link.to} to={link.to}
              className="glass-card p-6 hover:border-primary/30 hover:bg-surface-high/50
                         transition-all duration-300 group flex items-start gap-4">
              <span className="text-3xl">{link.icon}</span>
              <div>
                <p className="font-bold font-display text-on-surface group-hover:text-primary transition-colors">{link.label}</p>
                <p className="text-sm text-on-surface-variant mt-1">{link.desc}</p>
              </div>
              <span className="ml-auto text-on-surface-variant group-hover:text-primary text-lg transition-colors">→</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
