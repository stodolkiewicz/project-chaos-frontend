import { Container, Stack } from "@mantine/core";
import LoginButton from "./components/LoginButton";
import LoginCard from "./components/LoginCard";

export default function Home() {
  return (
    <Container size="xs" pt={100}>
      <Stack align="center" gap="xl">
        <LoginCard />
      </Stack>
    </Container>
  );
}
