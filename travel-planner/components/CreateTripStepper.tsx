"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Button,
  Stepper,
  Group,
  TextInput,
  Stack,
  Select,
  Card,
  Text,
  Paper,
  List,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { DateInput } from "@mantine/dates";
import {
  TRANSPORTATION_TYPES,
  capitalizeFirstChar,
  formatTodaysDate,
} from "@/utils/utils";
import { TripFormValues } from "@/app/types/types";
import AddressAutocomplete from "./AddressAutocomplete";

const CreateTripStepper = () => {
  const [active, setActive] = useState(0);

  const formattedDate = formatTodaysDate();

  // we know were in editmode by looking at the url params
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get("edit") === "true";
  const tripId = searchParams.get("id");

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

  // when editing, fetch the full trip and related rows and hydrate the form
  useEffect(() => {
    const loadTripForEdit = async () => {
      if (!isEditMode || !tripId) return;

      try {
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
          .eq("id", Number(tripId))
          .single();

        if (error) {
          throw error;
        }

        if (!data) return;

        form.setValues({
          userId: "",
          tripName: data.trip_name || "",
          location: data.trip_location || "",
          tripLeaveDate: data.trip_start || formattedDate,
          tripReturnDate: data.trip_end || null,
          transportationItems:
            data.TRANSPORTATION?.map((t: any) => ({
              transpType: t.transp_type || "",
              transpCompany: t.transp_company || "",
              transpDepartureDate: t.transp_departure || formattedDate,
              transpArrivalDate: t.transp_arrival || null,
              transpConfNum: t.confirmation_num || "",
            })) || [
              {
                transpType: "",
                transpCompany: "",
                transpDepartureDate: formattedDate,
                transpArrivalDate: null,
                transpConfNum: "",
              },
            ],
          accommodationItems:
            data.ACCOMMODATIONS?.map((a: any) => ({
              accomType: a.accom_type || "",
              accomDescription: a.accom_description || "",
              accomAddress: a.accom_address || "",
              accomCheckinDate: a.accom_checkin || formattedDate,
              accomCheckOutDate: a.accom_checkout || null,
              accomConfNum: a.confirmation_num || "",
            })) || [
              {
                accomType: "",
                accomDescription: "",
                accomAddress: "",
                accomCheckinDate: formattedDate,
                accomCheckOutDate: null,
                accomConfNum: "",
              },
            ],
          itinSteps:
            (data.ITINERARY &&
              data.ITINERARY[0] &&
              (data.ITINERARY[0].itin_steps || [])) || [],
        });
      } catch (e) {
        alert(`Error loading trip for edit!`);
      }
    };

    loadTripForEdit();
  }, [isEditMode, tripId]);

  const handleSubmit = async (values: TripFormValues) => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw Error("User auth error!!");
      // if in edit mode and have a trip id, update existing trip and related tables.
      if (isEditMode && tripId) {
        const numericTripId = Number(tripId);

        const { error: tripUpdateError } = await supabase
          .from("TRIPS")
          .update({
            trip_name: values.tripName,
            trip_location: values.location,
            trip_start: values.tripLeaveDate,
            trip_end: values.tripReturnDate,
          })
          .eq("id", numericTripId)
          .eq("user_id", user?.id || "");

        if (tripUpdateError) {
          throw tripUpdateError;
        }

        // rewrite rows for this trip based on new form values
        const { error: deleteTranspError } = await supabase
          .from("TRANSPORTATION")
          .delete()
          .eq("trip_id", numericTripId);

        if (deleteTranspError) throw deleteTranspError;

        if (values.transportationItems && values.transportationItems.length > 0) {
          const { error: insertTranspError } = await supabase
            .from("TRANSPORTATION")
            .insert(
              values.transportationItems.map((item) => ({
                trip_id: numericTripId,
                transp_type: item.transpType,
                transp_company: item.transpCompany,
                transp_departure: item.transpDepartureDate,
                transp_arrival: item.transpArrivalDate,
                confirmation_num: item.transpConfNum,
              }))
            );

          if (insertTranspError) throw insertTranspError;
        }

        // Rewrite accommodation rows for this trip based on current form values
        const { error: deleteAccomError } = await supabase
          .from("ACCOMMODATIONS")
          .delete()
          .eq("trip_id", numericTripId);

        if (deleteAccomError) throw deleteAccomError;

        if (values.accommodationItems && values.accommodationItems.length > 0) {
          const { error: insertAccomError } = await supabase
            .from("ACCOMMODATIONS")
            .insert(
              values.accommodationItems.map((item) => ({
                trip_id: numericTripId,
                accom_type: item.accomType,
                accom_description: item.accomDescription,
                accom_address: item.accomAddress,
                accom_checkin: item.accomCheckinDate,
                accom_checkout: item.accomCheckOutDate,
                confirmation_num: item.accomConfNum,
              }))
            );

          if (insertAccomError) throw insertAccomError;
        }

        // rewrite itinerary rows for trip based on current vals
       const { error: deleteItinError } = await supabase
          .from("ITINERARY")
          .delete()
          .eq("trip_id", numericTripId);

        if (deleteItinError) throw deleteItinError;

        if (values.itinSteps && values.itinSteps.length > 0) {
          const { error: insertItinError } = await supabase
            .from("ITINERARY")
            .insert([
              {
                trip_id: numericTripId,
                itin_steps: values.itinSteps,
              },
            ]);

          if (insertItinError) throw insertItinError;
        }

        window.location.href = window.origin;
      } else {
        // original submission behavior to insert into tables
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
        window.location.href = window.origin;
      }
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

  //create variables for the transportation and accomodation and itin items
  const transportationItems = form.values.transportationItems;
  const accomodationItems = form.values.accommodationItems;
  const itineraryItems = form.values.itinSteps;

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <Stepper active={active} allowNextStepsSelect={false} color="#b8626c">
        <Stepper.Step label="Name Trip">
          <Stack align="center">
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
                leftSection={<Plus />}
                color="#b8626c"
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
              color="#b8626c"
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
              color="#b8626c"
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
            <Title>Review Your Trip Details</Title>

            <Paper p={40} w={"75%"}>
              <Stack>
                <Title fw={"bolder"}>Name Trip</Title>
                <List>
                  <List.Item>
                    <i>Trip Name:</i> {capitalizeFirstChar(form.values.tripName)}
                  </List.Item>
                  <List.Item>
                    <i>Location:</i> {capitalizeFirstChar(form.values.location)}
                  </List.Item>
                  <List.Item>
                    <i>Trip Departure Date:</i> {form.values.tripLeaveDate}
                  </List.Item>
                  <List.Item>
                    <i>Trip Return Date:</i> {form.values.tripReturnDate}
                  </List.Item>
                </List>
                <Title fw={"bolder"}>Add Transportation</Title>
                {transportationItems.map((item, ii) => (
                  <div key={ii}>
                    <Text fw={"bold"}>Transportation Mode #{ii + 1}</Text>
                    <List ml={"lg"}>
                      <List.Item><i>Type:</i> {capitalizeFirstChar(item.transpType)}</List.Item>
                      <List.Item><i>Company:</i> {capitalizeFirstChar(item.transpCompany)}</List.Item>
                      <List.Item>
                        <i>Departure:</i> {String(item.transpDepartureDate)}
                      </List.Item>
                      <List.Item>
                        <i>Arrival:</i> {String(item.transpArrivalDate)}
                      </List.Item>
                      <List.Item>
                        <i>Confirmation Number:</i>{" "}
                        {item.transpConfNum || "Not provided"}
                      </List.Item>
                    </List>
                  </div>
                ))}
                <Title fw={"bolder"}>Add Accommodations</Title>
                {accomodationItems.map((accom, ii) => (
                  <div key={ii}>
                    <Text fw={"bold"}>Accomodation #{ii + 1}</Text>
                    <List ml={"lg"}>
                      <List.Item><i>Type:</i> {capitalizeFirstChar(accom.accomType)}</List.Item>
                      <List.Item>
                        <i>Description:</i> {capitalizeFirstChar(accom.accomDescription) || "Not provided"}
                      </List.Item>
                      <List.Item>
                        <i>Address:</i> {accom.accomAddress || "Not Provided"}
                      </List.Item>
                      <List.Item>
                        <i>Checkin Date:</i> {String(accom.accomCheckinDate)}
                      </List.Item>
                      <List.Item>
                        <i>Checkout Date:</i> {String(accom.accomCheckOutDate)}
                      </List.Item>
                      <List.Item>
                        <i>Confirmation Number:</i>{" "}
                        {accom.accomConfNum || "Not provided"}
                      </List.Item>
                    </List>
                  </div>
                ))}
                <Title fw={"bolder"}>Add Itinerary</Title>
                {itineraryItems.length > 0 ? itineraryItems.map((itinItem, ii) => (
                  <List key={ii} ml={"lg"} mt={0}>
                      <List.Item>{itinItem || "Not provided"}</List.Item>
                    </List>
                )): <i>No Itinerary Provided</i>}
              </Stack>
            </Paper>
          </Stack>
        </Stepper.Completed>
      </Stepper>

      <Group justify="center" mt="xl" gap={50}>
        {active > 0 && active <= 4 && (
          <Button variant="default" onClick={prevStep}>
            Back
          </Button>
        )}
        {active < 3 ? (
          <Button type="button" onClick={nextStep} color="#b8626cff">
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
              {form.submitting
                ? isEditMode
                  ? "Updating Trip..."
                  : "Creating Trip..."
                : isEditMode
                ? "Update Trip"
                : "Create Trip"}
            </Button>
          )
        )}
      </Group>
    </form>
  );
};

export default CreateTripStepper;
