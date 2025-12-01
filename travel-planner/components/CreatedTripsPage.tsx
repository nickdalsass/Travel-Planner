"use client"

import { Paper, Container, Card, Text, Group, Stack, Accordion } from '@mantine/core';
import { supabase } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';

/* BRIDGET THIS IS YOUR TEMPLATE FOR VIEWING, I WOULD RECOMMEND PULLING FROM THE 
DATABASE FOR EACH TRIP AND MAPPING IT ONTO SOME KIND OF CARD COMPONENT */


type Transportation = {
  id: number;
  transp_type: string;
  transp_company: string;
  transp_departure: string;
};

type Trip = {
  id: number;
  trip_name: string;
  trip_location: string;
  trip_start: string;
  trip_end: string;

  TRANSPORTATION?: Transportation[];
};
export default function CreatedTripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    if (!user) return;

    const getTrips = async () => {
      const { data, error } = await supabase
        .from("TRIPS")
        .select(`
    *,
    TRANSPORTATION (
      id,
      transp_type,
      transp_company,
      transp_departure
    )
  `)
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching trips:", error);
      } else {
        setTrips(data);
      }
    };

    getTrips();
  }, [user]);
  //validation of user

  useEffect(() => {
    console.log("User:", user?.id);
    console.log("Trips:", trips);
  }, [user, trips]);
  const getTrips = async () => {
    if (user) {
      const { data, error } = await supabase
        .from("TRIPS")
        .select('*')
        .eq('user_id', user.id)

      return data;
    }
  }

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
        <Text size="xl" fw={600}>Your Trips</Text>
      </Paper>

      <Stack gap={16}>
        {trips.map((trip) => (
          <Card key={trip.id} withBorder p="lg">
            <Accordion variant="separated" chevronPosition="right">
              <Accordion.Item value="trip-details">
                <Accordion.Control>
                  <Text fw={600} size="lg">
                    {trip.trip_name}
                  </Text>
                </Accordion.Control>

                <Accordion.Panel>
                  <Text size="sm" c="dimmed">Destination: {trip.trip_location}</Text>
                  <Text size="sm">Start: {trip.trip_start}</Text>
                  <Text size="sm">End: {trip.trip_end}</Text>

                  {/* Transportation Section */}
                  <Text size="sm" fw={500} mt="md">Transportation</Text>
                  {trip.TRANSPORTATION?.length > 0 ? (
                    trip.TRANSPORTATION.map((t) => (
                      <div key={t.id} style={{ marginBottom: "8px" }}>
                        <Text size="sm">Type: {t.transp_type}</Text>
                        <Text size="sm">Company: {t.transp_company}</Text>
                        <Text size="sm">Departure: {t.transp_departure}</Text>
                      </div>
                    ))
                  ) : (
                    <Text size="sm">No transportation added yet.</Text>
                  )}

                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </Card>
        ))}
      </Stack>
    </Container>
  );
}