"use client"

import { Container, Button, Title, Paper, Stack, TextInput } from '@mantine/core';
import { supabase } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
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


    useEffect(() => {
        const getTrip = async () => {
            const { data, error } = await supabase
                .from("TRIPS")
                .select("*")
                .eq("id", id)
                .single();
            if (error) {
                console.error("Error fetching trip:", error);
                return;
            };
            if (data) {
                setTrip({
                    trip_name: data.trip_name || "",
                    trip_location: data.trip_location || "",
                    trip_start: data.trip_start || "",
                    trip_end: data.trip_end || "",
                });
            }
        };

        if (id) {
            getTrip();
        }
    }, [id]);

    const updateTrip = async () => {
        const { error } = await supabase
            .from("TRIPS")
            .update(trip)
            .eq("id", id);

        if (!error) {
            router.push("/created-trips");
        } else {
            console.error(error);
        }
    };
   
};
