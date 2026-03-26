import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';

export default function ViewSnapshots() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [snapshots, setSnapshots] = useState([]);
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

  const loadSnapshots = async () => {
    if (!selectedStudent || !selectedExam) return;
    setLoading(true);
    const snap = await getDocs(query(
      collection(db, 'snapshots'),
      where('userId', '==', selectedStudent),
      where('examId', '==', selectedExam),
      orderBy('timestamp')
    ));
    setSnapshots(snap.docs.map((d) => d.data()));
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="pt-20 px-6 max-w-5xl mx-auto pb-12">
        <div className="mb-8 animate-fade-in">
          <h1 className="section-title">View Snapshots</h1>
          <p className="section-subtitle">Review webcam proctoring photos taken during exams.</p>
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
            <button onClick={loadSnapshots} disabled={loading || !selectedStudent || !selectedExam}
              className="btn-primary py-2.5 disabled:opacity-50">
              {loading ? 'Loading...' : 'Load Snapshots'}
            </button>
          </div>
        </div>

        {snapshots.length === 0 && !loading ? (
          <div className="text-center py-14 text-on-surface-variant text-sm">
            Select a student and exam to view snapshots.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 animate-slide-up">
            {snapshots.map((s, i) => (
              <div key={i} className="glass-card overflow-hidden group">
                <img src={s.imageUrl} alt={`Snapshot ${i + 1}`}
                  className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="p-2">
                  <p className="text-xs text-on-surface-variant">
                    {s.timestamp?.toDate
                      ? s.timestamp.toDate().toLocaleTimeString()
                      : `Snapshot ${i + 1}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
