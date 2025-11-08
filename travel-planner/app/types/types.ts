export interface TransportationItem {
  transpType: string;
  transpCompany: string;
  transpDepartureDate: string | null;
  transpArrivalDate: string | null;
  transpConfNum: string;
}

export interface AccommodationItem {
  accomType: string;
  accomDescription: string;
  accomAddress: string;
  accomCheckinDate: string | null;
  accomCheckOutDate: string | null;
  accomConfNum: string;
}

export type TripFormValues = {
  userId: string;
  tripName: string;
  location: string;
  tripLeaveDate: string | null;
  tripReturnDate: string | null;
  transportationItems: TransportationItem[];
  accommodationItems: AccommodationItem[];
  itinSteps: string[];
};
