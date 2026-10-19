"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "sonner";
import { useTheme } from "next-themes";

// Adds the "dark" class to <html> and remembers the chosen theme in localStorage
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem={false}>
      {children}
    </NextThemesProvider>
  );
}

// Sonner styles its toasts itself, so it gets the current theme explicitly
export function ThemedToaster() {
  const { resolvedTheme } = useTheme();
  return <Toaster duration={7500} theme={resolvedTheme === "dark" ? "dark" : "light"} />;
}
