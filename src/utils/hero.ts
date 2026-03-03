import { heroui } from "@heroui/react";
export default heroui({
  themes: {
    light: {
      colors: {
        background: "#fdfdfd",
        foreground: "#09090b",
        primary: {
          DEFAULT: "#2563eb",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#71717a",
          foreground: "#ffffff",
        },
        success: {
          DEFAULT: "#10b981",
          foreground: "#ffffff",
        },
        warning: {
          DEFAULT: "#f59e0b",
          foreground: "#ffffff",
        },
        danger: {
          DEFAULT: "#ef4444",
          foreground: "#ffffff",
        },
      },
    },
    dark: {
      colors: {
        background: "#09090b",
        foreground: "#fafafa",
        primary: {
          DEFAULT: "#3b82f6",
          foreground: "#ffffff",
        },
      },
    },
  },
});
