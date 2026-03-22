'use client';

import { useState } from 'react';

const MAX_CHARS = 5000;

export default function CodeInputBox({ onSubmit, isLoading }) {
  const [code, setCode] = useState('');

  const trimmed = code.trim();
  const count = code.length;
  const overLimit = count > MAX_CHARS;
  const canSubmit = trimmed.length > 0 && !overLimit && !isLoading;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit(trimmed);
    setCode('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-zinc-700/50 bg-zinc-900/80 backdrop-blur px-4 py-3">
      <div className="relative">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder="Paste your C++ code here..."
          rows={5}
          className="w-full resize-none rounded-lg border border-zinc-700/50 bg-zinc-800/60 px-3 py-2.5 pr-24 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-500 disabled:opacity-50 leading-relaxed"
        />
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="absolute bottom-3 right-3 rounded-md bg-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-900 transition-all hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Review
        </button>
      </div>
      <div className="flex justify-between mt-1.5 px-0.5">
        <span className="text-xs text-zinc-600">Ctrl+Enter to submit</span>
        <span className={`text-xs ${overLimit ? 'text-red-400 font-medium' : 'text-zinc-600'}`}>
          {count} / {MAX_CHARS}
        </span>
      </div>
    </div>
  );
}