import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';

export default function StudentDashboard() {
  const { user, userData } = useAuth();
  const [exams, setExams] = useState([]);
  const [taken, setTaken] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, 'exams'));
      setExams(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      // Exams already taken
      const sessSnap = await getDocs(query(
        collection(db, 'exam_sessions'),
        where('userId', '==', user.uid)
      ));
      setTaken(new Set(sessSnap.docs.map((d) => d.data().examId)));
    };
    if (user) load();
  }, [user]);

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="pt-20 px-6 max-w-5xl mx-auto pb-12">
        <div className="mb-8 animate-fade-in">
          <h1 className="section-title">My Exams</h1>
          <p className="section-subtitle">Welcome, {userData?.name}. Select an exam to begin.</p>
        </div>

        {exams.length === 0 ? (
          <div className="text-center py-20 text-on-surface-variant text-sm">
            No exams available yet. Check back later.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {exams.map((ex) => {
              const isTaken = taken.has(ex.id);
              return (
                <div key={ex.id}
                  className={`glass-card p-6 flex flex-col gap-4 transition-all duration-300
                              ${!isTaken ? 'hover:border-primary/30 hover:bg-surface-high/40' : 'opacity-60'}`}>
                  <div className="flex items-start justify-between">
                    <span className="text-3xl">📋</span>
                    {isTaken
                      ? <span className="badge-success text-[10px]">Completed</span>
                      : <span className="badge-warning text-[10px]">Available</span>}
                  </div>
                  <div>
                    <h3 className="font-bold font-display text-on-surface">{ex.examName}</h3>
                    <p className="text-xs text-on-surface-variant mt-1">⏱ {ex.durationMinutes} minutes</p>
                  </div>
                  <button
                    disabled={isTaken}
                    onClick={() => navigate(`/student/exam/${ex.id}`)}
                    className="btn-primary text-sm py-2.5 disabled:opacity-40 disabled:cursor-not-allowed mt-auto">
                    {isTaken ? 'Already Taken' : 'Start Exam →'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
