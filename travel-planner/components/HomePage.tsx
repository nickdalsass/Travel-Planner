import {
  Anchor,
  AspectRatio,
  Button,
  Group,
  Paper,
  Skeleton,
  Stack,
} from "@mantine/core";
import { Suspense } from "react";

const HomePage = () => {
  return (
    <div style={{ height: '100vh', overflowY: 'auto' }}>
      <Stack w={"100%"} p="md">
        <AspectRatio ratio={16 / 9}>
          <Paper withBorder p="md">
            <Group justify="center" h="100%">
              <Anchor href="/trip">
                <Button size="lg">Create a Trip</Button>
              </Anchor>
            </Group>
          </Paper>
        </AspectRatio>
        <Group grow p="0" h={"100%"}>
          <Suspense fallback={<Skeleton w={"100%"} h={300} />}></Suspense>
        </Group>
      </Stack>
    </div>
  );
};
export default HomePage;
