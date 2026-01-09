interface SystemBannerProps {
  text: string;
  isConnected: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function SystemBanner({ text, isConnected, size = 'sm' }: SystemBannerProps) {
  const sizeClasses = {
    sm: 'py-1 text-xs',
    md: 'py-2 text-sm',
    lg: 'py-3 text-base',
  };

  return (
    <div
      className={`w-full text-center font-medium uppercase tracking-wider transition-all duration-300 ${
        sizeClasses[size]
      } ${
        isConnected
          ? 'bg-orange-500 text-white'
          : 'bg-muted/50 text-muted-foreground'
      }`}
    >
      {isConnected ? text : 'Disconnected'}
    </div>
  );
}
