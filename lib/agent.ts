import { AgentResult } from "./types";
import { OpenAI } from "@langchain/openai";

const llm = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  modelName: "gpt-4o-mini",
});

export async function runAgent(prompt: string): Promise<AgentResult> {
  const text = await llm.call(prompt);
  return { text, model: llm.modelName };
}