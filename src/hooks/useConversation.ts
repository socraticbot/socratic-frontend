import { useCallback, useEffect, useState } from 'react';
import { z } from 'zod';

const Config = z.object({
  NEXT_PUBLIC_CHATSERVER_URL: z.string().min(1),
  NEXT_PUBLIC_CHATSERVER_TOKEN: z.string().min(1),
});
const config = Config.parse({
  NEXT_PUBLIC_CHATSERVER_URL: process.env.NEXT_PUBLIC_CHATSERVER_URL,
  NEXT_PUBLIC_CHATSERVER_TOKEN: process.env.NEXT_PUBLIC_CHATSERVER_TOKEN,
});

async function request<TInput, TResponse>(
  endpoint: string,
  payload: TInput,
  signal?: AbortSignal,
): Promise<TResponse> {
  return fetch(`${config.NEXT_PUBLIC_CHATSERVER_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${config.NEXT_PUBLIC_CHATSERVER_TOKEN}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(payload),
    signal,
  }).then((res) => {
    if (!res.ok) {
      throw new Error('Failed to fetch');
    }

    return res.json() as Promise<TResponse>;
  });
}

interface CreateConversationInput {
  name: 'dfs_v1' | 'dfs_v2';
  // TODO: What are we supposed to pass here?
  request: Record<string, unknown>;
}

interface CreateConversationResponse {
  conversation_id: string;
  message_id: string;
  message: string;
}

interface ReplyConversationInput {
  conversation_id: string;
  message_id?: string;
  message: string;
}

interface ReplyConversationResponse {
  // Message ID
  id: string;
  message: string;
}

export interface ConversationMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
}

interface UseConversationProps {
  initialMessage?: string;
}

export function useConversation({ initialMessage }: UseConversationProps) {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  // From earliest -> latest
  const [messages, setMessages] = useState<ConversationMessage[]>(() => {
    const initialState: ConversationMessage[] = [];
    if (initialMessage) {
      initialState.push({
        id: uuidv4(),
        content: initialMessage,
        role: 'user',
      });
    }
    return initialState;
  });
  // {
  //   id: '1',
  //   role: 'assistant',
  //   content:
  //     "This is my opening statement. I will share my understanding of the user's argument(s) and the context in which they were written. I will then ask whether my understanding is correct.",
  // },
  // {
  //   id: '2',
  //   role: 'user',
  //   content:
  //     'I will clarify whether the understanding is correct and provide any additional information that may be helpful.',
  // },
  // {
  //   id: '3',
  //   role: 'assistant',
  //   content:
  //     'Once the user confirms that I understand their argument and the context, I will a question to prompt the user to think critically about their claims.',
  // },
  // {
  //   id: '4',
  //   role: 'user',
  //   content:
  //     'I will respond to the question and continue the conversation until I feel confident to post my response on Agora.city.',
  // },

  const addMessage = useCallback(
    (message: ConversationMessage) => setMessages((messages) => [...messages, message]),
    [],
  );

  const removeMessage = useCallback(
    (messageId: string) => setMessages((messages) => messages.filter((it) => it.id !== messageId)),
    [],
  );

  useEffect(() => {
    if (conversationId) {
      return;
    }

    const controller = new AbortController();

    const input: CreateConversationInput = {
      name: 'dfs_v1',
      request: initialMessage
        ? {
            topic: `I am writing a message to share on Zuzagora, a digital platform designed to facilitate open discourse and private communication within the Zuzalu community. I am writing the following message, please help me refine it:\n\n---\n${initialMessage}` /*background*/,
          }
        : {},
    };

    setIsLoading(true);
    request<CreateConversationInput, CreateConversationResponse>('/new', input)
      .then((res) => {
        if (controller.signal.aborted) return;

        setConversationId(res.conversation_id);
        addMessage({
          id: res.message_id,
          content: res.message,
          role: 'assistant',
        });
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [addMessage, conversationId]);

  async function reply() {
    if (!conversationId) return;
    if (!inputValue) return;

    setIsLoading(true);
    const localMessageId = uuidv4();

    try {
      addMessage({
        id: localMessageId,
        content: inputValue,
        role: 'user',
      });
      // TODO: Recover message if things went bad with the API request?
      setInputValue('');

      const input: ReplyConversationInput = {
        conversation_id: conversationId,
        message: inputValue,
      };
      const result = await request<ReplyConversationInput, ReplyConversationResponse>(
        '/reply',
        input,
      );

      addMessage({
        id: result.id,
        content: result.message,
        role: 'assistant',
      });
    } catch (error) {
      removeMessage(localMessageId);

      // TODO: Toast
    } finally {
      setIsLoading(false);
    }
  }

  return {
    input: { value: inputValue, setValue: setInputValue },
    isLoading,
    messages,
    reply,
  };
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
