'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'refactor_mentor_sessions';

function loadSessions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSessions(sessions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch {
    // storage full or unavailable
  }
}

function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function sessionTitle(messages) {
  // Use first user message as title, strip the review prefix
  const first = messages.find((m) => m.role === 'user');
  if (!first) return 'New chat';
  const text = first.content
    .replace(/^Please review this C\+\+ code:\n\n/, '')
    .trim()
    .slice(0, 50);
  return text.length < first.content.length ? text + '…' : text;
}

export function useChatHistory() {
  const [sessions, setSessions] = useState([]);
  const [activeId, setActiveId] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = loadSessions();
    setSessions(stored);
    if (stored.length > 0) setActiveId(stored[0].id);
  }, []);

  const activeSession = sessions.find((s) => s.id === activeId) ?? null;
  const activeMessages = activeSession?.messages ?? [];

  // Persist whenever sessions change
  useEffect(() => {
    if (sessions.length > 0) saveSessions(sessions);
  }, [sessions]);

  const newChat = useCallback(() => {
    const id = makeId();
    const session = { id, title: 'New chat', messages: [], createdAt: Date.now() };
    setSessions((prev) => [session, ...prev]);
    setActiveId(id);
    return id;
  }, []);

  const updateMessages = useCallback((msgs) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeId
          ? { ...s, messages: msgs, title: sessionTitle(msgs) }
          : s
      )
    );
  }, [activeId]);

  const switchSession = useCallback((id) => {
    setActiveId(id);
  }, []);

  const deleteSession = useCallback((id) => {
    setSessions((prev) => {
      const next = prev.filter((s) => s.id !== id);
      saveSessions(next);
      if (next.length === 0) localStorage.removeItem(STORAGE_KEY);
      return next;
    });
    setActiveId((prev) => {
      if (prev !== id) return prev;
      const remaining = sessions.filter((s) => s.id !== id);
      return remaining[0]?.id ?? null;
    });
  }, [sessions]);

  return {
    sessions,
    activeId,
    activeMessages,
    newChat,
    updateMessages,
    switchSession,
    deleteSession,
  };
}