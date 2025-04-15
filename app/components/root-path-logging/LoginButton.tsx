"use client"; // Komponent będzie interaktywny po stronie klienta

import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";

export default function LoginButton() {
  const handleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <Button
      variant="outline"
      onClick={handleLogin}
      className="w-full flex items-center justify-center gap-2 bg-white text-gray-900 hover:bg-gray-100"
    >
      <FcGoogle className="w-5 h-5" />
      <span>Continue with Google</span>
    </Button>
  );
}
