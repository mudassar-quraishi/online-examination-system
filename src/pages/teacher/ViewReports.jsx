import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';

export default function ViewReports() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const stuSnap = await getDocs(query(collection(db, 'users'), where('role', '==', 'student')));
      setStudents(stuSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      const exSnap = await getDocs(query(collection(db, 'exams'), where('teacherId', '==', user.uid)));
      setExams(exSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    if (user) load();
  }, [user]);

  const viewReport = async () => {
    if (!selectedStudent || !selectedExam) return;
    setLoading(true);
    // Fetch answers
    const aSnap = await getDocs(query(collection(db, 'answers'),
      where('userId', '==', selectedStudent),
      where('examId', '==', selectedExam)
    ));
    const answers = aSnap.docs.map((d) => d.data());
    // Fetch questions
    const qSnap = await getDocs(query(collection(db, 'questions'), where('examId', '==', selectedExam)));
    const questions = qSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    // Fetch session
    const sSnap = await getDocs(query(collection(db, 'exam_sessions'),
      where('userId', '==', selectedStudent),
      where('examId', '==', selectedExam)
    ));
    const session = sSnap.docs[0]?.data() || null;

    const rows = questions.map((q) => {
      const ans = answers.find((a) => a.questionId === q.id);
      return { question: q.questionText, given: ans?.studentAnswer || '—', correct: q.correctOption };
    });
    const correct = rows.filter((r) => r.given === r.correct).length;
    const pct = rows.length > 0 ? ((correct / rows.length) * 100).toFixed(1) : 0;

    let timeTaken = '—';
    if (session?.startTime && session?.endTime) {
      const diff = Math.floor((session.endTime.toMillis() - session.startTime.toMillis()) / 1000);
      const m = Math.floor(diff / 60);
      const s = diff % 60;
      timeTaken = `${m}m ${s}s`;
    }

    setReport({ rows, correct, total: rows.length, pct, timeTaken });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="pt-20 px-6 max-w-5xl mx-auto pb-12">
        <div className="mb-8 animate-fade-in">
          <h1 className="section-title">View Reports</h1>
          <p className="section-subtitle">Review student performance for each exam.</p>
        </div>

        <div className="glass-card p-6 mb-8 animate-fade-in">
          <div className="grid sm:grid-cols-3 gap-4 items-end">
            <div>
              <label className="form-label">Student</label>
              <select className="input-field" value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
                <option value="">-- Select Student --</option>
                {students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Exam</label>
              <select className="input-field" value={selectedExam} onChange={(e) => setSelectedExam(e.target.value)}>
                <option value="">-- Select Exam --</option>
                {exams.map((ex) => <option key={ex.id} value={ex.id}>{ex.examName}</option>)}
              </select>
            </div>
            <button onClick={viewReport} disabled={loading || !selectedStudent || !selectedExam}
              className="btn-primary py-2.5 disabled:opacity-50">
              {loading ? 'Loading...' : 'View Report'}
            </button>
          </div>
        </div>

        {report && (
          <div className="animate-slide-up">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="glass-card p-4 text-center border border-primary/20">
                <p className="text-2xl font-bold font-display text-primary">{report.pct}%</p>
                <p className="text-xs text-on-surface-variant mt-1">Score</p>
              </div>
              <div className="glass-card p-4 text-center border border-secondary/20">
                <p className="text-2xl font-bold font-display text-secondary">{report.correct}/{report.total}</p>
                <p className="text-xs text-on-surface-variant mt-1">Correct</p>
              </div>
              <div className="glass-card p-4 text-center border border-tertiary/20">
                <p className="text-2xl font-bold font-display text-tertiary">{report.timeTaken}</p>
                <p className="text-xs text-on-surface-variant mt-1">Time Taken</p>
              </div>
            </div>
            <div className="glass-card overflow-hidden">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Question</th>
                    <th>Given Answer</th>
                    <th>Correct Answer</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {report.rows.map((r, i) => (
                    <tr key={i}>
                      <td className="text-on-surface text-sm">{r.question}</td>
                      <td className="font-medium text-on-surface">{r.given}</td>
                      <td className="font-medium text-primary">{r.correct}</td>
                      <td>
                        {r.given === r.correct
                          ? <span className="badge-success">✓ Correct</span>
                          : <span className="badge-error">✗ Wrong</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
