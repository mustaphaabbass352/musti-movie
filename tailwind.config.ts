import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#141414",
        primary: "#E50914",
      },
      backgroundImage: {
        "gradient-to-b": "linear-gradient(to bottom, rgba(20,20,20,0) 0, rgba(20,20,20,1) 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
