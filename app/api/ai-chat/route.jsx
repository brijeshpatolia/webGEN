import { createChatSession } from "@/configs/AiModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    // Validate the prompt
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Invalid prompt provided." },
        { status: 400 }
      );
    }

    // Create a new chat session
    const chatSession = await createChatSession();

    // Get AI response
    const AIresp = await chatSession.sendMessage(prompt);

    return NextResponse.json({ result: AIresp });
  } catch (error) {
    console.error("Error processing AI request:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}