export default function StatsCard({ icon, label, value, accent = 'primary' }) {
  const accents = {
    primary: 'from-primary-container/20 to-primary/5 border-primary/20 text-primary',
    secondary: 'from-secondary-container/20 to-secondary/5 border-secondary/20 text-secondary',
    tertiary: 'from-tertiary-container/20 to-tertiary/5 border-tertiary/20 text-tertiary',
    error: 'from-error/20 to-error/5 border-error/20 text-error',
  };

  return (
    <div className={`glass-card p-5 bg-gradient-to-br ${accents[accent]} border animate-fade-in`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider mb-2">{label}</p>
          <p className={`text-3xl font-bold font-display ${accents[accent].split(' ').pop()}`}>{value}</p>
        </div>
        <div className={`text-2xl`}>{icon}</div>
      </div>
    </div>
  );
}
