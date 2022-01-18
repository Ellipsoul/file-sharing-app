module.exports = {
  mode: "jit",
  darkMode: "class",
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
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
        128: "32rem",
        144: "36rem",
        "9/20": "45%",
      },
      minHeight: {
        48: "12rem",
      },
      flexGrow: {
        2: 2,
      },
    },
  },
  plugins: [],
};
