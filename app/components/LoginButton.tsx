"use client"; // Komponent będzie interaktywny po stronie klienta

import { FcGoogle } from "react-icons/fc";

export default function LoginButton() {
  const handleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return <button onClick={handleLogin}>Google</button>;
}
