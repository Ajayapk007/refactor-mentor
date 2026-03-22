'use client';

import { useCallback, useEffect, useState } from 'react';
import { useChatHistory } from '@/lib/useChatHistory';
import Sidebar from '@/components/Sidebar';
import LandingScreen from '@/components/LandingScreen';
import ChatContainer from '@/components/ChatContainer';
import CodeInputBox from '@/components/CodeInputBox';
import { looksLikeCode } from '@/lib/codeDetect';

export default function Home() {
  const {
    sessions,
    activeId,
    activeMessages,
    newChat,
    updateMessages,
    switchSession,
    deleteSession,
  } = useChatHistory();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryAfter, setRetryAfter] = useState(null);

  useEffect(() => {
    if (sessions.length === 0) newChat();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const buildHistory = (msgs) =>
    msgs.map((m) => {
      if (m.role === 'assistant' && m.reviewData) {
        return {
          role: 'assistant',
          content: `I reviewed the code. Verdict: ${m.reviewData.verdict} Time complexity: ${m.reviewData.time_complexity} → ${m.reviewData.improved_tc}.`,
        };
      }
      return { role: m.role, content: m.content };
    });


  const sendCode = useCallback(
    async (code) => {
      setError(null);
      setRetryAfter(null);
      setIsLoading(true);

      const currentMessages = activeMessages;
      const isCodeReview = looksLikeCode(code);

      const userMsg = {
        role: 'user',
        content: isCodeReview ? `Please review this C++ code:\n\n${code}` : code,
        originalCode: isCodeReview ? code : undefined,
      };

      const nextMessages = [...currentMessages, userMsg];
      updateMessages(nextMessages);

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);

      try {
        const res = await fetch('/api/review', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code,
            history: buildHistory(currentMessages),
          }),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (res.status === 429) {
          const data = await res.json().catch(() => ({}));
          setRetryAfter(data.retryAfter ?? 30);
          setError('rate_limited');
          updateMessages(currentMessages);
          return;
        }
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `Server error ${res.status}`);
        }

        const data = await res.json();

        if (data.error) {
          updateMessages([...nextMessages, { role: 'assistant', content: data.error, isFollowUp: true }]);
          return;
        }

        if (data.reviewData) {
          updateMessages([
            ...nextMessages,
            {
              role: 'assistant',
              content: JSON.stringify(data.reviewData), // stored for localStorage hydration
              reviewData: data.reviewData,
              originalCode: code,
              isFollowUp: false,
              isReview: true, // flag so MessageBubble knows this is structured
            },
          ]);
          return;
        }

        if (data.plainText) {
          updateMessages([...nextMessages, { role: 'assistant', content: data.plainText, isFollowUp: true }]);
        }
      } catch (err) {
        clearTimeout(timeout);
        if (err.name === 'AbortError') {
          setError('Request timed out. Please retry.');
        } else {
          setError(err.message || 'Could not reach the server. Check your connection.');
        }
        updateMessages(currentMessages);
      } finally {
        setIsLoading(false);
      }
    },
    [activeMessages, updateMessages]
  );

  const handleRetry = () => {
    const lastUser = [...activeMessages].reverse().find((m) => m.role === 'user');
    if (!lastUser) return;
    const code = lastUser.content.replace(/^Please review this C\+\+ code:\n\n/, '');
    updateMessages(activeMessages.slice(0, -1));
    setError(null);
    sendCode(code);
  };

  const handleNewChat = () => {
    setError(null);
    newChat();
  };

  const isEmpty = activeMessages.length === 0 && !isLoading && !error;

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100" style={{ overflow: 'hidden' }}>

      {/* Sidebar */}
      <Sidebar
        sessions={sessions}
        activeId={activeId}
        onNewChat={handleNewChat}
        onSwitch={switchSession}
        onDelete={deleteSession}
      />

      {/* Main panel — must not grow beyond viewport */}
      <div className="flex flex-col flex-1 min-w-0" style={{ height: '100vh', overflow: 'hidden' }}>

        {/* Header — fixed height, never shrinks */}
        <header className="flex-none border-b border-zinc-800 px-4 py-2.5 flex items-center gap-2">
          <span className="font-mono text-sm font-semibold text-zinc-200">Refactor Mentor</span>
          <span className="text-xs text-zinc-600 font-mono">/ Rex</span>
          <button
            onClick={handleNewChat}
            className="ml-auto text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1.5"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            New chat
          </button>
        </header>

        {/* Chat body — scrolls, takes all remaining space */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {isEmpty ? (
            <LandingScreen onSelectSnippet={sendCode} />
          ) : (
            <ChatContainer
              messages={activeMessages}
              isLoading={isLoading}
              error={error}
          retryAfter={retryAfter}
              onRetry={handleRetry}
            />
          )}
        </div>

        {/* Input — fixed height, always at bottom, never pushed down */}
        <div className="flex-none">
          <CodeInputBox onSubmit={sendCode} isLoading={isLoading} />
        </div>

      </div>
    </div>
  );
}