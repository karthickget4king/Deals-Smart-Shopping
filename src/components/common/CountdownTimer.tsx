import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  targetDate?: string;
  className?: string;
  label?: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  className = '',
  label = 'Ends in',
}) => {
  // If no target date passed, default to 5 hours from now
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 4,
    minutes: 32,
    seconds: 15,
  });

  useEffect(() => {
    const end = targetDate ? new Date(targetDate).getTime() : Date.now() + 5 * 3600 * 1000;

    const updateTimer = () => {
      const now = Date.now();
      const difference = Math.max(0, end - now);

      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold tabular-nums ${className}`}
    >
      <Clock size={12} className="shrink-0 animate-pulse text-[#CC0C39]" />
      {label && <span className="text-gray-500 dark:text-gray-400 font-medium">{label}</span>}
      <span className="text-[#CC0C39] font-bold">
        {pad(timeLeft.hours)}h {pad(timeLeft.minutes)}m {pad(timeLeft.seconds)}s
      </span>
    </div>
  );
};
