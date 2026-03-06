import { cn } from '@/lib/utils';

const variants = {
  default: 'bg-gray-100 text-gray-700',
  brand:   'bg-brand-100 text-brand-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  danger:  'bg-red-100 text-red-700',
  info:    'bg-blue-100 text-blue-700',
  purple:  'bg-purple-100 text-purple-700',
  orange:  'bg-orange-100 text-orange-700',
};

export function Badge({ variant = 'default', className, children, dot = false }) {
  return (
    <span className={cn('badge', variants[variant], className)}>
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full mr-1.5', {
          'bg-green-500':  variant === 'success',
          'bg-red-500':    variant === 'danger',
          'bg-yellow-500': variant === 'warning',
          'bg-blue-500':   variant === 'info',
          'bg-brand-500':  variant === 'brand',
          'bg-gray-500':   variant === 'default',
        })} />
      )}
      {children}
    </span>
  );
}
