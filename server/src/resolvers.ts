import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { LocationInsight } from './types';

// Load environment variables
dotenv.config();

// Constants
const ERROR_CODES = {
  API_ERROR: 'API_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  PARSE_ERROR: 'PARSE_ERROR',
} as const;

// Types
interface LocationInput {
  lat: number;
  lng: number;
  address?: string;
}

interface ErrorResponse {
  message: string;
  code: string;
}

// Initialize AI client
const apiKey = process.env.GOOGLE_GENAI_API_KEY;
if (!apiKey) {
  throw new Error('GOOGLE_GENAI_API_KEY environment variable is required');
}
const ai = new GoogleGenAI({ apiKey });

/**
 * Validates location coordinates
 * @param location - The location to validate
 * @throws Error if validation fails
 */
const validateLocation = (location: LocationInput): void => {
  if (!location.lat || !location.lng) {
    throw new Error('Latitude and longitude are required');
  }
  if (location.lat < -90 || location.lat > 90) {
    throw new Error('Latitude must be between -90 and 90');
  }
  if (location.lng < -180 || location.lng > 180) {
    throw new Error('Longitude must be between -180 and 180');
  }
};

/**
 * Generates location insights using AI
 * @param location - The location to analyze
 * @returns Promise<LocationInsight | ErrorResponse>
 */
const generateLocationInsight = async (
  location: LocationInput
): Promise<LocationInsight | ErrorResponse> => {
  try {
    validateLocation(location);

    const prompt = `Generate a detailed description, historical information, and interesting facts about the following location:
      Latitude: ${location.lat}
      Longitude: ${location.lng}
      ${location.address ? `Address: ${location.address}` : ''}
      
      Please provide:
      1. A detailed description of the area
      2. Historical information if available
      3. 3-5 interesting facts about the location`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: {
              type: Type.STRING,
              description: 'Detailed description of the location',
              nullable: false,
            },
            historicalInfo: {
              type: Type.STRING,
              description: 'Historical information about the location',
              nullable: true,
            },
            interestingFacts: {
              type: Type.ARRAY,
              description: 'List of interesting facts about the location',
              items: {
                type: Type.STRING,
                description: 'An interesting fact about the location',
              },
              nullable: true,
            },
          },
          required: ['description'],
        },
      },
    });

    try {
      if (!response.text) {
        throw new Error('No response text received');
      }
      const insight = JSON.parse(response.text) as LocationInsight;
      return insight;
    } catch (parseError) {
      return {
        message: 'Failed to parse AI response',
        code: ERROR_CODES.PARSE_ERROR,
      };
    }
  } catch (error) {
    console.error('Error generating location insight:', error);
    return {
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      code: ERROR_CODES.API_ERROR,
    };
  }
};

// Type resolver for the union type
const LocationInsightResult = {
  __resolveType(obj: any) {
    if (obj.message) {
      return 'Error';
    }
    if (obj.description) {
      return 'LocationInsight';
    }
    return null;
  }
};

export const resolvers = {
  LocationInsightResult,
  Query: {
    getLocationInsight: async (_: any, { location }: { location: { lat: number; lng: number; address?: string } }) => {
      try {
        return await generateLocationInsight(location);
      } catch (error) {
        console.error('Error generating location insight:', error);
        return {
          message: 'Failed to get location insight',
          code: 'LOCATION_ERROR'
        };
      }
    }
  }
}; 