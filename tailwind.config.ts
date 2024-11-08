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
        background: "#ffffff",
        bgAzul: "#101242",
        bgAmarillo: "#eec200",
        textGray: "#6b7280",
        textBlack: "#000000",
      },
    },
  },
  plugins: [],
};
export default config;
