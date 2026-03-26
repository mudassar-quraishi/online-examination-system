import { useEffect, useRef } from 'react';

export default function Timer({ totalSeconds, onExpire }) {
  const timerRef = useRef(totalSeconds);
  const intervalRef = useRef(null);
  const displayRef = useRef(null);

  useEffect(() => {
    timerRef.current = totalSeconds;
    intervalRef.current = setInterval(() => {
      timerRef.current -= 1;
      const m = Math.floor(timerRef.current / 60);
      const s = timerRef.current % 60;
      if (displayRef.current) {
        displayRef.current.textContent =
          `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        // Turn red in last 60 seconds
        if (timerRef.current <= 60) {
          displayRef.current.classList.add('text-error');
          displayRef.current.classList.remove('text-tertiary');
        }
      }
      if (timerRef.current <= 0) {
        clearInterval(intervalRef.current);
        onExpire?.();
      }
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [totalSeconds, onExpire]);

  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;

  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-highest border border-outline-variant/20">
      <svg className="w-4 h-4 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 8v4l2.5 2.5M12 3a9 9 0 100 18A9 9 0 0012 3z" />
      </svg>
      <span className="text-xs text-on-surface-variant font-medium">Time</span>
      <span
        ref={displayRef}
        className="text-xl font-bold font-display text-tertiary tabular-nums"
      >
        {`${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`}
      </span>
    </div>
  );
}
