// This is just a copy of the AddTrip form which I will use as a template for each part of the form

// "use client";
const AddItinerary = () => {
    return <div>itinerary</div>
}
export default AddItinerary;
// import {
//   Button,
//   Center,
//   Group,
//   Paper,
//   Stack,
//   TextInput,
//   Title,
// } from "@mantine/core";
// import { DateInput } from "@mantine/dates";
// import { supabase } from "@/lib/supabase/client";
// import { useForm } from "@mantine/form";
// import { useState } from "react";

// type ItineraryFormValues = {
//   user_id: string;
//   tripName: string;
//   location: string;
//   departureDate: string;
//   returnDate: string;
// };

// const AddItinerary = () => {
//   // get todays formatted date as a placeholder, I looked this formatting up
//   const today = new Date();
//   const year = today.getFullYear();
//   const month = String(today.getMonth() + 1).padStart(2, "0");
//   const day = String(today.getDate()).padStart(2, "0");
//   const formattedDate = `${year}-${month}-${day}`;

//   const [departureDate, setDepartureDate] = useState<string | null>(
//     formattedDate
//   );
//   const [returnDate, setReturnDate] = useState<string | null>(null);

//   const form = useForm<TripFormValues>({
//     mode: "uncontrolled",
//     validateInputOnBlur: true,
//     onSubmitPreventDefault: "validation-failed",
//   });

//   const handleSubmit = async (values: TripFormValues) => {
//     // destructure, we already have start and end dates defined up top
//     const { tripName, location } = values;

//     // first, check if the user is logged in! to get unique id
//     const {
//       data: { user },
//       error: userError,
//     } = await supabase.auth.getUser();

//     // Once we confirm the user is in, we can insert our trip!
//     if (!user) {
//       console.error("Error fetching user:", userError);
//     } else {
//       const { data: tripData, error: tripInsertError } = await supabase
//         .from("TRIPS")
//         .insert([
//           {
//             user_id: user.id,
//             trip_name: tripName,
//             trip_location: location,
//             trip_start: departureDate,
//             trip_end: returnDate,
//           },
//         ]);

//       if (tripInsertError)
//         console.log(
//           "There was an error when inserting this trip:",
//           tripInsertError
//         );
//     }

//     const homePageUrl = window.location.origin;
//     window.location.href = homePageUrl;
//   };

//   return (
//     <>
//       <Center mt={"2%"}>
//         <Stack align="center">
//           <Paper radius="md" shadow="md" withBorder bg={"#EEEEEE"} p="xl">
//             <Stack gap="xl">
//               <Title order={1}>Create Trip</Title>

//               <form
//                 onSubmit={(event) => {
//                   event.preventDefault();
//                   form.onSubmit(handleSubmit)();
//                 }}
//               >
//                 <Stack gap="md" w={300}>
//                   <TextInput
//                     name="tripName"
//                     label="Trip Name"
//                     withAsterisk
//                     required
//                     styles={{
//                       input: {
//                         borderColor: "#000000",
//                       },
//                     }}
//                     autoComplete="off"
//                     placeholder="Our Honeymoon"
//                     {...form.getInputProps("tripName")}
//                   />

//                   <TextInput
//                     name="location"
//                     label="Location"
//                     withAsterisk
//                     required
//                     styles={{
//                       input: {
//                         borderColor: "#000000",
//                       },
//                     }}
//                     autoComplete="off"
//                     placeholder="Paris"
//                     {...form.getInputProps("location")}
//                   />

//                   <DateInput
//                     clearable
//                     required
//                     value={departureDate}
//                     onChange={setDepartureDate}
//                     label="Departure Date"
//                     styles={{
//                       input: {
//                         borderColor: "#000000",
//                       },
//                     }}
//                   />

//                   <DateInput
//                     clearable
//                     required
//                     value={returnDate}
//                     onChange={setReturnDate}
//                     label="Return Date"
//                     styles={{
//                       input: {
//                         borderColor: "#000000",
//                       },
//                     }}
//                   />

//                   <Group justify="center" mt="lg">
//                     <Button type="submit">Next</Button>
//                   </Group>
//                 </Stack>
//               </form>
//             </Stack>
//           </Paper>
//         </Stack>
//       </Center>
//     </>
//   );
// };
// export default AddItinerary;
