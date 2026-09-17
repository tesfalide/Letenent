import React, { createContext, useContext, useEffect, useState } from 'react';

export type AppTheme = 'black' | 'bright';

interface ThemeContextType {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;
  isBright: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<AppTheme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('letenent_theme');
      if (saved === 'bright' || saved === 'black') return saved;
    }
    return 'black';
  });

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('letenent_theme', newTheme);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'black' ? 'bright' : 'black');
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (theme === 'bright') {
        document.documentElement.classList.add('theme-bright');
        document.documentElement.classList.remove('theme-black', 'dark');
        document.body.classList.add('theme-bright');
        document.body.classList.remove('theme-black', 'dark');
        document.body.style.backgroundColor = '#f8fafc';
        document.body.style.color = '#0f172a';
      } else {
        document.documentElement.classList.add('theme-black', 'dark');
        document.documentElement.classList.remove('theme-bright');
        document.body.classList.add('theme-black', 'dark');
        document.body.classList.remove('theme-bright');
        document.body.style.backgroundColor = '#000000';
        document.body.style.color = '#ffffff';
      }
    }
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        isBright: theme === 'bright',
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
