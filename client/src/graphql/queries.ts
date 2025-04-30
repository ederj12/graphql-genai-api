import { gql } from '@apollo/client';

export const GET_LOCATION_INSIGHT = gql`
  query GetLocationInsight($location: LocationInput!) {
    getLocationInsight(location: $location) {
      ... on LocationInsight {
        description
        historicalInfo
        interestingFacts
      }
      ... on Error {
        message
        code
      }
    }
  }
`; 