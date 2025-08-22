import { GoogleGenAI, Type } from '@google/genai';

// Initialize Gemini client
const ai = new GoogleGenAI({});

// Example function schema for scheduling a meeting
export const scheduleMeetingFunctionDeclaration = {
  name: 'schedule_meeting',
  description: 'Schedules a meeting with specified attendees at a given time and date.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      attendees: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'List of people attending the meeting.',
      },
      date: {
        type: Type.STRING,
        description: 'Date of the meeting (e.g., "2025-08-22")',
      },
      time: {
        type: Type.STRING,
        description: 'Time of the meeting (e.g., "13:00")',
      },
      topic: {
        type: Type.STRING,
        description: 'The subject or topic of the meeting.',
      },
    },
    required: ['attendees', 'date', 'time', 'topic'],
  },
};

// Main Gemini function calling handler
export async function handleGeminiFunctionCall(userPrompt: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-lite', // or 'gemini-2.5-flash' or 'gemini-2.5-pro'
    contents: userPrompt,
    config: {
      tools: [{
        functionDeclarations: [scheduleMeetingFunctionDeclaration]
      }],
    },
  });

  // Check for function calls in the response
  if (response.functionCalls && response.functionCalls.length > 0) {
    const functionCall = response.functionCalls[0];
    return {
      functionName: functionCall.name,
      args: functionCall.args,
    };
  } else {
    return { text: response.text };
  }
}