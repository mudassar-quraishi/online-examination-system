import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';

export default function Results() {
  const { id: examId } = useParams();
  const { user } = useAuth();
  const [result, setResult] = useState(null);
  const [examName, setExamName] = useState('');

  useEffect(() => {
    const load = async () => {
      const [examSnap, aSnap, qSnap, sSnap] = await Promise.all([
        getDoc(doc(db, 'exams', examId)),
        getDocs(query(collection(db, 'answers'), where('userId', '==', user.uid), where('examId', '==', examId))),
        getDocs(query(collection(db, 'questions'), where('examId', '==', examId))),
        getDocs(query(collection(db, 'exam_sessions'), where('userId', '==', user.uid), where('examId', '==', examId))),
      ]);

      if (examSnap.exists()) setExamName(examSnap.data().examName);

      const answers = aSnap.docs.map((d) => d.data());
      const questions = qSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

      const total = questions.length;
      const correct = questions.filter((q) => {
        const ans = answers.find((a) => a.questionId === q.id);
        return ans?.studentAnswer === q.correctOption;
      }).length;
      const incorrect = total - correct;
      const pct = total > 0 ? ((correct / total) * 100).toFixed(1) : 0;

      let timeTaken = '—';
      const session = sSnap.docs[0]?.data();
      if (session?.startTime && session?.endTime) {
        const diff = Math.floor((session.endTime.toMillis() - session.startTime.toMillis()) / 1000);
        timeTaken = `${Math.floor(diff / 60)}m ${diff % 60}s`;
      }

      setResult({ total, correct, incorrect, pct, timeTaken });
    };
    if (user) load();
  }, [user, examId]);

  const grade = (pct) => {
    if (pct >= 90) return { label: 'Excellent', color: 'text-primary' };
    if (pct >= 70) return { label: 'Good', color: 'text-secondary' };
    if (pct >= 50) return { label: 'Pass', color: 'text-tertiary' };
    return { label: 'Fail', color: 'text-error' };
  };

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="pt-20 px-6 max-w-2xl mx-auto pb-12">
        {!result ? (
          <div className="flex items-center justify-center mt-20">
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="animate-slide-up">
            <div className="text-center mb-10">
              <div className="text-5xl mb-4">
                {Number(result.pct) >= 50 ? '🎉' : '📚'}
              </div>
              <h1 className="text-3xl font-extrabold font-display text-on-surface mb-1">Exam Complete</h1>
              <p className="text-on-surface-variant text-sm">{examName}</p>
            </div>

            {/* Score circle */}
            <div className="glass-card p-10 text-center mb-6 border border-primary/20">
              <p className={`text-7xl font-extrabold font-display ${grade(Number(result.pct)).color}`}>
                {result.pct}%
              </p>
              <p className={`text-lg font-bold font-display mt-2 ${grade(Number(result.pct)).color}`}>
                {grade(Number(result.pct)).label}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="glass-card p-5 text-center border border-primary/20">
                <p className="text-2xl font-bold font-display text-primary">{result.correct}</p>
                <p className="text-xs text-on-surface-variant mt-1">Correct</p>
              </div>
              <div className="glass-card p-5 text-center border border-error/20">
                <p className="text-2xl font-bold font-display text-error">{result.incorrect}</p>
                <p className="text-xs text-on-surface-variant mt-1">Incorrect</p>
              </div>
              <div className="glass-card p-5 text-center border border-tertiary/20">
                <p className="text-2xl font-bold font-display text-tertiary">{result.timeTaken}</p>
                <p className="text-xs text-on-surface-variant mt-1">Time Taken</p>
              </div>
            </div>

            <div className="text-center">
              <Link to="/student" className="btn-primary px-8 py-3">← Back to Exams</Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
