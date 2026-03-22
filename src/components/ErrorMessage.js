'use client';

export default function ErrorMessage({ error, onRetry }) {
  return (
    <div className="mx-4 my-2 rounded-lg border border-red-500/30 bg-red-950/30 px-4 py-3">
      <p className="text-sm text-red-400">{error}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 text-xs text-red-400 underline underline-offset-2 hover:text-red-300 transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  );
}