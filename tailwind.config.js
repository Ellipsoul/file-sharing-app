module.exports = {
  mode: "jit",
  darkMode: "class",
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        title: ["Luminari"],
        slogan: ["'Lucida Console'", "monospace"],
      },
    },
  },
  plugins: [],
};
