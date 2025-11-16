import { Paper, Container, } from '@mantine/core';

/* BRIDGET THIS IS YOUR TEMPLATE FOR VIEWING, I WOULD RECOMMEND PULLING FROM THE 
DATABASE FOR EACH TRIP AND MAPPING IT ONTO SOME KIND OF CARD COMPONENT */

export default function CreatedTripsPage() {
  return (
    <Container size="lg" p={0} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Paper
        withBorder
        shadow="sm"
        radius="md"
        p="md"
        mb="md"
        style={{ flexShrink: 0 }}
      >
      </Paper>
    </Container>
  );
}