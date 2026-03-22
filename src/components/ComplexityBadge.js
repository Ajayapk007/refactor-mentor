export default function ComplexityBadge({ label, before, after }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs uppercase tracking-widest text-zinc-500">{label}</span>
      <div className="flex items-center gap-2 font-mono text-sm">
        <span className="rounded px-2 py-0.5 bg-red-950/60 text-red-400 border border-red-500/20">
          {before}
        </span>
        <span className="text-zinc-600">→</span>
        <span className="rounded px-2 py-0.5 bg-green-950/60 text-green-400 border border-green-500/20">
          {after}
        </span>
      </div>
    </div>
  );
}