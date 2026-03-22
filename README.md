# Refactor Mentor

A C++ code review chatbot that actually tells you what's wrong with your code — not in a vague, hand-wavy way, but with complexity analysis, specific issues, and a refactored version you can use right away.

The persona is Rex, a senior C++ engineer who's been writing systems code for 12 years and has zero patience for O(n²) loops when a hashmap exists.

---

## What it does

Paste your C++ code and Rex gives you:

- **Time and space complexity** of your original code, plus what it *could* be after a refactor
- **A list of issues** tagged by severity — Critical (fix this now), Warning (bad practice), or Suggestion (minor cleanup)
- **Refactored code** side by side with your original so you can see exactly what changed
- **A one-line verdict** — Rex's honest take, no padding

After the initial review you can ask follow-up questions in plain text. "Why is this O(n²)?" or "What's wrong with using raw pointers here?" — Rex answers conversationally.

Chat history is saved to localStorage so your sessions survive a page refresh.

---

## Tech stack

- **Next.js 14** (App Router)
- **Groq API** — llama-3.3-70b-versatile for fast, free inference
- **Tailwind CSS**
- **Prism.js** for syntax highlighting
- Deployed on **Vercel**

---

## Running it locally

Clone the repo and install dependencies:

```bash
git clone https://github.com/ajayapk007/refactor-mentor.git
cd refactor-mentor
npm install
```

Create a `.env.local` file in the root:

```
GROQ_API_KEY=your_groq_api_key_here
```

You can get a free Groq API key at [console.groq.com](https://console.groq.com). No credit card needed.

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project structure

```
src/
├── app/
│   ├── page.js              # root page, owns all state
│   ├── layout.js
│   └── api/review/route.js  # backend proxy — API key never leaves here
├── components/
│   ├── ChatContainer.js
│   ├── CodeBlock.js         # Prism syntax highlighting + copy button
│   ├── CodeInputBox.js      # textarea with char counter, Ctrl+Enter
│   ├── ComplexityBadge.js   # O(n²) → O(n log n) with color coding
│   ├── DiffView.js          # side-by-side before/after
│   ├── ErrorMessage.js
│   ├── IssuesList.js        # issues with severity tags
│   ├── LandingScreen.js     # shown when chat is empty
│   ├── Loader.js            # rotating messages while Rex thinks
│   ├── MessageBubble.js     # renders user or assistant messages
│   ├── Sidebar.js           # collapsible chat history
│   └── VerdictCard.js
└── lib/
    ├── codeDetect.js        # detects if input is C++ code or plain text
    ├── prompts.js           # Rex's system prompt
    ├── snippets.js          # 4 starter code examples
    ├── types.js             # JSDoc type definitions
    └── useChatHistory.js    # localStorage session management hook
```

---

## A few things worth knowing

**The API key is server-side only.** The `/api/review` route acts as a proxy — your Groq key is never exposed to the browser. This is just a Next.js API route with the key in an env variable.

**Code detection is heuristic.** The app figures out whether you're pasting code or asking a question by looking for C++ signals (`#include`, `std::`, function definitions, etc.). It's not perfect but works well in practice. If Rex gives you a plain text response when you expected a review, try adding `#include <iostream>` at the top.

**No database, no auth.** Everything is stateless by design. Chat history lives in your browser's localStorage and disappears if you clear it. This was a deliberate scope decision.

**Groq free tier limits.** The free tier gives you 14,400 requests/day on Llama 3.3 70B which is more than enough for personal use. If you hit a rate limit, Rex will tell you and retry automatically.

---

## Deploying to Vercel

Push to GitHub, then:

1. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
2. Add `GROQ_API_KEY` under Environment Variables
3. Deploy

That's it. Vercel auto-detects Next.js and every push to `main` triggers a redeploy.

---

## Why I built this

Junior developers (myself included, not long ago) often don't get meaningful code review feedback. Either the reviewer is too busy, or the feedback is "looks fine" when it isn't. Rex is an attempt to simulate what a senior engineer would actually say — not politely, but usefully.

The O(n²) → O(n log n) badge exists because that single insight, shown clearly, is worth more than three paragraphs of explanation.