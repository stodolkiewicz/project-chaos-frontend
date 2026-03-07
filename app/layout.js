import { Toaster } from "sonner";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen items-center justify-center overflow-x-hidden">
        
        // for minimal tiptap
        <TooltipProvider>
          {children}
        </TooltipProvider>
        
        <Toaster duration={7500} />
      </body>
    </html>
  );
}
