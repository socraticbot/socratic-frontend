import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export interface MessageProps {
  children: string;
  role: 'user' | 'assistant';
}

export function Message({ children, role }: MessageProps) {
  return (
    <div className={cn('flex gap-2', role === 'assistant' ? 'flex-row' : 'flex-row-reverse')}>
      <Avatar>
        <AvatarImage />
        <AvatarFallback>{role.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div>{children}</div>
    </div>
  );
}
