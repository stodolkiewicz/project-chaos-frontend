"use client";

import { AppShell, Burger, Text, Group, Avatar, Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FcBusinessman, FcLeave } from "react-icons/fc";

export default function Header({ opened, toggle }) {
  return (
    <AppShell.Header>
      <Group h="100%" px="md">
        {/* <Burger opened={opened} onClick={toggle} size="sm" /> */}
        <Text size="xl" fw={700}>
          Project Chaos
        </Text>
        <Group justify="flex-end" style={{ flex: 1 }}>
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Avatar color="blue" radius="xl" style={{ cursor: "pointer" }}>
                <FcBusinessman size={20} />
              </Avatar>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<FcLeave size={14} />}>
                Wyloguj się
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
    </AppShell.Header>
  );
}
