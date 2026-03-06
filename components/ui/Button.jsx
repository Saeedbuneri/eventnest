import { cn } from '@/lib/utils';

const variants = {
  primary:   'bg-brand-600 hover:bg-brand-700 text-white shadow-sm hover:shadow-md',
  secondary: 'bg-white hover:bg-gray-50 text-brand-700 border border-brand-200',
  accent:    'bg-accent-500 hover:bg-accent-600 text-white shadow-sm hover:shadow-md',
  ghost:     'hover:bg-gray-100 text-gray-700',
  danger:    'bg-red-600 hover:bg-red-700 text-white shadow-sm',
  outline:   'border border-gray-300 hover:bg-gray-50 text-gray-700',
  success:   'bg-green-600 hover:bg-green-700 text-white shadow-sm',
};

const sizes = {
  xs: 'px-2.5 py-1 text-xs',
  sm: 'px-4 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3 text-base',
  xl: 'px-9 py-4 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  loading,
  children,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
