import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // Habilitar modo oscuro por clases
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

        hoverTable: "#f6faff",
        hoverTableDark: "#0f1a2b",

        bagroundDark: "#0a0d1e",
        borderDark: "#141833",

        tableDark: "#080b1a",
      },
    },
  },
  plugins: [],
};

export default config;
