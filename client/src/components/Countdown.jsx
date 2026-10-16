import { useEffect, useState } from 'react';

function getTimeLeft(target) {
  const diff = Math.max(0, target - Date.now());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);
  return { days, hours, mins, secs };
}

export default function Countdown({ daysAhead = 5 }) {
  const [target] = useState(() => Date.now() + daysAhead * 24 * 60 * 60 * 1000);
  const [time, setTime] = useState(() => getTimeLeft(target));

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const blocks = [
    { label: 'Days', value: time.days },
    { label: 'Hr', value: time.hours },
    { label: 'Mins', value: time.mins },
    { label: 'Sec', value: time.secs },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {blocks.map((b) => (
        <div
          key={b.label}
          className="min-w-[64px] bg-white px-3 py-2 text-center shadow-md shadow-black/10"
        >
          <p className="text-xl font-semibold">{String(b.value).padStart(2, '0')}</p>
          <p className="text-xs text-fasco-muted">{b.label}</p>
        </div>
      ))}
    </div>
  );
}
