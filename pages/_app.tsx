import "tailwindcss/tailwind.css";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";

// Seems like CSS classes can't be scoped, but we can organise them here
import "../styles/navbar.css";
import "../styles/dashboard.css";
import "../styles/footer.css";

import Layout from "../components/Layout";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    // Adding the class attibute and defaultTheme is essential for the theme to work
    <ThemeProvider attribute='class' defaultTheme='light'>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}

export default MyApp;
