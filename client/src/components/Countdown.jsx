import { useEffect, useState } from 'react';

function getTimeLeft(target) {
  const diff = Math.max(0, target - Date.now());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);
  return { days, hours, mins, secs };
}

function getNextTarget(daysAhead) {
  const interval = daysAhead * 24 * 60 * 60 * 1000;
  const now = Date.now();
  return now + (interval - (now % interval));
}

export default function Countdown({ daysAhead = 5 }) {
  const [target, setTarget] = useState(() => getNextTarget(daysAhead));
  const [time, setTime] = useState(() => getTimeLeft(target));

  useEffect(() => {
    const id = setInterval(() => {
      if (Date.now() >= target) {
        const nextTarget = getNextTarget(daysAhead);
        setTarget(nextTarget);
        setTime(getTimeLeft(nextTarget));
        return;
      }

      setTime(getTimeLeft(target));
    }, 1000);
    return () => clearInterval(id);
  }, [daysAhead, target]);

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
          className="min-w-[64px] bg-white px-3 py-2 text-center text-black shadow-md shadow-black/10"
        >
          <p className="text-xl font-semibold">{String(b.value).padStart(2, '0')}</p>
          <p className="text-xs text-fasco-muted">{b.label}</p>
        </div>
      ))}
    </div>
  );
}
