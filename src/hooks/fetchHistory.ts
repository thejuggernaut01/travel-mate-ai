import Groq from 'groq-sdk';

const apiKey = import.meta.env.VITE_GROQ_API_KEY;

export const fetchCityHistoryGroq = async (city: string) => {
  if (!apiKey) {
    return 'API key is missing';
  }

  const groq = new Groq({ apiKey: apiKey, dangerouslyAllowBrowser: true });
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are Travel Mate AI, an AI assistant for travelmate.ai that provides travel assistance based on user input. 
            1. For any inquiries related to travel, respond with helpful suggestions and information. 
            2. If the user asks for specific travel tips, such as "What can you tell me about Spain?" or "What are some good places to visit?",
            provide relevant travel information or advice in a clear and organized format. 
            3. If the user asks for a short history about a city, provide a concise, well-organized historical overview. 
               - Include major milestones in the city's development.
               - Highlight any significant events or cultural influences.
               - Mention any unique aspects of its history in a paragraph or two.
            4. Format responses to be clean and presentable, numbered lists should start in new lines, or paragraphs for clarity. 
               For example:
               - Start with a brief introduction to the topic. 
               - Follow with specific recommendations or details. 
               - Conclude with any additional tips or suggestions. 
            `,
        },
        {
          role: 'user',
          content: `Can you give me a short history about ${city}?`,
        },
      ],
      model: 'llama3-8b-8192',
    });

    const response =
      chatCompletion.choices[0]?.message?.content || 'No response generated';

    return response;
  } catch (e) {
    console.error(e);
    return 'An error occurred while generating the response from bot.';
  }
};
