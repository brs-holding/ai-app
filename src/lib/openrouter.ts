import { OpenAI } from "openai";
import { LanguageModelV1 } from "@ai-sdk/provider";
import { anthropic } from "@ai-sdk/anthropic";

// Create OpenRouter client
const openRouterClient = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || "",
  baseURL: "https://openrouter.ai/api/v1",
});

// This function creates a wrapper around the normal anthropic function
// We'll use the original anthropic function to create a model, but override its methods
export function openRouterClaude(modelName: string) {
  // Use the original anthropic model creator but we'll intercept its methods
  const originalModel = anthropic("claude-3-7-sonnet-20250219");
  
  // Create a proxy that will intercept calls to the model methods
  return new Proxy(originalModel, {
    get(target, prop) {
      // Special case for generateContent which is the main method used by Agent
      if (prop === 'generateContent') {
        return async function(prompt: any) {
          try {
            // Convert the AI SDK format to OpenRouter format
            const messages = Array.isArray(prompt) 
              ? prompt.map((msg: any) => ({
                  role: msg.role,
                  content: typeof msg.content === 'string' 
                    ? msg.content 
                    : msg.content.map((part: any) => {
                        if (part.type === 'text') return { type: 'text', text: part.text };
                        return part;
                      })
                }))
              : [{ role: "user", content: prompt }];
            
            // Call OpenRouter API
            const response = await openRouterClient.chat.completions.create({
              model: "anthropic/claude-3-opus-20240229", // Using Claude via OpenRouter
              messages,
              temperature: 0.7,
              max_tokens: 4096,
            });
            
            // Return in the format expected by the AI SDK
            return {
              content: response.choices[0]?.message?.content || "",
            };
          } catch (error) {
            console.error("Error calling OpenRouter:", error);
            throw error;
          }
        };
      }
      
      // Return the original function for any other property
      return target[prop as keyof typeof target];
    }
  });
}
