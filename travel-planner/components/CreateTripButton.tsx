"use client";

import { supabase } from "@/lib/supabase/client";
import { Button, Loader, Group } from "@mantine/core";
import { User } from "@supabase/supabase-js";
import { LockKeyhole, Wrench, ScanSearch, Earth } from "lucide-react";
import { useEffect, useState } from "react";

const CreateTripButton = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // very similar state handling login to profile button
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();
  }, []);

  if (loading) {//add loading animation toa ll the buttons to make it look unified
    return (
      <Group gap={"5vh"}>
        <Button size="lg" color="#b8626cff" miw={140}>
          <Loader size={"sm"} color={"white"} />
        </Button>
        <Button size="lg" color="#b8626cff" miw={140}>
          <Loader size={"sm"} color={"white"} />
        </Button>
        <Button size="lg" color="#b8626cff" miw={140}>
          <Loader size={"sm"} color={"white"} />
        </Button>
      </Group>
    );
  }

  if (!user) {
    return (
      <Button
        component="a"
        href="/login"
        size="lg"
        color="#b8626cff"
        leftSection={<LockKeyhole />}
      >
        Login to Create a Trip
      </Button>
    );
  }

  return (
    <Group gap={"5vh"}>
      <Button
        component="a"
        href="/trip"
        size="lg"
        color="#b8626cff"
        draggable="false"
        leftSection={<Wrench />}
      >
        Create a Trip
      </Button>
      <Button size="lg" leftSection={<ScanSearch />} component='a' href="/tripview" color="#b8626cff">View Trips</Button>
      <Button size="lg" leftSection={<Earth />} component='a' href="/share-trip" color="#b8626cff">Share Trip</Button>
    </Group>
  );
};
export default CreateTripButton;
