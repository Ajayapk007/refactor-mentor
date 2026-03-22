import ComplexityBadge from './ComplexityBadge';
import IssuesList from './IssuesList';
import DiffView from './DiffView';
import VerdictCard from './VerdictCard';
import CodeBlock from './CodeBlock';

function parseSegments(text) {
  const segments = [];
  const regex = /```(?:cpp|c\+\+)?\n?([\s\S]*?)```/gi;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const before = text.slice(lastIndex, match.index).trim();
      if (before) segments.push({ type: 'text', content: before });
    }
    segments.push({ type: 'code', content: match[1].trim() });
    lastIndex = match.index + match[0].length;
  }

  const after = text.slice(lastIndex).trim();
  if (after) segments.push({ type: 'text', content: after });
  if (segments.length === 0) segments.push({ type: 'text', content: text });

  return segments;
}

function unescapeCode(str) {
  if (!str) return str;
  // Only unescape if it contains literal \n (two chars), not real newlines
  if (str.includes('\\n')) {
    return str.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
  }
  return str;
}

export default function MessageBubble({ role, content, reviewData: reviewDataProp, originalCode, isFollowUp, isReview }) {

  // Re-hydrate reviewData from content string when loaded from localStorage
  let reviewData = reviewDataProp;
  if (isReview && !reviewData && content) {
    try {
      const parsed = JSON.parse(content);
      parsed.refactored_code = unescapeCode(parsed.refactored_code);
      reviewData = parsed;
    } catch {
      reviewData = null;
    }
  }

  // ── User message ──────────────────────────────────────────────────────────
  if (role === 'user') {
    if (content.startsWith('Please review this C++ code:')) return null;
    return (
      <div className="flex justify-end px-4">
        <div className="max-w-[80%] rounded-lg bg-zinc-700/50 border border-zinc-600/30 px-4 py-3">
          <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{content}</p>
        </div>
      </div>
    );
  }

  // ── Follow-up / plain text ────────────────────────────────────────────────
  if (isFollowUp || !reviewData) {
    const segments = parseSegments(content);
    return (
      <div className="flex justify-start px-4">
        <div className="w-full max-w-[90%] rounded-lg bg-zinc-800/60 border border-zinc-700/30 px-4 py-3 flex flex-col gap-3">
          {segments.map((seg, i) =>
            seg.type === 'code' ? (
              <CodeBlock key={i} code={seg.content} language="cpp" />
            ) : (
              <p key={i} className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {seg.content}
              </p>
            )
          )}
        </div>
      </div>
    );
  }

  // ── Structured review card ────────────────────────────────────────────────
  const { time_complexity, space_complexity, improved_tc, improved_sc, issues, verdict } = reviewData;

  // unescapeCode only fixes literal \n — leaves real newlines untouched
  const refactored_code = unescapeCode(reviewData.refactored_code);

  return (
    <div className="px-4">
      <div className="rounded-xl border border-zinc-700/40 bg-zinc-800/30 p-4 flex flex-col gap-5">

        {(time_complexity || space_complexity) && (
          <div className="flex flex-wrap gap-6">
            {time_complexity && (
              <ComplexityBadge label="Time" before={time_complexity} after={improved_tc ?? time_complexity} />
            )}
            {space_complexity && (
              <ComplexityBadge label="Space" before={space_complexity} after={improved_sc ?? space_complexity} />
            )}
          </div>
        )}

        {issues?.length > 0 && <IssuesList issues={issues} />}

        {refactored_code && (
          <DiffView original={originalCode || ''} refactored={refactored_code} />
        )}

        {verdict && <VerdictCard verdict={verdict} />}

      </div>
    </div>
  );
}