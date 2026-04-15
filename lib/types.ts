export type ChatMode = "study" | "news" | "general";

export type Message = {
  role: "user" | "assistant";
  content: string;
};
