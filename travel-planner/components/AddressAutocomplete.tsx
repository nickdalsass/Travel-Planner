"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { Select, Loader, type SelectProps } from "@mantine/core";
import { useJsApiLoader } from "@react-google-maps/api";
import debounce from "lodash.debounce";
import { getAutocompleteService } from "@/utils/utils";

const LIBRARIES: "places"[] = ["places"];

interface AddressAutocompleteProps
  extends Omit<SelectProps, "data" | "onChange" | "value" | "onSelectAddress"> {
  onSelectAddress?: (address: string) => void;
  onChange?: (value: string) => void;
  value?: string;
}

export default function AddressAutocomplete({
  onSelectAddress,
  onChange,
  value = "",
  ...props
}: AddressAutocompleteProps) {
  const [predictions, setPredictions] = useState<
    { value: string; label: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState(value || "");
  const debouncedFetchRef = useRef<ReturnType<typeof debounce> | null>(null);
  const isInitializedRef = useRef(false);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: LIBRARIES,
  });

  useEffect(() => {
    if (!isLoaded) return;

    if (!isInitializedRef.current) {
      isInitializedRef.current = true;

      const fetchPredictions = (input: string) => {
        try {
          const service = getAutocompleteService();

          if (!service || input.trim().length < 2) {
            setPredictions([]);
            setIsLoading(false);
            return;
          }

          setIsLoading(true);

          // autocomplete request can now search globally, it defaults to US locations ig...
          const request = {
            input,
            types: ["geocode", "establishment"],
          };

          service.getPlacePredictions(
            request,
            (
              results: google.maps.places.AutocompletePrediction[] | null,

              status: google.maps.places.PlacesServiceStatus
            ) => {
              if (
                status === google.maps.places.PlacesServiceStatus.OK &&
                results
              ) {
                const formattedPredictions = results.map((prediction) => ({
                  value: prediction.description,
                  label: prediction.description,
                }));

                setPredictions(formattedPredictions);
              } else {
                setPredictions([]);
              }

              setIsLoading(false);
            }
          );
        } catch (error) {
          console.error("Error in fetchPredictions:", error);

          setPredictions([]);

          setIsLoading(false);
        }
      };

      debouncedFetchRef.current = debounce(fetchPredictions, 500);

      // cleanup debounced function when unmounted
      return () => {
        if (debouncedFetchRef.current) {
          debouncedFetchRef.current.cancel();
        }
      };
    }
  }, [isLoaded]);

  const handleSearchChange = (addressValue: string) => {
    setSearchValue(addressValue);
    onChange?.(addressValue);

    if (addressValue.length >= 2 && debouncedFetchRef.current) {
      setIsLoading(true);
      debouncedFetchRef.current(addressValue);
    } else {
      setPredictions([]);
    }
  };

  const handleSelect = (addressValue: string | null) => {
    if (addressValue) {
      onSelectAddress?.(addressValue);
      onChange?.(addressValue);
      setSearchValue(addressValue);
    }
  };

  // this maps the predictions to so mantine Select can display it
  const selectData = useMemo(() => {
    return predictions.map((prediction) => ({
      value: prediction.value,
      label: prediction.label,
    }));
  }, [predictions]);

  return (
    <Select
      searchable
      clearable
      value={searchValue}
      onChange={handleSelect}
      onSearchChange={handleSearchChange}
      data={selectData}
      rightSection={isLoading ? <Loader size="xs" /> : null}
      {...props}
    />
  );
}
