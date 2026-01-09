import { Battery, Power, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function Navbar() {
  const { theme, setTheme } = useTheme();
  
  return (
    <nav className="h-16 bg-background border-b border-border flex items-center justify-between px-6 backdrop-blur-xl bg-opacity-80">
      <div className="flex items-center gap-3">
        <Battery className="w-6 h-6 text-primary" />
        <h1 className="text-lg tracking-wide font-medium">EV BATTERY MANAGEMENT SYSTEM</h1>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="text-sm text-muted-foreground uppercase tracking-wider">System Active</span>
        </div>
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 hover:bg-accent rounded-lg transition-colors"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-muted-foreground" />
          ) : (
            <Moon className="w-5 h-5 text-muted-foreground" />
          )}
        </button>
        <Power className="w-5 h-5 text-muted-foreground" />
      </div>
    </nav>
  );
}