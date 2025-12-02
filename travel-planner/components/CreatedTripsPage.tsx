"use client"

import { Button, Paper, Container, Card, Text, Group, Stack, Accordion } from '@mantine/core';
import { supabase } from '@/lib/supabase/client';
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import router from 'next/router';

/* BRIDGET THIS IS YOUR TEMPLATE FOR VIEWING, I WOULD RECOMMEND PULLING FROM THE 
DATABASE FOR EACH TRIP AND MAPPING IT ONTO SOME KIND OF CARD COMPONENT */


type Transportation = {
  id: number;
  transp_type: string;
  transp_company: string;
  transp_departure: string;
  transp_arrival: string;
  confirmation_num: string;
};
type Accommodation = {
  id: number;
  accom_type: string;
  accom_address: string;
  accom_checkin: string;
  accom_checkout: string;
  confirmation_num: string;
  accom_description: string;
};
type Itinerary = {
  id: number;
  itin_steps: string;
};

type Trip = {
  id: number;
  trip_name: string;
  trip_location: string;
  trip_start: string;
  trip_end: string;

  TRANSPORTATION?: Transportation[];
  ACCOMMODATIONS?: Accommodation[];
  ITINERARY?: Itinerary[];
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
    TRANSPORTATION: "TRANSPORTATION" (
      id,
      transp_type,
      transp_company,
      transp_departure,
      transp_arrival,
      confirmation_num,
      trip_id
    ),
     ACCOMMODATIONS: "ACCOMMODATIONS" (
      id,
      accom_type,
      accom_address,
      accom_checkin,
      accom_checkout,
      confirmation_num,
      accom_description,
      trip_id
    ),

    ITINERARY: "ITINERARY" (
     id,
     itin_steps,
     trip_id
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
        <Text className="tripPage" >Created Trips</Text>
      </Paper>

      <Stack gap={16}>
        {trips.map((trip) => {
          console.log("Fetched trip:", trip);
          console.log("Transportation:", trip.TRANSPORTATION);

          return (
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
                          <Text size="sm">Arrival: {t.transp_arrival}</Text>
                          <Text size="sm">Confirmation Number: {t.confirmation_num}</Text>
                          <Text size="sm">Departure: {t.transp_departure}</Text>
                        </div>
                      ))
                    ) : (
                      <Text size="sm">No transportation added yet.</Text>
                    )}

                    {/*Accomodations Section */}
                    <Text size="sm" fw={500} mt="md">Accommodations</Text>

                    {trip.ACCOMMODATIONS?.length > 0 ? (
                      trip.ACCOMMODATIONS.map((a) => (
                        <div key={a.id} style={{ marginBottom: "8px" }}>
                          <Text size="sm">Type: {a.accom_type}</Text>
                          <Text size="sm">Address: {a.accom_address}</Text>
                          <Text size="sm">Check-in: {a.accom_checkin}</Text>
                          <Text size="sm">Check-out: {a.accom_checkout}</Text>
                          {a.confirmation_num && (
                            <Text size="sm">Confirmation #: {a.confirmation_num}</Text>
                          )}
                          {a.accom_description && (
                            <Text size="sm">Notes: {a.accom_description}</Text>
                          )}
                        </div>
                      ))
                    ) : (
                      <Text size="sm">No accommodations added yet.</Text>
                    )}

                    {/*Itinerary Section */}
                    {/* Itinerary Section */}
                    <Text size="sm" fw={500} mt="md">Itinerary</Text>

                    {trip.ITINERARY && trip.ITINERARY.length > 0 && trip.ITINERARY[0].itin_steps?.length > 0 ? (
                      <ul style={{ paddingLeft: "20px", marginTop: "8px" }}>
                        {trip.ITINERARY[0].itin_steps.map((step: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined, index: Key | null | undefined) => (
                          <li key={index}>
                            <Text size="sm">{step}</Text>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <Text size="sm">No itinerary added yet.</Text>
                    )}
                    <Button
                      mt="md"
                      variant="light"
                      onClick={() => router.push(`/edit-trip/${trip.id}`)}
                    >
                      Edit Trip
                    </Button>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            </Card>
          )
        })}
      </Stack>
    </Container>
  );
}