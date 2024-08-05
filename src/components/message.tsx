'use client';
import { CircleUser, Copy, CopyCheck } from 'lucide-react';
import { ReactElement, useCallback, useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import socraticBotAvatarSrc from '@/assets/socraticboticon.png';

export interface MessageProps {
  children: string | ReactElement;
  role: 'user' | 'assistant';
}

export function Message({ children, role }: MessageProps) {
  const [didCopy, setDidCopy] = useState(false);
  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timeoutId) {
      return () => clearTimeout(timeoutId);
    }
  }, [timeoutId]);

  const Icon = didCopy ? CopyCheck : Copy;

  const handleCopy = useCallback(() => {
    if (typeof children === 'string') {
      navigator.clipboard.writeText(children);

      setDidCopy(true);
      const timeoutId = setTimeout(() => {
        setDidCopy(false);
        setTimeoutId(null);
      }, 2_000);

      setTimeoutId(timeoutId);
    }
  }, [children]);

  return (
    <div
      className={cn(
        'group flex items-center gap-2',
        role === 'assistant' ? 'flex-row' : 'flex-row-reverse',
      )}
    >
      <Avatar>
        <AvatarImage src={role === 'assistant' ? socraticBotAvatarSrc.src : undefined} />
        <AvatarFallback>
          {role === 'assistant' ? 'A' : <CircleUser className="text-muted-foreground" />}
        </AvatarFallback>
      </Avatar>
      <div className="max-w-sm rounded-md bg-accent p-3">{children}</div>
      {typeof children === 'string' && (
        <Tooltip>
          <TooltipTrigger>
            <Icon
              className="h-4 w-4 cursor-pointer text-muted-foreground opacity-0 transition-all hover:text-primary active:scale-90 group-hover:opacity-100"
              role="button"
              onClick={handleCopy}
            />
          </TooltipTrigger>
          <TooltipContent>{didCopy ? 'Copied!' : 'Click to copy'}</TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}
