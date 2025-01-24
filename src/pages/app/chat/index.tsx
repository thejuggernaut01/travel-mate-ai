import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Plus } from 'lucide-react';
import { useEffect, useState, useRef, FormEvent } from 'react';
import { fetchGroq } from '@/hooks/fetchGroq';
import Send from '@/assets/send.svg';
import Arrow from '@/assets/arrow.svg';
import Man from '@/assets/man.webp';

type Message = {
  id: number;
  sender: 'user' | 'bot';
  text: string;
};

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      // If no messages are saved, set the default message
      setMessages([
        {
          id: Date.now(),
          sender: 'bot',
          text: "So, what do you think? Any of those destinations tickle your fancy? If not, spill the beans on what you're looking for, and I'll whip up some more options for you!",
        },
      ]);
    }
    scrollToBottom();
  }, []);

  useEffect(() => {
    // Save messages to localStorage whenever they change
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const handleNewChat = () => {
    setMessages([]);
    setInput('');
    localStorage.removeItem('chatMessages');
    // Reset to default message
    setMessages([
      {
        id: Date.now(),
        sender: 'bot',
        text: "So, what do you think? Any of those destinations tickle your fancy? If not, spill the beans on what you're looking for, and I'll whip up some more options for you!",
      },
    ]);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const userMessage: Message = {
      id: Date.now(),
      sender: 'user',
      text: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    try {
      // Fetch the Groq response
      const groqResponse = await fetchGroq(input);

      const botMessage: Message = {
        id: Date.now() + 1,
        sender: 'bot',
        text: groqResponse,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (e) {
      console.error(e);
      const errorMessage: Message = {
        id: Date.now() + 1,
        sender: 'bot',
        text: 'An unexpected error occured.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = (value: string) => {
    setInput(value);
  };
  console.log(messages);

  return (
    <div className="flex w-full h-screen gap-5 bg-white">
      <div className="flex flex-col justify-between w-full overflow-y-auto xl:w-1/2">
        <div className="fixed m-4">
          <Button variant="outline" size="sm" onClick={handleNewChat}>
            New Chat
          </Button>
        </div>
        <div>
          {/* Chat Area */}
          <div className="flex-1 p-4 mt-10 overflow-y-auto">
            {messages.map((message: any) => (
              <div key={message.id} className="mb-4">
                <div
                  className={`max-w-[80%] ${
                    message.sender === 'user'
                      ? 'ml-auto justify-end w-fit'
                      : 'justify-start'
                  }`}
                >
                  <div
                    className={`rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-[#22bcbe] text-white'
                        : 'bg-[#f6f6f6] whitespace-pre-wrap'
                    }`}
                  >
                    {/* strip off markdown  */}
                    {message.text.replace(/\*\*|__|[*_]/g, '')}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 m-4 border rounded-xl">
          <form
            onSubmit={handleSubmit}
            className="flex items-center justify-center"
          >
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything, the more you share the better I can help..."
              className="w-full border-transparent placeholder:text-lg placeholder:text-gray-400 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none outline-none !text-lg text-gray-700"
              disabled={loading}
            />
            <Button
              variant={'ghost'}
              type={input === '' ? 'button' : 'submit'}
              className={`relative px-2.5 rounded-full hover:bg-[#2692B0] ${
                input === ''
                  ? 'bg-[#c6c4c4] cursor-not-allowed'
                  : 'bg-[#22bcbe]'
              }`}
            >
              <img src={Send} width={15} height={15} alt="send button svg" />
            </Button>
          </form>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => handleButtonClick('Moscow sounds good')}
            >
              <Plus className="size-4" />
              Moscow sounds good
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="items-center hidden gap-1 md:flex"
              onClick={() => handleButtonClick('St. Petersburg please')}
            >
              <Plus className="size-4" />
              St. Petersburg please
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => handleButtonClick('Sochi looks fun')}
            >
              <Plus className="size-4" />
              Sochi looks fun
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative hidden w-1/2 h-full xl:block">
        <img
          src={Man}
          alt="Chat cover image"
          sizes="50vw"
          className="object-cover h-screen rounded-l-3xl"
        />
        <div className="absolute inset-0 bg-black/40 rounded-l-3xl" />
        <div className="absolute inset-0 flex flex-col items-center justify-between py-20 text-white">
          <h1 className="text-[3.3rem] font-bold text-center">
            YOUR TRAVEL MATE
          </h1>
          <div className="flex flex-col items-center justify-center space-y-10">
            <p className="p-2 text-2xl font-semibold text-center">
              Got a vacation coming up? Start here by asking me anything about
              it.
            </p>
            <img
              src={Arrow}
              width={15}
              height={15}
              alt="send button svg"
              className="w-52"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
