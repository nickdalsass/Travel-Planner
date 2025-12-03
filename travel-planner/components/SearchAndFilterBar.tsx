"use client";

import { supabase } from "@/lib/supabase/client";
import { Autocomplete, Group } from "@mantine/core";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

type SearchAndFilterBarProps = {
  user: { id: string } | null;
  nameValue: string;
  locationValue: string;
  onNameChange: (value: string) => void;
  onLocationChange: (value: string) => void;
};

const SearchAndFilterBar = ({
  user,
  nameValue,
  locationValue,
  onNameChange,
  onLocationChange,
}: SearchAndFilterBarProps) => {
  const [tripNames, setTripNames] = useState<string[]>([]);
  const [tripLocations, setTripLocations] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("TRIPS")
      .select("trip_name, trip_location")
      .eq("user_id", user.id)
      .then((result) => {
        if (result.data) {
          const names = result.data.map(
            (trip: { trip_name: string }) => trip.trip_name
          );
          const locations = result.data.map(
            (trip: { trip_location: string }) => trip.trip_location
          );

          /*use spread op into a new Array using a Set data structure to remove these duplicates
          This is because the Mantine Autocomplete is annoying and doesnt take dups*/
          const filteredTripNames = [...new Set(names)];
          const filteredTripLocations = [...new Set(locations)];

          setTripNames(filteredTripNames);
          setTripLocations(filteredTripLocations);
        } else {
          setTripNames([]);
        }
      });
  }, [user]);

  return (
    <Group mt={20} justify="space-evenly" w={"100%"}>
      <Autocomplete
        name="tripName"
        data={tripNames}
        leftSection={<Search />}
        radius={"md"}
        w={250}
        aria-label="trip search"
        withScrollArea
        clearable
        placeholder="Search by Trip Name"
        value={nameValue}
        onChange={onNameChange}
      />
      <Autocomplete
        name="tripLocation"
        data={tripLocations}
        leftSection={<Search />}
        radius={"md"}
        w={250}
        aria-label="location search"
        withScrollArea
        clearable
        placeholder="Search by Trip Location"
        value={locationValue}
        onChange={onLocationChange}
      />
    </Group>
  );
};

export default SearchAndFilterBar;
