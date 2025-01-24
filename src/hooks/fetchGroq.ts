import Groq from 'groq-sdk';

const apiKey = import.meta.env.VITE_GROQ_API_KEY;

export const fetchGroq = async (message: string) => {
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
          3. Format responses to be clean and presentable, numbered lists should start in new lines, or paragraphs for clarity. 
             For example:
    - Start with a brief introduction to the topic. 
             - Follow with specific recommendations or details. 
             - Conclude with any additional tips or suggestions. 
          4. For general inquiries, engage in a friendly and informative manner. 
             Do not generate SQL queries or any code; focus solely on travel assistance.`,
        },
        {
          role: 'user',
          content: message,
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
