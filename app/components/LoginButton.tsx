"use client"; // Komponent będzie interaktywny po stronie klienta

import { Button } from "@mantine/core";
import { FcGoogle } from "react-icons/fc";

export default function LoginButton() {
  const handleLogin = () => {
    console.log("Logowanie przez Google...");
  };

  return (
    <Button
      color="blue"
      leftSection={<FcGoogle size={20} />}
      variant="outline"
      onClick={handleLogin}
    >
      Google
    </Button>
  );
}
