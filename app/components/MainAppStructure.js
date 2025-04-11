"use client";

import { AppShell, Text, Button, Stack, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FcPlus } from "react-icons/fc";
import Header from "./Header";
import { useEffect } from "react";

export default function MainAppStructure({ children }) {
  const [opened, { toggle }] = useDisclosure();

  useEffect(() => {
    console.log(opened);
  }, [opened]);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: { base: 200 },
        breakpoint: "md",
        collapsed: { mobile: !opened, desktop: !opened },
      }}
      padding="md"
    >
      <Header />

      <AppShell.Navbar p="md">
        <Stack>
          <Burger opened={opened} onClick={toggle} size="sm" />
          <Text size="xl" fw={700} ta="center" mb="md">
            Project Chaos
          </Text>

          {/* Tutaj później dodamy listę projektów */}

          <Button fullWidth leftSection={<FcPlus size={14} />}>
            Nowy projekt
          </Button>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        <Burger opened={opened} onClick={toggle} size="sm" />

        {children}
      </AppShell.Main>
    </AppShell>
  );
}
