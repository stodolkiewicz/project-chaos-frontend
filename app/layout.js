import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import ThemeProvider, { ThemedToaster } from "./providers/ThemeProvider";

export default function RootLayout({ children }) {
  return (
    // next-themes sets the theme class before React hydrates, so the attributes differ on purpose
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen items-center justify-center overflow-x-hidden">
        <ThemeProvider>
          <TooltipProvider>
            {children}
          </TooltipProvider>

          <ThemedToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
