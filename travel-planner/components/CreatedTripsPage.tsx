"use client";

import {
  Paper,
  Container,
  Card,
  Text,
  Stack,
  Accordion,
  Loader,
  Center,
  Button,
} from "@mantine/core";
import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { jsPDF } from "jsPDF";

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
  const [userLoading, setUserLoading] = useState(true);
  const [tripsLoading, setTripsLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setUserLoading(false);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!user) return;

    const getTrips = async () => {
      const { data, error } = await supabase
        .from("TRIPS")
        .select(
          `
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

  `
        )
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching trips:", error);
      } else {
        setTrips(data);
        setTripsLoading(false);
      }
    };

    getTrips();
  }, [user]);

  if (tripsLoading) {
    return (
      <Center mt={"xl"}>
        <Loader size="xl" color="white"/>;
      </Center>
    ); 

  }


  //Generate PDF of trip 
  const downloadTripPDF = (trip: Trip) => {
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(16);
    doc.text("Trip Name: " + (trip.trip_name ?? "N/A"), 20, y); 
    y += 12;

    doc.setFontSize(12);
    doc.text("Destination: " + (trip.trip_location ?? "N/A"), 20, y); 
    y += 6;
    doc.text("Start: " + (trip.trip_start ?? "N/A"), 20, y); 
    y += 6;
    doc.text("End: " + (trip.trip_end ?? "N/A"), 20, y); 
    y += 14;


    // Transportation
    doc.text("Transportation", 20, y);
    y += 8;

    if (trip.TRANSPORTATION?.length) {
      trip.TRANSPORTATION.forEach((t) => {
        doc.text("Type: " + (t.transp_type ?? "N/A"), 20, y); 
        y += 6;
        doc.text("Company: " + (t.transp_company ?? "N/A"), 20, y); 
        y += 6;
        doc.text("Departure: " + (t.transp_departure ?? "N/A"), 20, y); 
        y += 6;
        doc.text("Arrival: " + (t.transp_arrival ?? "N/A"), 20, y); 
        y += 6;
        doc.text("Confirmation: " + (t.confirmation_num ?? "N/A"), 20, y); 
       y += 14;
      });
    } else {
      doc.text("None", 20, y); y += 10;
    }

    // Accommodations
    doc.text("Accommodations", 20, y);
    y += 8;

    if (trip.ACCOMMODATIONS?.length) {
      trip.ACCOMMODATIONS.forEach((a) => {
        doc.text("Type: " + (a.accom_type ?? "N/A"), 20, y); 
        y += 6;
        doc.text("Address: " + (a.accom_address ?? "N/A"), 20, y); 
        y += 6;
        doc.text("Check-in: " + (a.accom_checkin ?? "N/A"), 20, y); 
        y += 6;
        doc.text("Check-out: " + (a.accom_checkout ?? "N/A"), 20, y); 
        y += 6;
        doc.text("Confirmation: " + (a.confirmation_num ?? "N/A"), 20, y); 
        y += 14;
      });
    } else {
      doc.text("None", 20, y); y += 10;
    }

    // Itinerary
    doc.text("Itinerary", 20, y);
    y += 8;

    if (trip.ITINERARY && trip.ITINERARY[0]?.itin_steps?.length) {
      trip.ITINERARY[0].itin_steps.forEach((step, i) => {
        doc.text((i + 1) + ". " + step, 20, y);
        y += 6;
      });
    } else {
      doc.text("None", 20, y);
    }

    // Save the PDF
    doc.save((trip.trip_name ?? "trip") + ".pdf");
  };

  return (
    <Container
      size="lg"
      p={0}
      style={{ flex: 1, display: "flex", flexDirection: "column" }}
    >
      <Paper
        withBorder
        shadow="sm"
        radius="md"
        p="md"
        mb="md"
        style={{ flexShrink: 0 }}
      >
        <Text className="tripPage">Created Trips</Text>
      </Paper>

      <Stack gap={16}>
        {trips.map((trip) => {
          console.log("Fetched trip:", trip);
          console.log("Transportation:", trip.TRANSPORTATION);

          return (
            <Card key={trip.id} withBorder p="lg">
              <Button
                color="blue"
                mb="md"
                onClick={() => downloadTripPDF(trip)}
                >
                </Button>
              <Accordion variant="separated" chevronPosition="right">
                <Accordion.Item value="trip-details">
                  <Accordion.Control>
                    <Text fw={600} size="lg">
                      {trip.trip_name}
                    </Text>
                  </Accordion.Control>

                  <Accordion.Panel>
                    <Text size="sm" c="dimmed">
                      Destination: {trip.trip_location}
                    </Text>
                    <Text size="sm">Start: {trip.trip_start}</Text>
                    <Text size="sm">End: {trip.trip_end}</Text>

                    {/* Transportation Section */}
                    <Text size="sm" fw={500} mt="md">
                      Transportation
                    </Text>
                    {trip.TRANSPORTATION?.length > 0 ? (
                      trip.TRANSPORTATION.map((t) => (
                        <div key={t.id} style={{ marginBottom: "8px" }}>
                          <Text size="sm">Type: {t.transp_type}</Text>
                          <Text size="sm">Company: {t.transp_company}</Text>
                          <Text size="sm">Departure: {t.transp_departure}</Text>
                          <Text size="sm">Arrival: {t.transp_arrival}</Text>
                          <Text size="sm">
                            Confirmation Number: {t.confirmation_num}
                          </Text>
                          <Text size="sm">Departure: {t.transp_departure}</Text>
                        </div>
                      ))
                    ) : (
                      <Text size="sm">No transportation added yet.</Text>
                    )}

                    {/*Accomodations Section */}
                    <Text size="sm" fw={500} mt="md">
                      Accommodations
                    </Text>

                    {trip.ACCOMMODATIONS?.length > 0 ? (
                      trip.ACCOMMODATIONS.map((a) => (
                        <div key={a.id} style={{ marginBottom: "8px" }}>
                          <Text size="sm">Type: {a.accom_type}</Text>
                          <Text size="sm">Address: {a.accom_address}</Text>
                          <Text size="sm">Check-in: {a.accom_checkin}</Text>
                          <Text size="sm">Check-out: {a.accom_checkout}</Text>
                          {a.confirmation_num && (
                            <Text size="sm">
                              Confirmation #: {a.confirmation_num}
                            </Text>
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
                    <Text size="sm" fw={500} mt="md">
                      Itinerary
                    </Text>

                    {trip.ITINERARY &&
                    trip.ITINERARY.length > 0 &&
                    trip.ITINERARY[0].itin_steps?.length > 0 ? (
                      <ul style={{ paddingLeft: "20px", marginTop: "8px" }}>
                        {trip.ITINERARY[0].itin_steps.map((step, index) => (
                          <li key={index}>
                            <Text size="sm">{step}</Text>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <Text size="sm">No itinerary added yet.</Text>
                    )}
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            </Card>
          );
        })}
      </Stack>
    </Container>
  );
}
