'use client';

import { useEffect, useState } from 'react';

const MESSAGES = [
  'Reading your loops...',
  'Judging your variable names...',
  'Calculating the damage...',
  'Checking if you reinvented std::map...',
  'Counting your nested ifs...',
  'Almost done roasting you...',
];

export default function Loader() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-3 px-4 py-3 text-sm text-zinc-400">
      <span className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </span>
      <span className="italic transition-all duration-500">{MESSAGES[index]}</span>
    </div>
  );
}