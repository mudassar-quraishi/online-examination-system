import { Link } from 'react-router-dom';

const features = [
  {
    icon: '🎓',
    title: 'For Students',
    desc: 'Take timed multiple-choice exams from anywhere. Get instant results with detailed performance breakdowns.',
    color: 'from-primary-container/20 to-primary/5 border-primary/20',
    tag: 'Take Exams',
  },
  {
    icon: '📝',
    title: 'For Teachers',
    desc: 'Create and manage exams, add questions, view webcam proctoring snapshots, and generate detailed reports.',
    color: 'from-secondary-container/20 to-secondary/5 border-secondary/20',
    tag: 'Manage Exams',
  },
  {
    icon: '⚙️',
    title: 'For Admins',
    desc: 'Approve or reject teacher accounts, manage all students and teachers from a centralized dashboard.',
    color: 'from-tertiary-container/20 to-tertiary/5 border-tertiary/20',
    tag: 'Manage Users',
  },
];

const stats = [
  { label: 'Exams Taken', value: '1M+' },
  { label: 'Uptime', value: '99.9%' },
  { label: 'Institutions', value: '250+' },
  { label: 'Avg. Response', value: '15ms' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-surface font-body">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-8
                      bg-surface/80 backdrop-blur-xl border-b border-outline-variant/15">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-container to-secondary-container flex items-center justify-center">
            <span className="text-white text-xs font-bold font-display">Q</span>
          </div>
          <span className="font-bold font-display text-on-surface text-sm tracking-wide">Quizora</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-ghost py-1.5 px-4 text-xs">Login</Link>
          <Link to="/register" className="btn-primary py-1.5 px-4 text-xs">Register</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-14
                           relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10
                        bg-gradient-to-br from-primary-container to-secondary-container blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-8
                        bg-gradient-to-br from-tertiary-container to-primary-container blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto animate-slide-up">
          <span className="inline-block mb-5 px-4 py-1.5 rounded-full text-xs font-semibold font-display
                           bg-primary/10 text-primary border border-primary/20 tracking-widest uppercase">
            Secure · Scalable · Intelligent
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold font-display text-on-surface leading-tight mb-5">
            Smart Exams.<br />
            <span className="bg-gradient-to-r from-primary via-tertiary to-secondary-container
                             bg-clip-text text-transparent">
              Real Results.
            </span>
          </h1>
          <p className="text-base md:text-lg text-on-surface-variant max-w-xl mx-auto mb-10 leading-relaxed">
            A secure, scalable online assessment platform with webcam proctoring, instant grading,
            and role-based dashboards for students, teachers, and admins.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="btn-primary px-8 py-3 text-sm">Get Started Free</Link>
            <Link to="/login" className="btn-ghost px-8 py-3 text-sm">Login →</Link>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative z-10 mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl w-full animate-fade-in">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-extrabold font-display bg-gradient-to-r from-primary to-secondary
                            bg-clip-text text-transparent">{s.value}</p>
              <p className="text-xs text-on-surface-variant mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold font-display text-on-surface text-center mb-3">
            Empowering Every Stakeholder
          </h2>
          <p className="text-on-surface-variant text-center mb-14 text-sm">
            One platform, three powerful dashboards built for each role.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title}
                   className={`glass-card p-7 border bg-gradient-to-br ${f.color}
                               hover:scale-[1.02] transition-all duration-300 group`}>
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-bold font-display text-on-surface mb-3">{f.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-5">{f.desc}</p>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium
                                 bg-surface-highest text-on-surface-variant">
                  {f.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center glass-card p-14
                        bg-gradient-to-br from-primary-container/15 to-secondary-container/10
                        border border-primary/20">
          <h2 className="text-3xl font-bold font-display text-on-surface mb-4">
            Ready to transform your assessment?
          </h2>
          <p className="text-on-surface-variant mb-8 text-sm">
            Join thousands of institutions running smarter exams today.
          </p>
          <Link to="/register" className="btn-primary px-10 py-3">Start Your Free Trial</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-outline-variant/10 py-8 px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-primary-container to-secondary-container flex items-center justify-center">
            <span className="text-white text-[9px] font-bold">Q</span>
          </div>
          <span className="font-bold font-display text-on-surface text-xs">Quizora</span>
        </div>
        <p className="text-xs text-on-surface-variant">© 2024 Quizora. All rights reserved.</p>
      </footer>
    </div>
  );
}
