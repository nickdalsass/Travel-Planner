import {
  Anchor,
  Button,
  Group,
  Paper,
  Skeleton,
  Stack,
} from "@mantine/core";
import { Suspense } from "react";
import "./styles.css";
import ImageDisplay from "./ImageDisplay";

const HomePage = () => {
  return (
    <div style={{ height: "100vh", overflowY: "auto" }}>
      <Stack w={"100%"} p="md">
        <Paper
          withBorder
          shadow={"md"}
          radius={"md"}
          h={"auto"}
          p="md"
          style={{ borderColor: "grey" }}
        >
          <Group justify="center" h="100%">
            <Stack align="center">
              <Anchor href="/trip">
                <Button size="lg">Create a Trip</Button>
              </Anchor>
            </Stack>
          </Group>
          
        </Paper>
        <ImageDisplay />
        <Group grow p="0" h={"100%"}>
          <Suspense fallback={<Skeleton w={"100%"} h={300} />}></Suspense>
        </Group>
      </Stack>
    </div>
  );
};
export default HomePage;
