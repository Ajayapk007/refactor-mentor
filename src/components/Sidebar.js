'use client';

import { useState } from 'react';

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function Sidebar({ sessions, activeId, onNewChat, onSwitch, onDelete }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className="flex-none flex flex-col border-r border-zinc-800 bg-zinc-900 transition-all duration-200"
      style={{ width: collapsed ? '48px' : '220px', height: '100vh', overflow: 'hidden' }}
    >
      {/* Top bar */}
      <div className="flex items-center gap-2 px-2 py-2.5 border-b border-zinc-800 shrink-0">
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="p-1.5 rounded text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        {!collapsed && (
          <span className="text-xs uppercase tracking-widest text-zinc-500 font-medium">History</span>
        )}
      </div>

      {/* New chat button */}
      <div className="px-2 py-2 shrink-0">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          title="New chat"
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="shrink-0">
            <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          {!collapsed && <span>New chat</span>}
        </button>
      </div>

      {/* Sessions */}
      {!collapsed && (
        <nav className="flex-1 overflow-y-auto px-2 pb-4">
          {sessions.length === 0 ? (
            <p className="px-2 py-3 text-xs text-zinc-600 text-center">No history yet</p>
          ) : (
            <ul className="flex flex-col gap-0.5">
              {sessions.map((session) => (
                <li key={session.id} className="group relative">
                  <button
                    onClick={() => onSwitch(session.id)}
                    className={`w-full text-left rounded-md px-2 py-2 pr-7 transition-colors ${
                      session.id === activeId
                        ? 'bg-zinc-700/60 text-zinc-100'
                        : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                    }`}
                  >
                    <div className="text-xs font-medium truncate leading-snug">
                      {session.title}
                    </div>
                    <div className="text-[10px] text-zinc-600 mt-0.5">
                      {timeAgo(session.createdAt)}
                    </div>
                  </button>

                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(session.id); }}
                    className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 rounded text-zinc-600 hover:text-red-400 transition-all"
                    title="Delete"
                  >
                    <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                      <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </nav>
      )}
    </aside>
  );
}