export default function VerdictCard({ verdict }) {
  if (!verdict) return null;

  return (
    <div className="rounded-lg border border-zinc-600/40 bg-zinc-800/40 px-4 py-3">
      <span className="text-xs uppercase tracking-widest text-zinc-500 block mb-1">
        Rex&apos;s Verdict
      </span>
      <p className="font-mono text-sm text-zinc-200 leading-relaxed">&ldquo;{verdict}&rdquo;</p>
    </div>
  );
}