import { useEffect, useState } from 'react';
import {
  collection, addDoc, deleteDoc, doc, getDocs,
  query, where, serverTimestamp
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import { Link } from 'react-router-dom';

export default function ManageExams() {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [form, setForm] = useState({ examName: '', durationMinutes: '' });
  const [qForm, setQForm] = useState({ examId: '', questionText: '', optionA: '', optionB: '', optionC: '', optionD: '', correctOption: 'A' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchExams = async () => {
    const snap = await getDocs(query(collection(db, 'exams'), where('teacherId', '==', user.uid)));
    setExams(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => { if (user) fetchExams(); }, [user]);

  const addExam = async (e) => {
    e.preventDefault();
    setLoading(true);
    await addDoc(collection(db, 'exams'), {
      examName: form.examName,
      durationMinutes: Number(form.durationMinutes),
      teacherId: user.uid,
      createdAt: serverTimestamp(),
    });
    setForm({ examName: '', durationMinutes: '' });
    setMsg('Exam added!');
    await fetchExams();
    setLoading(false);
  };

  const addQuestion = async (e) => {
    e.preventDefault();
    if (!qForm.examId) return;
    setLoading(true);
    await addDoc(collection(db, 'questions'), { ...qForm });
    setQForm({ examId: qForm.examId, questionText: '', optionA: '', optionB: '', optionC: '', optionD: '', correctOption: 'A' });
    setMsg('Question added!');
    setLoading(false);
  };

  const deleteExam = async (id) => {
    if (!window.confirm('Delete this exam and all its questions?')) return;
    // Delete questions first
    const qSnap = await getDocs(query(collection(db, 'questions'), where('examId', '==', id)));
    await Promise.all(qSnap.docs.map((d) => deleteDoc(doc(db, 'questions', d.id))));
    await deleteDoc(doc(db, 'exams', id));
    await fetchExams();
  };

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="pt-20 px-6 max-w-5xl mx-auto pb-12">
        <div className="mb-8 animate-fade-in">
          <h1 className="section-title">Manage Exams</h1>
          <p className="section-subtitle">Create exams, add questions, and manage your exam library.</p>
        </div>

        {msg && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm animate-fade-in">
            {msg}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6 mb-10">
          {/* Add Exam */}
          <div className="glass-card p-6">
            <h2 className="text-base font-bold font-display text-on-surface mb-5">Create New Exam</h2>
            <form onSubmit={addExam} className="space-y-4">
              <div>
                <label className="form-label">Exam Name</label>
                <input className="input-field" placeholder="e.g. Biology Mid-Term" value={form.examName}
                  onChange={(e) => setForm((p) => ({ ...p, examName: e.target.value }))} required />
              </div>
              <div>
                <label className="form-label">Duration (minutes)</label>
                <input className="input-field" type="number" placeholder="30" value={form.durationMinutes}
                  onChange={(e) => setForm((p) => ({ ...p, durationMinutes: e.target.value }))} required min="1" />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 disabled:opacity-60">
                + Add Exam
              </button>
            </form>
          </div>

          {/* Add Question */}
          <div className="glass-card p-6">
            <h2 className="text-base font-bold font-display text-on-surface mb-5">Add Question</h2>
            <form onSubmit={addQuestion} className="space-y-3">
              <div>
                <label className="form-label">Select Exam</label>
                <select className="input-field" value={qForm.examId}
                  onChange={(e) => setQForm((p) => ({ ...p, examId: e.target.value }))} required>
                  <option value="">-- Select --</option>
                  {exams.map((ex) => <option key={ex.id} value={ex.id}>{ex.examName}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Question</label>
                <textarea className="input-field h-20 resize-none" placeholder="Enter question text..." value={qForm.questionText}
                  onChange={(e) => setQForm((p) => ({ ...p, questionText: e.target.value }))} required />
              </div>
              {['A', 'B', 'C', 'D'].map((opt) => (
                <div key={opt}>
                  <label className="form-label">Option {opt}</label>
                  <input className="input-field" placeholder={`Option ${opt}`} value={qForm[`option${opt}`]}
                    onChange={(e) => setQForm((p) => ({ ...p, [`option${opt}`]: e.target.value }))} required />
                </div>
              ))}
              <div>
                <label className="form-label">Correct Option</label>
                <select className="input-field" value={qForm.correctOption}
                  onChange={(e) => setQForm((p) => ({ ...p, correctOption: e.target.value }))}>
                  {['A', 'B', 'C', 'D'].map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 disabled:opacity-60">
                + Add Question
              </button>
            </form>
          </div>
        </div>

        {/* Exam Table */}
        <h2 className="text-lg font-bold font-display text-on-surface mb-4">Your Exams</h2>
        <div className="glass-card overflow-hidden">
          {exams.length === 0 ? (
            <div className="text-center py-14 text-on-surface-variant text-sm">No exams yet. Create one above.</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Exam Name</th>
                  <th>Duration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((ex) => (
                  <tr key={ex.id}>
                    <td className="font-medium text-on-surface">{ex.examName}</td>
                    <td className="text-on-surface-variant">{ex.durationMinutes} min</td>
                    <td>
                      <div className="flex gap-2">
                        <Link to={`/teacher/exams/${ex.id}/edit`} className="btn-success text-xs px-3 py-1.5">Edit</Link>
                        <button onClick={() => deleteExam(ex.id)} className="btn-danger text-xs px-3 py-1.5">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
