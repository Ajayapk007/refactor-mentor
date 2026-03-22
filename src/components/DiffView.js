'use client';

import CodeBlock from './CodeBlock';

export default function DiffView({ original, refactored }) {
  if (!refactored) return null;

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs uppercase tracking-widest text-zinc-500">Refactored Code</h3>
      <CodeBlock code={refactored} language="cpp" />
    </div>
  );
}