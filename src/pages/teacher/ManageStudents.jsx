import { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import Navbar from '../../components/Navbar';

export default function TeacherManageStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    setLoading(true);
    const snap = await getDocs(query(collection(db, 'users'), where('role', '==', 'student')));
    setStudents(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };

  useEffect(() => { fetchStudents(); }, []);

  const approve = async (id, value) => {
    await updateDoc(doc(db, 'users', id), { approved: value });
    fetchStudents();
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    await deleteDoc(doc(db, 'users', id));
    fetchStudents();
  };

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="pt-20 px-6 max-w-5xl mx-auto pb-12">
        <div className="mb-8 animate-fade-in">
          <h1 className="section-title">Manage Students</h1>
          <p className="section-subtitle">Approve, revoke access, and remove student accounts.</p>
        </div>

        <div className="glass-card overflow-hidden animate-fade-in">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-on-surface-variant text-sm">Loading...</div>
          ) : students.length === 0 ? (
            <div className="text-center py-16 text-on-surface-variant text-sm">No students found.</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Class</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id}>
                    <td className="font-medium text-on-surface">{s.name}</td>
                    <td className="text-on-surface-variant">{s.email}</td>
                    <td className="text-on-surface-variant">{s.studentClass || '—'}</td>
                    <td>
                      {s.approved
                        ? <span className="badge-success">Approved</span>
                        : <span className="badge-warning">Pending</span>}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        {!s.approved && (
                          <button onClick={() => approve(s.id, true)} className="btn-success text-xs px-3 py-1.5">
                            Approve
                          </button>
                        )}
                        {s.approved && (
                          <button onClick={() => approve(s.id, false)} className="btn-ghost text-xs px-3 py-1.5">
                            Revoke
                          </button>
                        )}
                        <button onClick={() => remove(s.id)} className="btn-danger text-xs px-3 py-1.5">
                          Delete
                        </button>
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
