import React, { ReactElement } from 'react';
import { useTheme } from 'next-themes';

export default function Navbar(): ReactElement {
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  const { theme, setTheme } = useTheme();

  return (
    <header className='bg-green-100 dark:bg-green-800'>
      Header
      <button onMouseDown={toggleTheme} className='testclass' suppressHydrationWarning>
        {theme}
      </button>
    </header>
  );
}
