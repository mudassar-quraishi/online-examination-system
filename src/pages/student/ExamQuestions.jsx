import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  doc, getDoc, getDocs, addDoc, collection,
  query, where, serverTimestamp
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import Timer from '../../components/Timer';
import WebcamProctor from '../../components/WebcamProctor';
import Navbar from '../../components/Navbar';

export default function ExamQuestions() {
  const { id: examId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionRef, setSessionRef] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      // Check already taken
      const sessSnap = await getDocs(query(
        collection(db, 'exam_sessions'),
        where('userId', '==', user.uid),
        where('examId', '==', examId)
      ));
      if (!sessSnap.empty) {
        navigate('/student', { replace: true });
        return;
      }

      const examSnap = await getDoc(doc(db, 'exams', examId));
      if (!examSnap.exists()) { setError('Exam not found.'); return; }
      setExam({ id: examSnap.id, ...examSnap.data() });

      const qSnap = await getDocs(query(collection(db, 'questions'), where('examId', '==', examId)));
      setQuestions(qSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

      // Start session
      const ref = await addDoc(collection(db, 'exam_sessions'), {
        userId: user.uid,
        examId,
        startTime: serverTimestamp(),
        endTime: null,
      });
      setSessionRef(ref);
      setSessionStarted(true);
    };
    if (user) load();
  }, [user, examId, navigate]);

  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    // Save answers
    await Promise.all(
      questions.map((q) =>
        addDoc(collection(db, 'answers'), {
          userId: user.uid,
          examId,
          questionId: q.id,
          studentAnswer: answers[q.id] || '—',
        })
      )
    );
    // Update session endTime
    if (sessionRef) {
      const { updateDoc, serverTimestamp: st } = await import('firebase/firestore');
      await updateDoc(sessionRef, { endTime: st() });
    }
    navigate(`/student/results/${examId}`);
  }, [submitting, questions, answers, user, examId, sessionRef, navigate]);

  if (error) return (
    <div className="min-h-screen bg-surface flex items-center justify-center text-error">{error}</div>
  );

  if (!exam || !sessionStarted) return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-on-surface-variant text-sm">Loading exam...</p>
      </div>
    </div>
  );

  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <WebcamProctor examId={examId} />

      {/* Progress bar */}
      <div className="fixed top-14 left-0 right-0 h-1 bg-surface-highest z-40">
        <div
          className="h-full bg-gradient-to-r from-primary-container to-secondary-container transition-all duration-500"
          style={{ width: `${questions.length ? (answeredCount / questions.length) * 100 : 0}%` }}
        />
      </div>

      <main className="pt-20 px-6 max-w-3xl mx-auto pb-20">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="section-title mb-0">{exam.examName}</h1>
            <p className="text-xs text-on-surface-variant mt-1">
              {answeredCount}/{questions.length} questions answered
            </p>
          </div>
          <Timer totalSeconds={exam.durationMinutes * 60} onExpire={handleSubmit} />
        </div>

        {/* Questions */}
        <div className="space-y-6 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.id} className="glass-card p-6">
              <p className="text-xs font-display text-on-surface-variant mb-3 uppercase tracking-wider">
                Question {i + 1}
              </p>
              <p className="text-on-surface font-medium mb-5 leading-relaxed">{q.questionText}</p>
              <div className="space-y-2.5">
                {[
                  { key: 'A', val: q.optionA },
                  { key: 'B', val: q.optionB },
                  { key: 'C', val: q.optionC },
                  { key: 'D', val: q.optionD },
                ].map(({ key, val }) => {
                  const selected = answers[q.id] === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: key }))}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-200 flex items-center gap-3
                                  ${selected
                                    ? 'bg-secondary-container text-white border border-secondary-container'
                                    : 'bg-surface-high text-on-surface-variant hover:bg-surface-highest hover:text-on-surface border border-transparent'}`}
                    >
                      <span className={`w-6 h-6 flex items-center justify-center rounded-lg text-xs font-bold flex-shrink-0
                                        ${selected ? 'bg-white/20 text-white' : 'bg-surface-highest text-on-surface-variant'}`}>
                        {key}
                      </span>
                      {val}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Submit */}
        <div className="mt-8 glass-card p-5 flex items-center justify-between">
          <p className="text-sm text-on-surface-variant">
            {answeredCount < questions.length
              ? `${questions.length - answeredCount} question(s) unanswered`
              : '🎉 All questions answered!'}
          </p>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-primary px-8 py-2.5 disabled:opacity-60">
            {submitting ? 'Submitting...' : 'Submit Exam'}
          </button>
        </div>
      </main>
    </div>
  );
}
