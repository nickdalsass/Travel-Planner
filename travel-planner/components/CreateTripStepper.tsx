"use client";

import { useState } from "react";
import {
  Button,
  Stepper,
  Group,
  TextInput,
  Stack,
  Select,
  Code,
  Card,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { DateInput } from "@mantine/dates";
import { TRANSPORTATION_TYPES } from "@/utils/utils";
import { TripFormValues } from "@/app/types/types";
import AddressAutocomplete from "./AddressAutocomplete";

const CreateTripStepper = () => {
  const [active, setActive] = useState(0);

  // get todays formatted date as a placeholder, I looked this formatting up
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  const form = useForm<TripFormValues>({
    initialValues: {
      userId: "",
      tripName: "",
      location: "",
      tripLeaveDate: formattedDate,
      tripReturnDate: null,
      transportationItems: [
        {
          transpType: "",
          transpCompany: "",
          transpDepartureDate: formattedDate,
          transpArrivalDate: null,
          transpConfNum: "",
        },
      ],
      accommodationItems: [
        {
          accomType: "",
          accomDescription: "",
          accomAddress: "",
          accomCheckinDate: formattedDate,
          accomCheckOutDate: null,
          accomConfNum: "",
        },
      ],
      itinSteps: [],
    },
    validate: {
      tripName: (value) => (value ? null : "Trip name is required"),
      location: (value) => (value ? null : "Location is required"),
      tripLeaveDate: (value) => (value ? null : "Trip leave date is required"),
      tripReturnDate: (value) =>
        value ? null : "Trip return date is required",
      transportationItems: {
        transpType: (value: string) =>
          value ? null : "Transportation Type is Required",
        transpCompany: (value: string) =>
          value ? null : "Transportation Company is Required",
        transpDepartureDate: (value: string | null) =>
          value ? null : "Departure Date is Required",
        transpArrivalDate: (value: string | null) =>
          value ? null : "Arrival Date is Required",
      },
      accommodationItems: {
        accomType: (value: string) =>
          value ? null : "Accommodation Type is Required",
        accomCheckinDate: (value: string | null) =>
          value ? null : "Check-in Date is Required",
        accomCheckOutDate: (value: string | null) =>
          value ? null : "Check-out Date is Required",
      },
    },
  });

  const addAccommodationItem = () => {
    if (form.values.accommodationItems.length < 3) {
      form.insertListItem("accommodationItems", {
        accomType: "",
        accomDescription: "",
        accomAddress: "",
        accomCheckinDate: formattedDate,
        accomCheckOutDate: null,
        accomConfNum: "",
      });
    }
  };

  const removeAccommodationItem = (index: number) => {
    if (form.values.accommodationItems.length > 1) {
      form.removeListItem("accommodationItems", index);
    }
  };

  const nextStep = () => {
    let stepFields: (keyof TripFormValues)[] = [];

    switch (active) {
      case 0:
        stepFields = [
          "tripName",
          "location",
          "tripLeaveDate",
          "tripReturnDate",
        ];
        break;
      case 1:
        // loop through each transportation item, validate each field
        const items = form.values.transportationItems;
        for (let i = 0; i < items.length; i++) {
          if (!items[i].transpType) {
            form.setFieldError(
              `transportationItems.${i}.transpType`,
              "Transportation Type is Required"
            );
            return;
          }
          if (!items[i].transpCompany) {
            form.setFieldError(
              `transportationItems.${i}.transpCompany`,
              "Transportation Company is Required"
            );
            return;
          }
        }
        break;
      case 2:
        const accommodations = form.values.accommodationItems;
        for (let i = 0; i < accommodations.length; i++) {
          if (!accommodations[i].accomType) {
            form.setFieldError(
              `accommodationItems.${i}.accomType`,
              "Accommodation Type is Required"
            );
            return;
          }
          if (!accommodations[i].accomCheckinDate) {
            form.setFieldError(
              `accommodationItems.${i}.accomCheckinDate`,
              "Check-in Date is Required"
            );
            return;
          }
          if (!accommodations[i].accomCheckOutDate) {
            form.setFieldError(
              `accommodationItems.${i}.accomCheckOutDate`,
              "Check-out Date is Required"
            );
            return;
          }
        }
        break;
      case 3:
        // remove empty itinerary steps before moving on
        form.setFieldValue(
          "itinSteps",
          form.values.itinSteps?.filter((step) => step.trim() !== "") || []
        );
        stepFields = ["itinSteps"];
        break;
      case 4:
        return;
      default:
        stepFields = [];
    }

    // loop through current pages forms and break out if there are any errors
    for (const field of stepFields) {
      const { hasError } = form.validateField(field);
      if (hasError) return;
    }

    setActive((current) => current + 1);
  };

  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const addTransportationItem = () => {
    if ((form.values.transportationItems?.length || 0) >= 4) {
      return; //no more than 4 transportation items
    }
    form.insertListItem("transportationItems", {
      transpType: "",
      transpCompany: "",
      transpDepartureDate: form.values.tripLeaveDate,
      transpArrivalDate: null,
      transpConfNum: "",
    });
  };

  const removeTransportationItem = (index: number) => {
    if (form.values.transportationItems.length > 1) {
      form.removeListItem("transportationItems", index);
    }
  };

  const handleSubmit = async (values: TripFormValues) => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw Error("User auth error!!");

      const { data: tripData, error: tripError } = await supabase
        .from("TRIPS")
        .insert({
          user_id: user?.id,
          trip_name: values.tripName,
          trip_location: values.location,
          trip_start: values.tripLeaveDate,
          trip_end: values.tripReturnDate,
        })
        .select()
        .single();

      if (tripError) {
        throw tripError;
      }

      const { error: transpError } = await supabase
        .from("TRANSPORTATION")
        .insert(
          values.transportationItems.map((item) => ({
            trip_id: tripData.id,
            transp_type: item.transpType,
            transp_company: item.transpCompany,
            transp_departure: item.transpDepartureDate,
            transp_arrival: item.transpArrivalDate,
            confirmation_num: item.transpConfNum,
          }))
        );

      if (transpError) throw transpError;

      if (values.accommodationItems && values.accommodationItems.length > 0) {
        const { error: accomInsertError } = await supabase
          .from("ACCOMMODATIONS")
          .insert(
            values.accommodationItems.map((item) => ({
              trip_id: tripData.id,
              accom_type: item.accomType,
              accom_description: item.accomDescription,
              accom_address: item.accomAddress,
              accom_checkin: item.accomCheckinDate,
              accom_checkout: item.accomCheckOutDate,
              confirmation_num: item.accomConfNum,
            }))
          );

        if (accomInsertError) throw accomInsertError;
      }

      const { error: itinInsertError } = await supabase
        .from("ITINERARY")
        .insert([
          {
            trip_id: tripData.id,
            itin_steps: values.itinSteps,
          },
        ]);

      if (itinInsertError) throw itinInsertError;

      // if everything works (hopefully), we return to homepage
      alert("Trip created successfully!");
      window.location.href = window.origin;
    } catch (error) {
      alert(
        `Error: ${
          error instanceof Error
            ? error.message
            : "An error occurred while creating the trip"
        }`
      );
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <Stepper active={active} allowNextStepsSelect={false}>
        <Stepper.Step label="Name Trip">
          <Stack align="center" mt={"xs"}>
            <TextInput
              w={400}
              label="Trip Name"
              withAsterisk
              required
              autoComplete="off"
              placeholder="Our Honeymoon"
              {...form.getInputProps("tripName")}
            />

            <TextInput
              w={400}
              label="Location"
              withAsterisk
              required
              autoComplete="off"
              placeholder="Paris"
              {...form.getInputProps("location")}
            />
            <DateInput
              w={400}
              clearable
              label="Departure Date"
              placeholder="Select departure date"
              required
              {...form.getInputProps("tripLeaveDate")}
            />

            <DateInput
              w={400}
              clearable
              label="Return Date"
              placeholder="Select return date"
              required
              {...form.getInputProps("tripReturnDate")}
            />
          </Stack>
        </Stepper.Step>

        <Stepper.Step label="Add Transportation">
          <Stack gap="md" mt="md">
            <Group wrap="wrap" justify="center">
              {(form.values.transportationItems || []).map((_, index) => (
                <Card key={index} p="sm" style={{ width: 325 }}>
                  <Stack gap="sm" align="center">
                    <Select
                      w={300}
                      label="Transportation Type"
                      placeholder="Select a type"
                      data={TRANSPORTATION_TYPES}
                      withAsterisk
                      required
                      searchable
                      clearable
                      nothingFoundMessage="No match"
                      {...form.getInputProps(
                        `transportationItems.${index}.transpType`
                      )}
                    />

                    <TextInput
                      w={300}
                      label="Transportation Company"
                      withAsterisk
                      required
                      autoComplete="off"
                      placeholder="Delta, Amtrak, etc..."
                      {...form.getInputProps(
                        `transportationItems.${index}.transpCompany`
                      )}
                    />

                    <DateInput
                      w={300}
                      clearable
                      required
                      label="Departure Date"
                      {...form.getInputProps(
                        `transportationItems.${index}.transpDepartureDate`
                      )}
                    />

                    <DateInput
                      w={300}
                      clearable
                      required
                      label="Return Date"
                      {...form.getInputProps(
                        `transportationItems.${index}.transpArrivalDate`
                      )}
                    />

                    <TextInput
                      w={300}
                      label="Confirmation Number"
                      autoComplete="off"
                      {...form.getInputProps(
                        `transportationItems.${index}.transpConfNum`
                      )}
                    />

                    {(form.values.transportationItems?.length || 0) > 1 && (
                      <Button
                        variant="outline"
                        color="red"
                        size="xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTransportationItem(index);
                        }}
                      >
                        Remove
                      </Button>
                    )}
                  </Stack>
                </Card>
              ))}
            </Group>

            <Group justify="center">
              <Button
                variant="outline"
                leftSection={<Plus />}
                onClick={addTransportationItem}
                disabled={(form.values.transportationItems?.length || 0) >= 4}
                title={
                  (form.values.transportationItems?.length || 0) >= 4
                    ? "Maximum of 4 transportation items allowed"
                    : ""
                }
              >
                Add Transportation (
                {form.values.transportationItems?.length || 0}/4)
              </Button>
            </Group>
          </Stack>
        </Stepper.Step>

        <Stepper.Step label="Add Accommodations">
          <Stack align="center">
            {form.values.accommodationItems.map((_, index) => (
              <Card
                key={index}
                withBorder
                pt={"xs"}
                pr="md"
                pb="md"
                pl="md"
                w={500}
                style={{ position: "relative" }}
              >
                <Group justify="space-between" mb="md">
                  {form.values.accommodationItems.length > 1 && (
                    <Button
                      variant="outline"
                      color="red"
                      size="xs"
                      onClick={() => removeAccommodationItem(index)}
                      style={{ position: "absolute", top: 10, right: 10 }}
                    >
                      Remove
                    </Button>
                  )}
                </Group>

                <Stack gap="sm">
                  <TextInput
                    label="Type"
                    withAsterisk
                    required
                    autoComplete="off"
                    placeholder="Hotel, AirBnB, Hostel..."
                    {...form.getInputProps(
                      `accommodationItems.${index}.accomType`
                    )}
                  />
                  <TextInput
                    label="Description"
                    autoComplete="off"
                    placeholder="Hotel with Balcony View..."
                    {...form.getInputProps(
                      `accommodationItems.${index}.accomDescription`
                    )}
                  />

                  <AddressAutocomplete
                    label="Address"
                    placeholder="Start Typing an Address..."
                    {...form.getInputProps(
                      `accommodationItems.${index}.accomAddress`
                    )}
                  />
                  <DateInput
                    clearable
                    required
                    label="Check-In Date"
                    {...form.getInputProps(
                      `accommodationItems.${index}.accomCheckinDate`
                    )}
                  />
                  <DateInput
                    clearable
                    required
                    label="Check-Out Date"
                    {...form.getInputProps(
                      `accommodationItems.${index}.accomCheckOutDate`
                    )}
                  />
                  <TextInput
                    label="Confirmation Number"
                    autoComplete="off"
                    {...form.getInputProps(
                      `accommodationItems.${index}.accomConfNum`
                    )}
                  />
                </Stack>
              </Card>
            ))}

            <Button
              variant="outline"
              leftSection={<Plus size={16} />}
              onClick={addAccommodationItem}
              disabled={form.values.accommodationItems.length >= 3}
              mt="md"
            >
              Add Accommodation ({form.values.accommodationItems.length}/3)
            </Button>
          </Stack>
        </Stepper.Step>

        <Stepper.Step label="Add Itinerary">
          <Stack align="center" mt="xl">
            {form.values.itinSteps.map((step, index) => (
              <Group key={index}>
                <TextInput
                  w={600}
                  placeholder={`Itinerary Item ${index + 1}`}
                  {...form.getInputProps(`itinSteps.${index}`)}
                />
                <Button
                  variant="outline"
                  color="red"
                  onClick={() => {
                    const newSteps = [...form.values.itinSteps];
                    newSteps.splice(index, 1);
                    form.setFieldValue("itinSteps", newSteps);
                  }}
                  disabled={form.values.itinSteps.length === 1}
                >
                  Remove
                </Button>
              </Group>
            ))}
            <Button
              variant="outline"
              leftSection={<Plus />}
              onClick={() => form.insertListItem("itinSteps", "")}
              mt="md"
            >
              Add Itinerary Item
            </Button>
          </Stack>
        </Stepper.Step>
        <Stepper.Completed>
          <Stack align="center">
            <Text size="xl" fw={500} mb="md">
              Review Your Trip Details
            </Text>
            <Code block style={{ width: "100%", maxWidth: "800px" }}>
              {JSON.stringify(form.getValues(), null, 2)}
            </Code>
          </Stack>
        </Stepper.Completed>
      </Stepper>

      <Group justify="center" mt="xl" gap={50}>
        {active > 0 && active <= 4 && (
          <Button variant="default" onClick={prevStep}>
            Back
          </Button>
        )}
        {active < 3 ?  (
          <Button  type="button" onClick={nextStep} color="#b8626cff" >
            Next step
          </Button>
        ) : active === 3 ? (
          <Button type="button" onClick={nextStep} color="#b8626cff">
            Review Trip
          </Button>
        ) : (
          active === 4 && (
            <Button
              type="button"
              loading={form.submitting}
              color="#3f8343ff"
              onClick={() => handleSubmit(form.values)}
            >
              {form.submitting ? "Creating Trip..." : "Create Trip"}
            </Button>
          )
        )}
      </Group>
    </form>
  );
};

export default CreateTripStepper;
