import OpenAI from "openai";

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configuration for the model
const generationConfig = {
  model: "gpt-4o-mini",
  temperature: 1,
  max_tokens: 500, // Reduce max_tokens
  top_p: 0.95,
  frequency_penalty: 0,
  presence_penalty: 0,
};


// Export the "chat session" equivalent
export async function createChatSession() {
  return {
    history: [],
    async sendMessage(content) {
      // Add the user message to history
      this.history.push({ role: "user", content });
    
      // Add the system instruction if needed at the beginning
      if (this.history.length === 1) {
        this.history.unshift({
          role: "system",
          content: "You are a helpful assistant.",
        });
      }
    
      // Trim history to fit within the token limit
      while (this.history.reduce((sum, msg) => sum + msg.content.length, 0) > 7500) {
        // Remove the oldest non-system message
        this.history.splice(1, 1);
      }
    
      // Call OpenAI API
      const response = await openai.chat.completions.create({
        model: generationConfig.model,
        messages: this.history,
        temperature: generationConfig.temperature,
        max_tokens: Math.min(generationConfig.max_tokens, 8192 - this.history.reduce((sum, msg) => sum + msg.content.length, 0)), // Adjust max_tokens dynamically
        top_p: generationConfig.top_p,
        frequency_penalty: generationConfig.frequency_penalty,
        presence_penalty: generationConfig.presence_penalty,
      });
    
      const assistantMessage = response.choices[0].message.content;
    
      // Add the assistant's response to the history
      this.history.push({ role: "assistant", content: assistantMessage });
    
      return assistantMessage;
    }
    
  };
}
