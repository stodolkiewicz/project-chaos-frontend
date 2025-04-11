import MainAppStructure from "../components/MainAppStructure";
import Navigation from "../components/MainAppStructure";
import { Container, Text } from "@mantine/core";

export default function Dashboard() {
  return (
    <MainAppStructure>
      <Container>
        <Text size="xl" fw={700} mb="md">
          Wybierz projekt z menu po lewej stronie
        </Text>
        {/* Tutaj później dodamy tablicę kanban */}
      </Container>
    </MainAppStructure>
  );
}
