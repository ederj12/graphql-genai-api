import React from 'react';
import { Typography, Paper } from '@mui/material';

interface Location {
  lat: number;
  lng: number;
  address: string;
}

interface LocationInsight {
  description: string;
  historicalInfo?: string;
  interestingFacts?: string[];
}

interface ErrorResponse {
  message: string;
  code: string;
}

interface LocationInsightsProps {
  loading: boolean;
  error?: Error;
  selectedLocation: Location | null;
  insight: LocationInsight | ErrorResponse | null;
}

const LocationInsights: React.FC<LocationInsightsProps> = ({
  loading,
  error,
  selectedLocation,
  insight,
}) => {
  const renderContent = () => {
    if (loading) {
      return (
        <Typography variant="body1" align="center">
          Loading insights...
        </Typography>
      );
    }

    if (error) {
      return (
        <Typography variant="body1" color="error" align="center">
          Error: {error.message}
        </Typography>
      );
    }

    if (!insight) {
      return (
        <Typography 
          variant="body1" 
          align="center" 
          sx={{ 
            color: 'text.secondary',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          Search for a location or click on the map to see insights
        </Typography>
      );
    }

    if ('message' in insight) {
      return (
        <Typography color="error">
          {insight.message}
        </Typography>
      );
    }

    return (
      <>
        <Typography variant="h6" gutterBottom>
          {selectedLocation?.address}
        </Typography>
        <Typography paragraph>
          {insight.description}
        </Typography>
        {insight.historicalInfo && (
          <>
            <Typography variant="h6" gutterBottom>
              Historical Information
            </Typography>
            <Typography paragraph>
              {insight.historicalInfo}
            </Typography>
          </>
        )}
        {insight.interestingFacts && (
          <>
            <Typography variant="h6" gutterBottom>
              Interesting Facts
            </Typography>
            <ul>
              {insight.interestingFacts.map((fact: string, index: number) => (
                <li key={index}>
                  <Typography>{fact}</Typography>
                </li>
              ))}
            </ul>
          </>
        )}
      </>
    );
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3,
        height: '600px',
        overflowY: 'auto',
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {renderContent()}
    </Paper>
  );
};

export default LocationInsights; 