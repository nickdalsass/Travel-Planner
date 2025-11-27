"use client"

import { Paper, Container, } from '@mantine/core';
import { supabase } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';

/* BRIDGET THIS IS YOUR TEMPLATE FOR VIEWING, I WOULD RECOMMEND PULLING FROM THE 
DATABASE FOR EACH TRIP AND MAPPING IT ONTO SOME KIND OF CARD COMPONENT */

export default function CreatedTripsPage() {
  const [trips, setTrips] = useState([]);
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
        .select("*")
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
    if(user){
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
      </Paper>
    </Container>
  );
}