import type { NextPage } from 'next';
import { useTheme } from 'next-themes';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';


const Home: NextPage = () => {
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  const { theme, setTheme } = useTheme();

  return (
    <div className='flex flex-col min-h-screen w-full bg-amber-100 dark:bg-slate-800'>
      <Navbar />
      <main>
        <h1 className='bg-blue-500 dark:bg-yellow-200'>Hi</h1>
        <button onMouseDown={toggleTheme} className='testclass' suppressHydrationWarning>
          {theme}
        </button>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
