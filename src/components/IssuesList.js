const SEVERITY_CONFIG = {
  critical: {
    emoji: '🔴',
    label: 'Critical',
    classes: 'border-red-500/20 bg-red-950/20 text-red-400',
    tagClasses: 'bg-red-500/10 text-red-400',
  },
  warning: {
    emoji: '🟡',
    label: 'Warning',
    classes: 'border-yellow-500/20 bg-yellow-950/20 text-yellow-400',
    tagClasses: 'bg-yellow-500/10 text-yellow-400',
  },
  suggestion: {
    emoji: '🟢',
    label: 'Suggestion',
    classes: 'border-green-500/20 bg-green-950/10 text-green-400',
    tagClasses: 'bg-green-500/10 text-green-400',
  },
};

export default function IssuesList({ issues }) {
  if (!issues?.length) return null;

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs uppercase tracking-widest text-zinc-500">Issues Found</h3>
      <ul className="flex flex-col gap-2">
        {issues.map((issue, i) => {
          const config = SEVERITY_CONFIG[issue.severity] ?? SEVERITY_CONFIG.suggestion;
          return (
            <li
              key={i}
              className={`rounded-lg border px-3 py-2.5 ${config.classes}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-xs font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded ${config.tagClasses}`}
                >
                  {config.emoji} {config.label}
                </span>
                <span className="text-sm font-medium text-zinc-200">{issue.title}</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">{issue.explanation}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}