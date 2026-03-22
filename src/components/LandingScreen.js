import { SNIPPETS } from '@/lib/snippets';

export default function LandingScreen({ onSelectSnippet }) {
  return (
    <div className="h-full overflow-y-auto flex flex-col items-center justify-center px-4 py-12 text-center">
      <div className="mb-2 text-xs uppercase tracking-[0.25em] text-zinc-500">Code Review</div>
      <h1 className="text-4xl font-bold text-zinc-100 tracking-tight mb-3">
        Refactor Mentor
      </h1>
      <p className="text-zinc-400 text-base max-w-md leading-relaxed mb-10">
        Paste your C++ code. Get reviewed like you&apos;re in a real PR.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
        {SNIPPETS.map((snippet) => (
          <button
            key={snippet.label}
            onClick={() => onSelectSnippet(snippet.code)}
            className="text-left rounded-lg border border-zinc-700/50 bg-zinc-800/40 px-4 py-3 hover:border-zinc-500/60 hover:bg-zinc-800/70 transition-all group"
          >
            <div className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
              {snippet.label}
            </div>
            <div className="text-xs text-zinc-500 mt-0.5">{snippet.description}</div>
          </button>
        ))}
      </div>

      <p className="mt-8 text-xs text-zinc-600">
        Or paste your own code in the box below
      </p>
    </div>
  );
}