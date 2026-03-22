'use client';

import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';

export default function ChatContainer({ messages, isLoading, error, retryAfter, onRetry }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, error]);

  return (
    <div className="h-full overflow-y-auto py-4 flex flex-col gap-4">
      {messages.map((msg, i) => (
        <div key={i} className="message-enter">
          <MessageBubble
            role={msg.role}
            content={msg.content}
            reviewData={msg.reviewData}
            originalCode={msg.originalCode}
            isFollowUp={msg.isFollowUp}
            isReview={msg.isReview}
          />
        </div>
      ))}

      {isLoading && <Loader />}
      {error && <ErrorMessage error={error} retryAfter={retryAfter} onRetry={onRetry} />}

      <div ref={bottomRef} />
    </div>
  );
}