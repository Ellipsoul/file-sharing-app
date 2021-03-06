import "tailwindcss/tailwind.css";
import "../styles/globals.css";

import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";

import Layout from "../components/Layout";
import Metatags from "../components/Metatags";

// Project root
function MyApp({ Component, pageProps }: AppProps) {
  return (
    // Adding the class attibute and defaultTheme is essential for the theme to work
    <ThemeProvider attribute='class' defaultTheme='light'>
      <Metatags />
      {/* Layout is injected here */}
      <Layout>
        <Component {...pageProps} />
      </Layout>
      {/* React hot toast with default stylings are set here */}
      <Toaster toastOptions={{
        position: "top-center",
        duration: 3000,
        style: {
          fontSize: "1rem",
          padding: "10px",
          fontFamily: "Roboto, sans-serif",
        },
      }}/>
    </ThemeProvider>
  );
}

export default MyApp;
