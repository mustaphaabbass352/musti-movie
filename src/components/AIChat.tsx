'use client'

import { X, Send, Bot, Sparkles, Play, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { getThemeConfig } from '@/utils/theme';

interface Props {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onMovieClick: (movie: any) => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  movieButtons?: any[];
}

const AIChat = ({ isOpen, setIsOpen, onMovieClick }: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchingMovie, setSearchingMovie] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const theme = getThemeConfig();

  const TMDB_API_KEY = 'd8c7480fda6456d4e63823d156aa1cab';

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: `Hey! 🎬 I'm your movie buddy! Let's find the perfect movies for you!`
      }]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const searchTMDB = async (query: string) => {
    try {
      const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(query)}`);
      const data = await res.json();
      return data.results?.[0] || null;
    } catch (error) {
      console.error('TMDB search error:', error);
      return null;
    }
  };

  const parseAndSearchMovies = async (text: string) => {
    const movieTitles = text.match(/\*\*(.*?)\*\*/g) || [];
    const movies: any[] = [];

    for (const titleMatch of movieTitles) {
      const title = titleMatch.replace(/\*\*/g, '').trim();
      if (title && title.length > 0) {
        const movie = await searchTMDB(title);
        if (movie) {
          movie.media_type = movie.media_type || (movie.title ? 'movie' : 'tv');
          movies.push(movie);
        }
      }
    }

    return movies;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const systemMessage = {
        role: 'system',
        content: `You are a friendly movie recommendation expert! 

IMPORTANT: FIRST, ASK THE USER ABOUT THEIR MOVIE TASTE BEFORE GIVING ANY RECOMMENDATIONS!

Start the conversation by asking these questions in a friendly way:
1. What genres do you enjoy? (Action, Horror, Comedy, Romance, Sci-Fi, Thriller, Drama, etc.)
2. Do you prefer old classics or recent movies?
3. Any favorite movies you've watched before that you love?

Once the user answers these questions, THEN give them personalized movie recommendations based on their answers!

WHEN GIVING RECOMMENDATIONS:
1. Always respond in a friendly, conversational tone
2. Format recommendations as a list with bold movie titles using ** around the title
3. For each movie, provide a brief, engaging description (2-3 sentences)
4. Include at least 5-7 recommendations tailored perfectly to their taste
5. Focus on popular, well-known movies that are easy to find
6. End with "Now, just search for these movies or click Watch Now below! 🎬"

EXAMPLE RECOMMENDATION FORMAT:
Based on your taste, here are some perfect movies for you! 🎬

**Inception** - A mind-bending sci-fi thriller about dream manipulation...
**The Matrix** - A groundbreaking cyberpunk classic that explores reality...
**Interstellar** - An epic space adventure about love and time dilation...
**The Dark Knight** - Christopher Nolan's masterpiece about Batman...
**Parasite** - A brilliant Korean thriller about class inequality...

Now, just search for these movies or click Watch Now below! 🎬`
      };

      const response = await fetch('/api/groq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [systemMessage, ...messages, userMessage] })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const aiMessage: Message = {
        role: 'assistant',
        content: data.content
      };

      const foundMovies = await parseAndSearchMovies(data.content);
      if (foundMovies.length > 0) {
        aiMessage.movieButtons = foundMovies;
      }

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Oops! Something went wrong with the AI! 😅'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDirectSearch = async (query: string) => {
    setSearchingMovie(query);
    const movie = await searchTMDB(query);
    if (movie) {
      movie.media_type = movie.media_type || (movie.title ? 'movie' : 'tv');
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Found it! Here's **${movie.title || movie.name}**! 🎬`,
        movieButtons: [movie]
      }]);
    } else {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Sorry, I couldn't find "${query}"! Try a different title!`
      }]);
    }
    setSearchingMovie(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={() => setIsOpen(false)}
      />
      
      <div className="relative w-full max-w-2xl h-[75vh] max-h-[650px] bg-[#1a1a1a] rounded-2xl shadow-2xl border border-white/10 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-[#1a1a1a] to-[#252525]">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${theme.isEventActive ? theme.primaryColor + '/20' : 'bg-gradient-to-br from-purple-500/20 to-pink-500/20'}`}>
              <Bot className={`h-6 w-6 ${theme.isEventActive ? theme.primaryColor : 'text-purple-400'}`} />
            </div>
            <div>
              <h2 className="text-white font-bold flex items-center space-x-2">
                <span>Movie AI</span>
                <Sparkles className="h-4 w-4 text-yellow-400" />
              </h2>
              <p className="text-xs text-gray-400">Your personal movie buddy</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/10 rounded-full transition"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className="flex flex-col"
            >
              <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-tr-sm' 
                      : 'bg-[#2a2a2a] text-gray-200 rounded-tl-sm border border-white/5'
                  }`}
                >
                  <div className="whitespace-pre-wrap prose prose-invert prose-sm max-w-none">
                    {message.content.split('**').map((part, i) => 
                      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                    )}
                  </div>
                </div>
              </div>
              
              {message.movieButtons && message.movieButtons.length > 0 && (
                <div className={`mt-3 flex flex-wrap gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.movieButtons.map((movie, idx) => (
                    <button
                      key={`${movie.id}-${idx}`}
                      onClick={() => {
                        onMovieClick(movie);
                        setIsOpen(false);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm font-medium rounded-full transition shadow-lg"
                    >
                      <Play className="h-4 w-4 fill-current" />
                      <span>Watch {movie.title || movie.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#2a2a2a] text-gray-200 rounded-2xl px-4 py-3 rounded-tl-sm border border-white/5">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
          
          {searchingMovie && (
            <div className="flex justify-start">
              <div className="bg-[#2a2a2a] text-gray-200 rounded-2xl px-4 py-3 rounded-tl-sm border border-white/5 flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Searching for {searchingMovie}...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-white/10 bg-[#1a1a1a]">
          <div className="flex space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tell me what you want to watch, or ask for recommendations..."
              className="flex-1 bg-[#2a2a2a] border border-white/10 rounded-full px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
