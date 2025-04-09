"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container, Title, Text, Stack, Loader } from "@mantine/core";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // Cookies są automatycznie zapisywane przez przeglądarkę
    // Przekierowujemy do dashboardu
    router.push("/dashboard");
  }, [router]);

  return (
    <Container size="xs" pt={100}>
      <Stack align="center" gap="xl">
        <Title order={2}>Logowanie...</Title>
        <Loader size="xl" />
        <Text c="dimmed">Trwa przekierowanie...</Text>
      </Stack>
    </Container>
  );
}
