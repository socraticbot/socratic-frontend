import { BeatLoader } from 'react-spinners';
import { Send } from 'lucide-react';
import { useEffect, useRef } from 'react';

import { useConversation } from '@/hooks/useConversation';

import { Button } from '@/components/ui/button';
import { Message } from '@/components/message';
import { Textarea } from '@/components/ui/textarea';

interface AppProps {
  initialMessage?: string;
}

export default function App({ initialMessage }: AppProps) {
  const chatListRef = useRef<HTMLDivElement | null>(null);
  const { input, isLoading, messages, reply } = useConversation({
    initialMessage: initialMessage?.trim() || undefined,
  });

  useEffect(() => {
    // Scroll to bottom
    chatListRef.current?.scrollTo({
      top: chatListRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  return (
    <main className="container flex h-full flex-col py-4">
      <h1 className="scroll-m-20 text-center font-header text-4xl font-extrabold tracking-tight lg:text-5xl">
        Socratic Bot
      </h1>
      <div ref={chatListRef} className="flex-1 space-y-4 overflow-y-auto">
        {messages.map((message) => (
          <Message key={message.id} role={message.role}>
            {message.content}
          </Message>
        ))}
        {isLoading && (
          <Message role="assistant">
            <BeatLoader color="hsl(var(--muted-foreground))" size={12} />
          </Message>
        )}
      </div>
      <form
        className="relative mt-2 flex flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          reply();
        }}
      >
        {/* 19px border radius is 1/2 of initial height */}
        <Textarea
          className="min-h-0 resize-none rounded-[19px] pr-12"
          placeholder="Type a message..."
          rows={Math.min(input.value.split('\n').length, 4)}
          value={input.value}
          onChange={(e) => input.setValue(e.target.value)}
        />
        <Button
          className="absolute bottom-0 right-0 rounded-full"
          disabled={isLoading || !input.value.trim()}
          size="icon"
          type="submit"
        >
          <Send />
        </Button>
      </form>
    </main>
  );
}
