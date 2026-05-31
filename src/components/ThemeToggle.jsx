import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative p-2.5 rounded-xl transition-all duration-300 group
        bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted
        ${className}`}
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <div className="relative w-5 h-5 overflow-hidden">
        <div className={`absolute inset-0 transition-transform duration-500 flex items-center justify-center
          ${theme === 'dark' ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
        >
          <Sun size={18} className="group-hover:rotate-45 transition-transform duration-500" />
        </div>
        <div className={`absolute inset-0 transition-transform duration-500 flex items-center justify-center
          ${theme === 'dark' ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}
        >
          <Moon size={18} className="group-hover:-rotate-12 transition-transform duration-500" />
        </div>
      </div>
    </button>
  );
}
