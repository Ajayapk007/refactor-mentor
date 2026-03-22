'use client';

import { useEffect, useRef, useState } from 'react';

export default function CodeBlock({ code, language = 'cpp' }) {
  const ref = useRef(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Dynamically load Prism to avoid SSR issues
    if (typeof window !== 'undefined') {
      import('prismjs').then((Prism) => {
        import('prismjs/components/prism-c').then(() => {
          import('prismjs/components/prism-cpp').then(() => {
            if (ref.current) Prism.default.highlightElement(ref.current);
          });
        });
      });
    }
  }, [code]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available
    }
  };

  return (
    <div className="relative group rounded-lg overflow-hidden border border-zinc-700/50 bg-zinc-900">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 z-10 px-2 py-1 text-xs rounded bg-zinc-700/80 text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-zinc-600"
      >
        {copied ? '✓ Copied' : 'Copy'}
      </button>
      <pre className="overflow-x-auto text-xs leading-relaxed p-4 m-0">
        <code ref={ref} className={`language-${language}`}>
          {code}
        </code>
      </pre>
    </div>
  );
}