import { Group, Button, Paper, Stack, Anchor, Skeleton, Container } from '@mantine/core';
import { Suspense } from 'react';
import ImageDisplay from './ImageDisplay';

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
          <Anchor href="/trip">
            <Button size="lg">Create a Trip</Button>
          </Anchor>
        </Group>
      </Paper>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <Stack>
          <ImageDisplay />
        </Stack>
      </div>
    </Container>
  );
}