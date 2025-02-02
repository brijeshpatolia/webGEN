import { createCodeSession } from "@/configs/AiModel";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return new Response(JSON.stringify({ error: "Invalid prompt provided." }), {
        status: 400, headers: { "Content-Type": "application/json" }
      });
    }

    const session = await createCodeSession();
    const result = await session.completeCode(prompt);

    if (!result || !result.response) {
      console.error("AI model returned an empty response:", result);
      return new Response(JSON.stringify({ error: "AI response is empty." }), {
        status: 500, headers: { "Content-Type": "application/json" }
      });
    }

    // 🔥 Ensure response is valid JSON
    let cleanedResponse = result.response.trim();
    cleanedResponse = cleanedResponse.replace(/^.*?{/, "{").replace(/}[^}]*$/, "}");

    let responseData;
    try {
      responseData = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("Invalid JSON format:", parseError);
      return new Response(
        JSON.stringify({
          error: "Invalid AI response format. JSON may be incorrect.",
          rawResponse: cleanedResponse
        }), {
        status: 500, headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ result: responseData }), {
      status: 200, headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Server error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error", details: error.message }), {
      status: 500, headers: { "Content-Type": "application/json" }
    });
  }
}
