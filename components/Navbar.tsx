import React, { ReactElement } from 'react';
import { useTheme } from 'next-themes';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';

export default function Navbar(): ReactElement {
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  const { theme, setTheme } = useTheme();

  return (
    <AppBar position="static" className="
      flex flex-row items-center justify-evenly
      h-20 bg-purple-300 dark:bg-purple-800
    ">
      <Button variant="contained" className='bg-gray-300' onClick={toggleTheme}>
        Toggle Theme
      </Button>
      <div>{theme}</div>
    </AppBar>
  );
}
