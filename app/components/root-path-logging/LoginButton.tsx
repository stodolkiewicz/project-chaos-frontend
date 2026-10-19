"use client"; // Komponent będzie interaktywny po stronie klienta

import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { API_CONFIG } from "@/lib/apiConfig";

export default function LoginButton() {
  const handleLogin = () => {
    window.location.href = API_CONFIG.oauthRedirectUrl;
  };

  return (
    <Button
      variant="outline"
      onClick={handleLogin}
      className="w-full flex items-center justify-center gap-2 bg-panel text-foreground hover:bg-muted"
    >
      <FcGoogle className="w-5 h-5" />
      <span>Continue with Google</span>
    </Button>
  );
}
