/** @type {import('tailwindcss').Config} */
import { nextui } from "@nextui-org/react";

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        heroBg: "url('/assets/hero.jpeg')",
      },
      colors: {
        primary: "var(--primary)",
        "primary-content": "var(--primary-content)",
        "primary-dark": "var(--primary-dark)",
        "primary-light": "var(--primary-light)",

        secondary: "var(--secondary)",
        "secondary-content": "var(--secondary-content)",
        "secondary-dark": "var(--secondary-dark)",
        "secondary-light": "var(--secondary-light)",

        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",

        copy: "var(--copy)",
        "copy-light": "var(--copy-light)",
        "copy-lighter": "var(--copy-lighter)",

        success: "var(--success)",
        warning: "var(--warning)",
        error: "var(--error)",

        "success-content": "var(--success-content)",
        "warning-content": "var(--warning-content)",
        "error-content": "var(--error-content)",
      },
      animation: {
        wave: "wave 55s linear infinite",
        wave2: "wave 50s linear infinite",
        wave3: "wave 45s linear infinite",
      },
      keyframes: {
        wave: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
