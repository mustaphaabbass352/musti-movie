import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { messages } = await request.json();
  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  if (!GROQ_API_KEY) {
    return NextResponse.json({ error: 'Missing GROQ_API_KEY' }, { status: 500 });
  }

  const systemMessage = {
    role: 'system',
    content: `You are a movie recommendation expert! Help users find movies based on their taste. 

IMPORTANT RULES:
1. Always respond in a friendly, conversational tone
2. When recommending movies, format your response as a list of movies with titles
3. For each movie, provide a brief, engaging description (2-3 sentences)
4. Always include at least 5-7 recommendations
5. Focus on popular, well-known movies that are easy to find
6. Include a mix of different genres and eras when appropriate
7. End with "Now, just search for these movies in the search bar above! 🎬"

EXAMPLE RESPONSE FORMAT:
Here are some amazing movies I think you'll love! 🎬

**Inception** - A mind-bending sci-fi thriller about dream manipulation...
**The Matrix** - A groundbreaking cyberpunk classic that explores reality...
**Interstellar** - An epic space adventure about love and time dilation...
**The Dark Knight** - Christopher Nolan's masterpiece about Batman...
**Parasite** - A brilliant Korean thriller about class inequality...

Now, just search for these movies in the search bar above! 🎬

Respond in this format every time!`
  };

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [systemMessage, ...messages],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json({ error: 'Failed to get response from Groq' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({
      content: data.choices[0].message.content
    });
  } catch (error) {
    console.error('Groq API Error:', error);
    return NextResponse.json({ error: 'Failed to communicate with AI service' }, { status: 500 });
  }
}
