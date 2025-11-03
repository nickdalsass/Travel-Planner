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

type TransportationFormValues = {
  tripId: string;
  transpName: string;
  transpType: string;
  transpCompany: string;
  departureDate: string;
  returnDate: string;
  transpConfNum: string;
};

const AddTransportation = () => {
  const router = useRouter();
  // handy dandy next feature to extract a unique id from the url
  const params = useParams();

  // get todays formatted date as a placeholder, I am reusing this
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  const [departureDate, setDepartureDate] = useState<string | null>(
    formattedDate
  );
  const [arrivalDate, setArrivalDate] = useState<string | null>(null);

  const form = useForm<TransportationFormValues>({
    mode: "uncontrolled",
    validateInputOnBlur: true,
    onSubmitPreventDefault: "validation-failed",
  });

  const handleSubmit = async (values: TransportationFormValues) => {
    // destructure, we already have start and end dates defined up top, like before
    const { transpName, transpType, transpCompany, transpConfNum } = values;

    const { error: transpInsertError } = await supabase
      .from("TRANSPORTATION")
      .insert([
        {
          trip_id: params.tripId,
          transp_name: transpName,
          transp_type: transpType,
          transp_company: transpCompany,
          transp_departure: departureDate,
          transp_arrival: arrivalDate,
          confirmation_num: transpConfNum,
        },
      ]);

    if (transpInsertError) {
      console.log(
        "There was an error when inserting this transportation:",
        transpInsertError
      );
    } else {
      alert('Transportation details saved successfully!');
      router.push(`/trip/${params.tripId}/accomodations`);
    }
  };

  return (
    <>
      <Center mt={"2%"}>
        <Stack align="center">
          <Paper radius="md" shadow="md" withBorder bg={"#EEEEEE"} p="xl">
            <Stack gap="xl">
              <Title order={1}>Add Transportation</Title>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  form.onSubmit(handleSubmit)();
                }}
              >
                <Stack gap="md" w={300}>
                  <TextInput
                    name="transpName"
                    label="Transportation Name"
                    withAsterisk
                    required
                    styles={{
                      input: {
                        borderColor: "#000000",
                      },
                    }}
                    autoComplete="off"
                    placeholder="Greyhound to Boston"
                    {...form.getInputProps("transpName")}
                  />

                  <TextInput
                    name="transpType"
                    label="Transportation Type"
                    withAsterisk
                    required
                    styles={{
                      input: {
                        borderColor: "#000000",
                      },
                    }}
                    autoComplete="off"
                    placeholder="Plane, Train, Automobile..."
                    {...form.getInputProps("transpType")}
                  />

                  <TextInput
                    name="transpCompany"
                    label="Transportation Company"
                    withAsterisk
                    required
                    styles={{
                      input: {
                        borderColor: "#000000",
                      },
                    }}
                    autoComplete="off"
                    {...form.getInputProps("transpCompany")}
                  />

                  <DateInput
                    clearable
                    required
                    value={departureDate}
                    onChange={setDepartureDate}
                    label="Departure Date"
                    styles={{
                      input: {
                        borderColor: "#000000",
                      },
                    }}
                  />

                  <DateInput
                    clearable
                    required
                    value={arrivalDate}
                    onChange={setArrivalDate}
                    label="Return Date"
                    styles={{
                      input: {
                        borderColor: "#000000",
                      },
                    }}
                  />

                  <TextInput
                    name="transpConfNum"
                    label="Confirmation Number"
                    styles={{
                      input: {
                        borderColor: "#000000",
                      },
                    }}
                    autoComplete="off"
                    {...form.getInputProps("transpConfNum")}
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
export default AddTransportation;
