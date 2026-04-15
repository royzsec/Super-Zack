# Super Zack

Super Zack is a student-focused AI chatbot built with Next.js and the Google Gemini API.
It includes:

- **Study mode** for subject help, explanations, revision, coding help, and summaries
- **News mode** for current world news using Google Search grounding on the server
- **General mode** for broad student questions and everyday learning support

## 1. Tech stack

- Next.js
- TypeScript
- React
- Google Gemini API
- Google GenAI SDK for JavaScript

## 2. Project structure

```bash
super-zack/
├── app/
│   ├── api/chat/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── chat-ui.tsx
├── lib/
│   ├── system-prompt.ts
│   └── types.ts
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

## 3. Setup

### Step 1: install dependencies

```bash
npm install
```

### Step 2: create your environment file

Create a file called `.env.local` in the project root.

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Step 3: run the app

```bash
npm run dev
```

Then open:

```bash
http://localhost:3000
```

## 4. How to get the Gemini API key

1. Go to Google AI Studio.
2. Open the API keys page.
3. Create a Gemini API key.
4. Paste it into `.env.local` as `GEMINI_API_KEY`.

## 5. How it works

### Frontend
The UI lives in `components/chat-ui.tsx`.
It provides:
- mode switching
- message rendering
- quick prompts
- input form
- request sending to `/api/chat`

### Backend
The API route is in `app/api/chat/route.ts`.
It:
- reads the selected mode
- loads a system prompt for that mode
- sends the conversation to Gemini
- enables Google Search grounding only for news mode
- returns the model output to the frontend

## 6. Why this is a good MVP

This version is intentionally simple so you can launch fast.
It already proves the main product idea:
- students can ask study questions
- students can ask about current world news
- the app has a clean branded UI using the name **Super Zack**
- the backend is easy to extend later

## 7. Good next features

After this works, add these in order:

1. chat history saved in a database
2. authentication with Google
3. PDF and lecture note upload
4. flashcard generator
5. quiz generator
6. subject-specific tutor modes
7. admin dashboard for usage and feedback

## 8. Important note

Keep the Gemini API key only on the server.
Never expose it in the browser or commit it to GitHub.
