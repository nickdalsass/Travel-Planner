export const TRANSPORTATION_TYPES = [
  { value: "Bus", label: "Bus" },
  { value: "Train", label: "Train" },
  { value: "Subway", label: "Subway / Metro" },
  { value: "Tram", label: "Tram / Streetcar" },
  { value: "Ferry", label: "Ferry / Boat" },
  { value: "Plane", label: "Airplane" },
  { value: "Taxi", label: "Taxi" },
  { value: "Rideshare", label: "Rideshare (Uber, Lyft, etc.)" },
  { value: "Car", label: "Personal Car" },
  { value: "Car Rental", label: "Car Rental" },
  { value: "Motorcycle", label: "Motorcycle / Moped" },
  { value: "High Speed Train", label: "High-Speed Train" },
  { value: "Light Rail", label: "Light Rail" },
  { value: "Helicopter", label: "Helicopter" },
  { value: "Other", label: "Other" },
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