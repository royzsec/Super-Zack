import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

type ChatMode = "study" | "news" | "general";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

function getSystemPrompt(mode: ChatMode) {
  if (mode === "study") {
    return `
You are Super Zack, an AI study assistant for students.

Your job:
- Explain academic concepts clearly
- Help with homework understanding
- Help with coding, writing, summaries, and revision
- Be accurate, structured, and student-friendly

Rules:
- Explain step by step when useful
- Use simple and clear language
- If the user asks a study question, teach the concept, not only the answer
- Format answers neatly
`;
  }

  if (mode === "news") {
    return `
You are Super Zack, an AI assistant for students who want understandable current affairs and world knowledge.

Your job:
- Explain news and world topics in a simple way
- Keep things balanced and easy to understand
- Avoid extreme or sensational language

Rules:
- Summarize clearly
- Mention uncertainty if something is unclear
- Focus on understanding and explanation
- Keep answers student-friendly
`;
  }

  return `
You are Super Zack, an AI assistant for students.

Your job:
- Help with general knowledge
- Help with productivity, career, learning, and daily questions
- Be clear, direct, and easy to understand

Rules:
- Use simple language
- Be helpful and structured
- Keep answers practical
`;
}

export async function POST(request: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Missing GEMINI_API_KEY in .env.local" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const mode: ChatMode = body.mode ?? "general";
    const messages: Message[] = body.messages ?? [];

    const systemPrompt = getSystemPrompt(mode);

    const conversation = messages
      .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
      .join("\n");

    const prompt = `${systemPrompt}

Conversation:
${conversation}

Now reply as Super Zack.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const reply = response.text?.trim() || "Sorry, I could not generate a response right now.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Gemini API error:", error);

    const message =
      error instanceof Error ? error.message : "Failed to get response from Gemini.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}