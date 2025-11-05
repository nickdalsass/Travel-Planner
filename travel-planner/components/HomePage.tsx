import { AspectRatio, Group, Paper, Skeleton, Stack } from "@mantine/core";
import { Suspense } from "react";
import './styles.css';

const HomePage = () => {
  return (
    <Stack  w={"100%"}>
      
      <Paper className="homePageBlerb">
         Travel Planner is a new way for travelers to keep
          track of trips, and an itinerary and travel info by trip
      </Paper>
      <AspectRatio ratio={16 / 9} >
        <Paper className="homePage"  withBorder>
          Trips
          <Paper>
            info about trips along with images maybe?
          </Paper>
        </Paper>
      </AspectRatio>
      <AspectRatio ratio={16 / 9}>
        <Paper className="homePage" withBorder>
          Itinerary
          <Paper>
            info about Itinerary along with images maybe?
          </Paper>
        </Paper>
      </AspectRatio>
      <AspectRatio ratio={16 / 9}>
        <Paper className="homePage" withBorder>
          Travel
          <Paper>
            info about Travel along with images maybe?
          </Paper>
        </Paper>
      </AspectRatio>
      <Group grow p="0" h={"100%"}>
        <Suspense fallback={<Skeleton w={"100%"} h={300} />}></Suspense>
      </Group>
    </Stack>
  );
};
export default HomePage;
