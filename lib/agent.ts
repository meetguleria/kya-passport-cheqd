import { AgentResult } from "./types";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";

const chat = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY!,
  modelName: "gpt-4o",
});

export async function runAgent(prompt: string): Promise<AgentResult> {
  const res = await chat.call([ new HumanMessage(prompt) ]);
  return { text: res.text, model: chat.modelName };
}