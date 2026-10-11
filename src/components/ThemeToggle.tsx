import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const [light, setLight] = useState(() => localStorage.getItem('credwise-theme') === 'light');

  useEffect(() => {
    document.documentElement.classList.toggle('light', light);
    localStorage.setItem('credwise-theme', light ? 'light' : 'dark');
  }, [light]);

  return (
    <button
      onClick={() => setLight((v) => !v)}
      aria-label={light ? 'Switch to dark mode' : 'Switch to light mode'}
      className="p-2 rounded-lg text-dark-300 hover:text-white hover:bg-white/5 transition-colors"
    >
      {light ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
    </button>
  );
}
