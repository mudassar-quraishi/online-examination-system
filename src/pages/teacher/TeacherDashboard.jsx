import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import StatsCard from '../../components/StatsCard';
import { Link } from 'react-router-dom';

export default function TeacherDashboard() {
  const { userData, user } = useAuth();
  const [counts, setCounts] = useState({ exams: 0, questions: 0 });

  useEffect(() => {
    const load = async () => {
      const examsSnap = await getDocs(query(collection(db, 'exams'), where('teacherId', '==', user.uid)));
      const exams = examsSnap.docs;
      let questions = 0;
      for (const e of exams) {
        const qSnap = await getDocs(query(collection(db, 'questions'), where('examId', '==', e.id)));
        questions += qSnap.size;
      }
      setCounts({ exams: exams.length, questions });
    };
    if (user) load();
  }, [user]);

  const quickLinks = [
    { to: '/teacher/exams', label: 'Manage Exams', icon: '📋', desc: 'Create, edit and delete exams' },
    { to: '/teacher/reports', label: 'View Reports', icon: '📊', desc: 'Student performance analytics' },
    { to: '/teacher/snapshots', label: 'View Snapshots', icon: '📷', desc: 'Review webcam proctoring images' },
  ];

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="pt-20 px-6 max-w-5xl mx-auto pb-12">
        <div className="mb-8 animate-fade-in">
          <h1 className="section-title">Teacher Dashboard</h1>
          <p className="section-subtitle">Welcome back, {userData?.name}. {userData?.subject && `Subject: ${userData.subject}`}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
          <StatsCard icon="📋" label="Your Exams" value={counts.exams} accent="primary" />
          <StatsCard icon="❓" label="Total Questions" value={counts.questions} accent="secondary" />
        </div>
        <h2 className="text-lg font-bold font-display text-on-surface mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-3 gap-5">
          {quickLinks.map((link) => (
            <Link key={link.to} to={link.to}
              className="glass-card p-6 hover:border-primary/30 transition-all duration-300 group flex flex-col gap-3">
              <span className="text-3xl">{link.icon}</span>
              <div>
                <p className="font-bold font-display text-on-surface group-hover:text-primary transition-colors text-sm">{link.label}</p>
                <p className="text-xs text-on-surface-variant mt-1">{link.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
