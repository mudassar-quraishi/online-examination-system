import { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import Navbar from '../../components/Navbar';

export default function ManageTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTeachers = async () => {
    setLoading(true);
    const snap = await getDocs(query(collection(db, 'users'), where('role', '==', 'teacher')));
    setTeachers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };

  useEffect(() => { fetchTeachers(); }, []);

  const approve = async (id, value) => {
    await updateDoc(doc(db, 'users', id), { approved: value });
    fetchTeachers();
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this teacher?')) return;
    await deleteDoc(doc(db, 'users', id));
    fetchTeachers();
  };

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="pt-20 px-6 max-w-5xl mx-auto pb-12">
        <div className="mb-8 animate-fade-in">
          <h1 className="section-title">Manage Teachers</h1>
          <p className="section-subtitle">Approve or remove teacher accounts.</p>
        </div>

        <div className="glass-card overflow-hidden animate-fade-in">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-on-surface-variant text-sm">Loading...</div>
          ) : teachers.length === 0 ? (
            <div className="text-center py-16 text-on-surface-variant text-sm">No teachers found.</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((t) => (
                  <tr key={t.id}>
                    <td className="font-medium text-on-surface">{t.name}</td>
                    <td className="text-on-surface-variant">{t.email}</td>
                    <td className="text-on-surface-variant">{t.subject || '—'}</td>
                    <td>
                      {t.approved
                        ? <span className="badge-success">Approved</span>
                        : <span className="badge-warning">Pending</span>}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        {!t.approved && (
                          <button onClick={() => approve(t.id, true)} className="btn-success text-xs px-3 py-1.5">
                            Approve
                          </button>
                        )}
                        {t.approved && (
                          <button onClick={() => approve(t.id, false)} className="btn-ghost text-xs px-3 py-1.5">
                            Revoke
                          </button>
                        )}
                        <button onClick={() => remove(t.id)} className="btn-danger text-xs px-3 py-1.5">
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
