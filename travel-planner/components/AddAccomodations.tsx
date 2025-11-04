"use client";

import {
  Button,
  Center,
  Group,
  Paper,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { supabase } from "@/lib/supabase/client";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

type AccommodationFormValues = {
  tripId: string;
  accomType: string;
  accomDescription: string;
  accomAddress: string;
  accomConfNum: string;
};

const AddAccomodations = () => {
  const router = useRouter();
  // handy dandy next feature to extract a unique id from the url
  const params = useParams();

  // get todays formatted date as a placeholder, I am reusing this
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  const [checkInDate, setCheckInDate] = useState<string | null>(
    formattedDate
  );
  const [checkOutDate, setCheckOutDate] = useState<string | null>(null);

  const form = useForm<AccommodationFormValues>({
    mode: "uncontrolled",
    validateInputOnBlur: true,
    onSubmitPreventDefault: "validation-failed",
  });

  const handleSubmit = async (values: AccommodationFormValues) => {
    // destructure, we already have start and end dates defined up top, like before
    const { accomType, accomDescription, accomAddress, accomConfNum } = values;

    const { error: accomInsertError } = await supabase
      .from("ACCOMODATIONS")
      .insert([
        {
          trip_id: params.tripId,
          accom_type: accomType,
          accom_description: accomDescription,
          accom_address: accomAddress,
          accom_checkin: checkInDate,
          accom_checkout: checkOutDate,
          confirmation_num: accomConfNum,
        },
      ]);

    if (accomInsertError) {
      console.error(
        "There was an error when inserting your accomodations:",
        accomInsertError.message
      );
    } else {
      alert('Accomodations details saved successfully!');
      router.push(`/trip/${params.tripId}/itinerary`);
    }
  };

  return (
    <>
      <Center mt={"2%"}>
        <Stack align="center">
          <Paper radius="md" shadow="md" withBorder bg={"#EEEEEE"} p="xl">
            <Stack gap="xl">
              <Title order={1}>Add Accomodations</Title>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  form.onSubmit(handleSubmit)();
                }}
              >
                <Stack gap="md" w={300}>
                  <TextInput
                    name="accomType"
                    label="Type"
                    withAsterisk
                    required
                    styles={{
                      input: {
                        borderColor: "#000000",
                      },
                    }}
                    autoComplete="off"
                    placeholder="Hotel, AirBnB, hostel..."
                    {...form.getInputProps("accomType")}
                  />

                  <TextInput
                    name="accomDescription"
                    label="Description"
                    styles={{
                      input: {
                        borderColor: "#000000",
                      },
                    }}
                    autoComplete="off"
                    placeholder="Hotel with Balcony View..."
                    {...form.getInputProps("accomDescription")}
                  />

                  <TextInput
                    name="accomAddress"
                    label="Address"
                    styles={{
                      input: {
                        borderColor: "#000000",
                      },
                    }}
                    autoComplete="off"
                    {...form.getInputProps("accomAddress")}
                  />

                  <DateInput
                    clearable
                    required
                    value={checkInDate}
                    onChange={setCheckInDate}
                    label="Check-In Date"
                    styles={{
                      input: {
                        borderColor: "#000000",
                      },
                    }}
                  />

                  <DateInput
                    clearable
                    required
                    value={checkOutDate}
                    onChange={setCheckOutDate}
                    label="Check-Out Date"
                    styles={{
                      input: {
                        borderColor: "#000000",
                      },
                    }}
                  />

                  <TextInput
                    name="accomConfNum"
                    label="Confirmation Number"
                    styles={{
                      input: {
                        borderColor: "#000000",
                      },
                    }}
                    autoComplete="off"
                    {...form.getInputProps("accomConfNum")}
                  />
                  <Group justify="center" mt="lg">
                    <Button type="submit">Next</Button>
                  </Group>
                </Stack>
              </form>
            </Stack>
          </Paper>
        </Stack>
      </Center>
    </>
  );
};
export default AddAccomodations;