import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

import socraticBotAvatarSrc from '@/assets/socraticboticon.png';

export interface MessageProps {
  children: string;
  role: 'user' | 'assistant';
}

export function Message({ children, role }: MessageProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2',
        role === 'assistant' ? 'flex-row' : 'flex-row-reverse',
      )}
    >
      <Avatar>
        <AvatarImage src={role === 'assistant' ? socraticBotAvatarSrc.src : undefined} />
        <AvatarFallback>{role.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="max-w-sm rounded-md bg-accent p-3">{children}</div>
    </div>
  );
}
