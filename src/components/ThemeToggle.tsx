import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

function initialLightMode() {
  try {
    const stored = localStorage.getItem('credwise-theme');
    if (stored === 'light') return true;
    if (stored === 'dark') return false;
  } catch {
    // Fall through to the document class.
  }
  return document.documentElement.classList.contains('light');
}

export default function ThemeToggle() {
  const [light, setLight] = useState(initialLightMode);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('light', light);
    root.classList.toggle('dark', !light);
    root.setAttribute('data-theme', light ? 'light' : 'dark');

    try {
      localStorage.setItem('credwise-theme', light ? 'light' : 'dark');
    } catch {
      // Theme still applies for this session even if storage is unavailable.
    }
  }, [light]);

  return (
    <button
      type="button"
      onClick={() => setLight((current) => !current)}
      aria-label={light ? 'Switch to dark mode' : 'Switch to light mode'}
      aria-pressed={light}
      className="p-2 rounded-lg text-dark-300 hover:text-white hover:bg-white/5 transition-colors"
    >
      {light ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
    </button>
  );
}
