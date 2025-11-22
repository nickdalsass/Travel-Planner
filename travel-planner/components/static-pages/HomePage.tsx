"use client";

import { Group, Paper, Stack, Container, Title } from '@mantine/core';
import ImageDisplay from '../ImageDisplay';
import CreateTripButton from '../CreateTripButton';
import {supabase} from "@/lib/supabase/client";
import {useEffect, useState} from 'react';
import { User } from "@supabase/supabase-js";

export default function HomePage() {

  //ensuring "Sign in to start you adventure" only shows up when not logged in
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async ()=>{
      const{
        data: {user},
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();
  },[]);

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
          {!loading && !user && (
          <Title className='typewriter'>Sign In To Start Your Adventure...</Title>
          )}
          <ImageDisplay />
        </Stack>

    </Container>
  );
}

