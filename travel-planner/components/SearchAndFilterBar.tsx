"use client";

import { supabase } from "@/lib/supabase/client";
import { Autocomplete, Button, Group, Paper } from "@mantine/core";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

type SearchAndFilterBarProps = {
  user: { id: string } | null;
  onSearch: (value: string) => void; //for filtering out by trip name
};

const SearchAndFilterBar = ({ user, onSearch }: SearchAndFilterBarProps) => {
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
            (location: { trip_location: string }) => location.trip_location
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
    <Paper w={"100%"} withBorder shadow="md" p={"md"} mt={10}>
      <form>
        <Group justify="space-between" w={"100%"}>
          <Group justify="space-evenly">
            <Autocomplete
              name="tripName"
              data={tripNames}
              radius={"md"}
              w={250}
              aria-label="trip search"
              withScrollArea
              clearable
              placeholder="Search by Trip Name"
              onChange={onSearch}
            />
            <Autocomplete
              name="tripLocation"
              data={tripLocations}
              radius={"md"}
              w={250}
              aria-label="location search"
              withScrollArea
              clearable
              placeholder="Search by Trip Location"
              onChange={onSearch}
            />
          </Group>
          <Group gap={"2rem"}>
            <Button
              type="submit"
              variant="transparent"
              c={"#b8626cff"}
              style={{ border: "1px solid black" }}
              radius={"md"}
            >
              <Search />
            </Button>
          </Group>
        </Group>
      </form>
    </Paper>
  );
};

export default SearchAndFilterBar;
