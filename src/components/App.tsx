import { Send } from 'lucide-react';

import { useConversation } from '@/hooks/useConversation';

import { Button } from '@/components/ui/button';
import { Message } from '@/components/message';
import { Input } from '@/components/ui/input';

interface AppProps {
  initialMessage?: string;
}

export default function App({ initialMessage }: AppProps) {
  const { input, isLoading, messages, reply } = useConversation({
    initialMessage: initialMessage?.trim() || undefined,
  });

  return (
    <main>
      <div className="container w-full max-w-2xl border">
        <h1 className="scroll-m-20 text-center font-header text-4xl font-extrabold tracking-tight lg:text-5xl">
          Socratic Bot
        </h1>

        <div className="space-y-6">
          <div className="max-h-96 space-y-4 overflow-y-auto">
            {messages.map((message) => (
              <Message key={message.id} role={message.role}>
                {message.content}
              </Message>
            ))}
          </div>

          <form
            className="flex flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              reply();
            }}
          >
            <Input
              className="rounded-l-md rounded-r-none"
              placeholder="Type a message..."
              value={input.value}
              onChange={(e) => input.setValue(e.target.value)}
            />
            <Button
              className="rounded-l-none rounded-r-md"
              disabled={isLoading}
              size="icon"
              type="submit"
            >
              <Send />
            </Button>
          </form>

          <Button className="mx-auto block shadow-xl" size="lg">
            Return to Agora
          </Button>
        </div>
      </div>
    </main>
  );
}
