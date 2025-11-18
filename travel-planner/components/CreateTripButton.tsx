"use client";

import { supabase } from "@/lib/supabase/client";
import { Button, Loader } from "@mantine/core";
import { User } from "@supabase/supabase-js";
import { LockKeyhole, Wrench } from "lucide-react";
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

  if (loading) {
    return (
      <Button size="lg" color="#b8626cff" w={180}>
        <Loader size={"sm"} color={"white"} />
      </Button>
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
  );
};
export default CreateTripButton;
