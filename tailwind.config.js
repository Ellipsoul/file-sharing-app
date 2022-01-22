module.exports = {
  mode: "jit",
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./components/Navbar_Components/**/*.{js,ts,jsx,tsx}",
    "./components/App_Components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        title: ["Luminari"],
        slogan: ["'Lucida Console'", "monospace"],
        heading: ["'American Typewriter'", "serif"],
      },
      screens: {
        tiny: "475px",
      },
      spacing: {
        114: "28rem",
        "9/20": "45%",
        custom: "83vh",
      },
      minHeight: {
        48: "12rem",
      },
      flexGrow: {
        2: 2,
      },
    },
  },
  plugins: ["postcss-import", "tailwindcss", "autoprefixer"],
};
