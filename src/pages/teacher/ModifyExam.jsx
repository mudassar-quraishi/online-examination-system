import { useEffect, useState } from 'react';
import { doc, getDoc, getDocs, query, collection, where, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';

export default function ModifyExam() {
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [examForm, setExamForm] = useState({ examName: '', durationMinutes: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const load = async () => {
      const snap = await getDoc(doc(db, 'exams', id));
      if (snap.exists()) {
        const data = snap.data();
        setExam(data);
        setExamForm({ examName: data.examName, durationMinutes: data.durationMinutes });
      }
      const qSnap = await getDocs(query(collection(db, 'questions'), where('examId', '==', id)));
      setQuestions(qSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    load();
  }, [id]);

  const saveExam = async (e) => {
    e.preventDefault();
    await updateDoc(doc(db, 'exams', id), {
      examName: examForm.examName,
      durationMinutes: Number(examForm.durationMinutes),
    });
    setMsg('Exam updated!');
  };

  const saveQuestion = async (qid, data) => {
    await updateDoc(doc(db, 'questions', qid), data);
    setMsg('Question updated!');
  };

  const updateQ = (qid, field, value) => {
    setQuestions((prev) => prev.map((q) => q.id === qid ? { ...q, [field]: value } : q));
  };

  if (!exam) return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="pt-20 px-6 max-w-3xl mx-auto pb-12">
        <div className="flex items-center gap-3 mb-8 animate-fade-in">
          <Link to="/teacher/exams" className="btn-ghost text-xs px-3 py-1.5">← Back</Link>
          <div>
            <h1 className="section-title mb-0">Modify Exam</h1>
          </div>
        </div>

        {msg && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm animate-fade-in">
            {msg}
          </div>
        )}

        {/* Exam details */}
        <div className="glass-card p-6 mb-6">
          <h2 className="text-base font-bold font-display text-on-surface mb-4">Exam Details</h2>
          <form onSubmit={saveExam} className="space-y-4">
            <div>
              <label className="form-label">Exam Name</label>
              <input className="input-field" value={examForm.examName}
                onChange={(e) => setExamForm((p) => ({ ...p, examName: e.target.value }))} required />
            </div>
            <div>
              <label className="form-label">Duration (minutes)</label>
              <input className="input-field" type="number" value={examForm.durationMinutes}
                onChange={(e) => setExamForm((p) => ({ ...p, durationMinutes: e.target.value }))} required />
            </div>
            <button type="submit" className="btn-primary px-6 py-2.5">Save Exam</button>
          </form>
        </div>

        {/* Questions */}
        <h2 className="text-base font-bold font-display text-on-surface mb-4">Questions ({questions.length})</h2>
        <div className="space-y-4">
          {questions.map((q, i) => (
            <div key={q.id} className="glass-card p-6">
              <p className="text-xs text-on-surface-variant mb-3 font-display">Question {i + 1}</p>
              <div className="space-y-3">
                <div>
                  <label className="form-label">Question</label>
                  <textarea className="input-field h-16 resize-none" value={q.questionText}
                    onChange={(e) => updateQ(q.id, 'questionText', e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {['A', 'B', 'C', 'D'].map((opt) => (
                    <div key={opt}>
                      <label className="form-label">Option {opt}</label>
                      <input className="input-field" value={q[`option${opt}`]}
                        onChange={(e) => updateQ(q.id, `option${opt}`, e.target.value)} />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="form-label">Correct Option</label>
                  <select className="input-field" value={q.correctOption}
                    onChange={(e) => updateQ(q.id, 'correctOption', e.target.value)}>
                    {['A', 'B', 'C', 'D'].map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <button onClick={() => saveQuestion(q.id, q)} className="btn-success text-xs px-4 py-2">
                  Save Question
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
