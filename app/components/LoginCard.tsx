import LoginButton from "./LoginButton";
import { Card, Text, Title } from "@mantine/core";

export default function LoginCard() {
  return (
    <Card padding="xl" shadow="sm">
      <Title order={1} ta="center">
        Project Chaos
      </Title>
      <Text ta="center" mb="md">
        Continue with:
      </Text>
      <LoginButton />
    </Card>
  );
}
