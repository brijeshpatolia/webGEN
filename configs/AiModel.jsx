import OpenAI from "openai";

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configuration for general chat conversation
const generationConfig = {
  model: "gpt-4o-mini",
  temperature: 1,
  max_tokens: 500,
  top_p: 0.95,
  frequency_penalty: 0,
  presence_penalty: 0,
};

// Configuration for code generation/completion (currently the same as chat configuration)
const codeGenerationConfig = {
  model: "gpt-4o-mini",
  temperature: 0.7,
  max_tokens: 800,
  top_p: 0.95,
  frequency_penalty: 0,
  presence_penalty: 0,
};

/**
 * Creates a chat session for general conversation.
 * The session maintains a history and offers a sendMessage method.
 */
export async function createChatSession() {
  return {
    history: [
      { role: "system", content: "You are a helpful assistant." }
    ],
    
    async sendMessage(content) {
      // Add the user's message to the history
      this.history.push({ role: "user", content });
      
      // Trim history to avoid exceeding token limits
      while (
        this.history.reduce((sum, msg) => sum + msg.content.length, 0) > 7500
      ) {
        // Remove the oldest non-system message
        this.history.splice(1, 1);
      }
      
      // Create the chat completion request with the current history
      const response = await openai.chat.completions.create({
        model: generationConfig.model,
        messages: this.history,
        temperature: generationConfig.temperature,
        max_tokens: Math.min(
          generationConfig.max_tokens,
          8192 - this.history.reduce((sum, msg) => sum + msg.content.length, 0)
        ),
        top_p: generationConfig.top_p,
        frequency_penalty: generationConfig.frequency_penalty,
        presence_penalty: generationConfig.presence_penalty,
      });
      
      // Extract the assistant's response from the API response
      const assistantMessage = response.choices[0].message.content;
      // Add the assistant's message to the history
      this.history.push({ role: "assistant", content: assistantMessage });
      
      return assistantMessage;
    },
  };
}

/**
 * Creates a code session for code completions.
 * The session provides a completeCode method to generate code based on a provided snippet.
 */
export async function createCodeSession() {
  return {
    history: [
      { role: "system", content: "You are an expert programmer and code assistant." }
    ],
    
    async completeCode(codeSnippet) {
      const messages = [
        { role: "system", content: "You are an expert React developer. Generate structured React projects. Only return JSON—no explanations or comments." },
        { role: "user", content: `Generate a React project structure based on this description:\n\n${codeSnippet}\n\nStrictly return JSON format only.` },
      ];
    
      const response = await openai.chat.completions.create({
        model: codeGenerationConfig.model,
        messages,
        temperature: codeGenerationConfig.temperature,
        max_tokens: Math.min(
          codeGenerationConfig.max_tokens,
          8192 - codeSnippet.length
        ),
        top_p: codeGenerationConfig.top_p,
        frequency_penalty: codeGenerationConfig.frequency_penalty,
        presence_penalty: codeGenerationConfig.presence_penalty,
      });
    
      let generatedCode = response.choices[0].message.content.trim();
    
      // 🔥 Remove anything before/after JSON
      generatedCode = generatedCode.replace(/^.*?{/, "{").replace(/}[^}]*$/, "}");
    
      try {
        JSON.parse(generatedCode); // Validate JSON
      } catch (err) {
        console.error("AI response is not valid JSON:", err);
        return { response: "" }; // Return empty response to avoid crashes
      }
    
      return { response: generatedCode };
    }
    
    
  };
}

