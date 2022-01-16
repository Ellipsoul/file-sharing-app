import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface Props {
  children: any;
}

export default function Layout({ children }: Props) {
  return (
    <div className='
      flex flex-col min-h-screen w-full
      bg-slate-100 dark:bg-slate-800
      overflow-x-hidden overflow-y-auto'>
      <Navbar />
      <main className='grow border border-white'>
        {children}
      </main>
      <Footer />
    </div>
  );
}
