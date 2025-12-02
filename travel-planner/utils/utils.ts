export const TRANSPORTATION_TYPES = [
  { value: "bus", label: "Bus" },
  { value: "train", label: "Train" },
  { value: "subway", label: "Subway / Metro" },
  { value: "tram", label: "Tram / Streetcar" },
  { value: "ferry", label: "Ferry / Boat" },
  { value: "plane", label: "Airplane" },
  { value: "taxi", label: "Taxi" },
  { value: "rideshare", label: "Rideshare (Uber, Lyft, etc.)" },
  { value: "car", label: "Personal Car" },
  { value: "car_rental", label: "Car Rental" },
  { value: "motorcycle", label: "Motorcycle / Moped" },
  { value: "high_speed_train", label: "High-Speed Train" },
  { value: "light_rail", label: "Light Rail" },
  { value: "helicopter", label: "Helicopter" },
  { value: "other", label: "Other" },
];

// Gmaps Autocomplete sketchy initialization... might need work
let autocompleteService: google.maps.places.AutocompleteService | null = null;

export const getAutocompleteService =
  (): google.maps.places.AutocompleteService => {
    if (
      !autocompleteService &&
      typeof window !== "undefined" &&
      window.google?.maps?.places
    ) {
      autocompleteService = new google.maps.places.AutocompleteService();
    } else if (!autocompleteService) {
      throw new Error("Google Maps API not loaded");
    }

    return autocompleteService;
  };

export function formatTodaysDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};

export function capitalizeFirstChar(val: string) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}