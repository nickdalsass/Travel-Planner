"use client";

import {
  Paper,
  Title,
  Text,
  Stack,
  Center,
  Loader,
  Button,
} from "@mantine/core";
import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { Home, User2 } from "lucide-react";

const ViewAccountPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [numTrips, setNumTrips] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { count, error } = await supabase
          .from("TRIPS")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);

        if (error) {
          console.error(
            "Error fetching the number of trips. Please refresh page."
          );
        }
        setNumTrips(count || 0);
      }

      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Center>
        <Loader mt={"35vh"} size={"xl"} color={"white"} />
      </Center>
    );
  }

  if (!user) {
    return <Text>Please sign in to view account details.</Text>;
  }

  //convert the format with the helpful Date object and its interface
  const accountCreationDate = new Date(user.created_at).toLocaleDateString();
  const accountLifetime = (
    (new Date().getTime() - new Date(user.created_at).getTime()) /
    (1000 * 60 * 60 * 24)
  ).toFixed(1);

  return (
    <Center mt={"20vh"}>
      <Paper p={"xl"} shadow={"xl"} w={"50%"} withBorder>
        <Stack align="center" gap={"md"}>
          <Title mb="md">
            <User2 /> Account Details:
          </Title>
          <Paper w="85%" withBorder shadow={"xl"} p={"sm"}>
            <Text>
              <i>
                <strong>Username:</strong>
              </i>{" "}
              {user.user_metadata.display_name}
            </Text>
            <Text>
              <i>
                <strong>Email:</strong>
              </i>{" "}
              {user.email}
            </Text>
            <Text>
              <i>
                <strong>Account Creation Date:</strong>
              </i>{" "}
              {accountCreationDate}
            </Text>
            <Text>
              <i>
                <strong>Account Lifetime:</strong>
              </i>{" "}
              {accountLifetime} day(s)
            </Text>
            <Text>
              <i>
                <strong>Number of Created Trips:</strong>
              </i>{" "}
              {numTrips}
            </Text>
          </Paper>
          <Button
            leftSection={<Home />}
            onClick={() => (window.location.href = "/")}
            color="#b8626cff"
          >
            Go Home
          </Button>
        </Stack>
      </Paper>
    </Center>
  );
};
export default ViewAccountPage;
