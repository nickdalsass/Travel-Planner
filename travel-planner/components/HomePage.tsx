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
    <Stack w={"100%"}>
      <AspectRatio ratio={16 / 9}>
        <Paper withBorder>
          {/* This is just a placeholder button */}
          <Anchor href="/trip">
            <Button>Create a Trip</Button>
          </Anchor>
        </Paper>
      </AspectRatio>
      <Group grow p="0" h={"100%"}>
        <Suspense fallback={<Skeleton w={"100%"} h={300} />}></Suspense>
      </Group>
    </Stack>
  );
};
export default HomePage;
