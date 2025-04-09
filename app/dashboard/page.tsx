import { Container, Title, Stack } from "@mantine/core";

export default function Dashboard() {
  return (
    <Container size="xl" pt={20}>
      <Stack>
        <Title order={1}>Project Chaos</Title>
        {/* Tutaj później dodamy tablicę kanban */}
      </Stack>
    </Container>
  );
}
