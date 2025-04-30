import React, { useState, useCallback } from 'react';
import { Container, Typography, Box, Fade, Grid, ThemeProvider, CssBaseline } from '@mui/material';
import { useQuery } from '@apollo/client';
import { MapMouseEvent } from '@vis.gl/react-google-maps';
import SearchLocation from './components/SearchLocation';
import LocationMap from './components/LocationMap';
import LocationInsights from './components/LocationInsights';
import { GET_LOCATION_INSIGHT } from './graphql/queries';
import { Location, LocationInsightResult } from './types';
import { theme } from './theme';

function App() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [showMap, setShowMap] = useState(false);

  const { loading, error, data } = useQuery<{ getLocationInsight: LocationInsightResult }>(
    GET_LOCATION_INSIGHT,
    {
      variables: { location: selectedLocation },
      skip: !selectedLocation,
    }
  );

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    setShowMap(true);
    if (map) {
      map.setCenter({ lat: location.lat, lng: location.lng });
      map.setZoom(12);
    }
  };

  const handleClear = () => {
    setSelectedLocation(null);
    setShowMap(false);
  };

  const handleMapClick = useCallback((e: MapMouseEvent) => {
    if (e.detail.latLng) {
      setSelectedLocation({
        lat: e.detail.latLng.lat,
        lng: e.detail.latLng.lng,
        address: '', // We'll need to implement reverse geocoding to get the address
      });
    }
  }, []);

  const handleMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    if (selectedLocation) {
      map.setCenter({ lat: selectedLocation.lat, lng: selectedLocation.lng });
      map.setZoom(12);
    }
  }, [selectedLocation]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Location Insights
          </Typography>
          
          <SearchLocation 
            onLocationSelect={handleLocationSelect} 
            onClear={handleClear}
          />

          <Fade in={showMap || loading || !!error || !!data?.getLocationInsight} timeout={500}>
            <Box sx={{ mt: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={7}>
                  <LocationMap
                    show={showMap}
                    selectedLocation={selectedLocation}
                    onMapClick={handleMapClick}
                    onMapLoad={handleMapLoad}
                  />
                </Grid>

                <Grid item xs={12} md={5}>
                  <LocationInsights
                    loading={loading}
                    error={error}
                    selectedLocation={selectedLocation}
                    insight={data?.getLocationInsight || null}
                  />
                </Grid>
              </Grid>
            </Box>
          </Fade>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App; 