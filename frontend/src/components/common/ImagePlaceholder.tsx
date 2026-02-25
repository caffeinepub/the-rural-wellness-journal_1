import { ImageIcon, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImagePlaceholderProps {
  className?: string;
  aspectRatio?: 'square' | 'landscape' | 'portrait';
  label?: string;
  variant?: 'field' | 'portrait';
}

export default function ImagePlaceholder({
  className,
  aspectRatio = 'landscape',
  label,
  variant = 'field',
}: ImagePlaceholderProps) {
  const aspectClass =
    aspectRatio === 'square'
      ? 'aspect-square'
      : aspectRatio === 'portrait'
        ? 'aspect-[3/4]'
        : 'aspect-[16/9]';

  const defaultLabel = variant === 'portrait' ? 'Add Your Photo' : 'Field Photo Coming Soon';
  const displayLabel = label ?? defaultLabel;

  const Icon = variant === 'portrait' ? User : ImageIcon;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3',
        'border-2 border-dashed rounded-xl',
        'bg-cream/60',
        variant === 'portrait'
          ? 'border-terracotta/40'
          : 'border-sage/40',
        aspectClass,
        className
      )}
    >
      <div
        className={cn(
          'rounded-full p-3',
          variant === 'portrait' ? 'bg-terracotta/10' : 'bg-sage/10'
        )}
      >
        <Icon
          size={28}
          className={cn(
            variant === 'portrait' ? 'text-terracotta/60' : 'text-sage/60'
          )}
          strokeWidth={1.5}
        />
      </div>
      <p
        className={cn(
          'text-xs font-medium tracking-wide text-center px-4',
          variant === 'portrait' ? 'text-terracotta/60' : 'text-sage/60'
        )}
      >
        {displayLabel}
      </p>
    </div>
  );
}
