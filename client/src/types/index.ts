export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface LocationInsight {
  description: string;
  historicalInfo?: string;
  interestingFacts?: string[];
}

export interface ErrorResponse {
  message: string;
  code: string;
}

export type LocationInsightResult = LocationInsight | ErrorResponse; 