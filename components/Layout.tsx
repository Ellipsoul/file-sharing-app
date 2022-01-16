import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface Props {
  children: any;
}

export default function Layout({ children }: Props) {
  return (
    <div className='flex flex-col min-h-screen w-full bg-amber-100 dark:bg-slate-800'>
      <Navbar />
      <main className='grow'>
        {children}
      </main>
      <Footer />
    </div>
  );
}
