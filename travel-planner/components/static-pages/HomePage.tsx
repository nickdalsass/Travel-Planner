import { Group, Paper, Stack, Container, Title } from '@mantine/core';
import ImageDisplay from '../ImageDisplay';
import CreateTripButton from '../CreateTripButton';

export default function HomePage() {
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
        <Group justify="center">
          <CreateTripButton />
        </Group>
      </Paper>

      <Stack>
        <Title className='typewriter'>Sign In To Start Your Adventure...</Title>
        <ImageDisplay />
      </Stack>
    </Container>
  );
}