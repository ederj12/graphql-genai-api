import { gql } from 'graphql-tag';

/**
 * GraphQL schema definitions for the location insight service.
 * Defines types, inputs, and queries for location-based data.
 */
export const typeDefs = gql`
  # Input type for location coordinates with validation
  input LocationInput {
    lat: Float!
    lng: Float!
    address: String
  }

  # Type for location insights with required fields
  type LocationInsight {
    description: String!
    historicalInfo: String
    interestingFacts: [String!]
  }

  # Custom error type for standardized error handling
  type Error {
    message: String!
    code: String
  }

  # Union type for handling both success and error cases
  union LocationInsightResult = LocationInsight | Error

  type Query {
    """
    Get insights about a specific location including description,
    historical information, and interesting facts.
    
    @param location - The location coordinates and optional address
    @returns LocationInsightResult - Either location insights or an error
    """
    getLocationInsight(location: LocationInput!): LocationInsightResult!
  }
`; 