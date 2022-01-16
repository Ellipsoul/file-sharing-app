import "tailwindcss/tailwind.css";
import "../styles/globals.css";

import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";

import Layout from "../components/Layout";
import Metatags from "../components/Metatags";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    // Adding the class attibute and defaultTheme is essential for the theme to work
    <ThemeProvider attribute='class' defaultTheme='light'>
      <Metatags />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}

export default MyApp;
