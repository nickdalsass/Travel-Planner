"use client";


import { Container, Button, Title, Paper, Stack, TextInput } from '@mantine/core';
import { supabase } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from "next/navigation";


export default function EditTripsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [trip, setTrip] = useState({
    trip_name: "",
    trip_location: "",
    trip_start: "",
    trip_end: "",
  });

  // Load trip details
  useEffect(() => {
    const getTrip = async () => {
      const { data, error } = await supabase
        .from("TRIPS")
        .select("*")
        .eq("id", Number(id))   // <-- FIXED
        .single();

      if (error) {
        console.error("Error fetching trip:", error);
        return;
      }

      if (data) {
        setTrip({
          trip_name: data.trip_name || "",
          trip_location: data.trip_location || "",
          trip_start: data.trip_start || "",
          trip_end: data.trip_end || "",
        });
      }
    };

    if (id) getTrip();
  }, [id]);



  // Update trip
  const updateTrip = async () => {
    const { error } = await supabase
      .from("TRIPS")
      .update({
        trip_name: trip.trip_name,
        trip_location: trip.trip_location,
        trip_start: trip.trip_start,
        trip_end: trip.trip_end,
      })
      .eq("id", Number(id));   // <-- FIXED

    if (error) {
      console.error("Update error:", error);
      return;
    }

    router.push("/created-trips");
  };
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
                <Title order={3} mb="lg">Edit Trip</Title>

                <Stack>
                    <TextInput
                        label="Trip Name"
                        value={trip.trip_name}
                        onChange={(e) => setTrip({ ...trip, trip_name: e.target.value })}
                    />

                    <TextInput
                        label="Location"
                        value={trip.trip_location}
                        onChange={(e) => setTrip({ ...trip, trip_location: e.target.value })}
                    />

                    <TextInput
                        label="Start Date"
                        type="date"
                        value={trip.trip_start}
                        onChange={(e) => setTrip({ ...trip, trip_start: e.target.value })}
                    />

                    <TextInput
                        label="End Date"
                        type="date"
                        value={trip.trip_end}
                        onChange={(e) => setTrip({ ...trip, trip_end: e.target.value })}
                    />

                    <Button color="#b8626cff" onClick={updateTrip}>Save Changes</Button>
                </Stack>
            </Paper>
        </Container>
    );
};

