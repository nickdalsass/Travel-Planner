import { AspectRatio, Group, Paper, Skeleton, Stack } from '@mantine/core';
import { Suspense } from 'react';

const HomePage = () => {
  return (
    <Stack w={'100%'}>
      <AspectRatio ratio={16 / 9} flex={'0,0,100%'}>
        <Paper withBorder>
            Blah blah
        </Paper>
      </AspectRatio>
      <Group grow p='0' h={'100%'}>
        <Suspense fallback={<Skeleton w={'100%'} h={300} />}>
        </Suspense>
      </Group>
    </Stack>
  );
};
export default HomePage;