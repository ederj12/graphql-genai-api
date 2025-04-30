import React, { useRef, useEffect } from 'react';
import { Box } from '@mui/material';
import { Map, MapMouseEvent, APIProvider, Marker } from '@vis.gl/react-google-maps';

interface Location {
  lat: number;
  lng: number;
  address: string;
}

interface LocationMapProps {
  show: boolean;
  selectedLocation: Location | null;
  onMapClick: (e: MapMouseEvent) => void;
  onMapLoad: (map: google.maps.Map) => void;
}

const LocationMap: React.FC<LocationMapProps> = ({ 
  show, 
  selectedLocation, 
  onMapClick, 
  onMapLoad 
}) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const mapLoadedRef = useRef(false);

  useEffect(() => {
    if (mapRef.current && selectedLocation) {
      const newPosition = { lat: selectedLocation.lat, lng: selectedLocation.lng };
      mapRef.current.setCenter(newPosition);
      mapRef.current.setZoom(12);
    }
  }, [selectedLocation]);

  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    if (!mapLoadedRef.current) {
      mapLoadedRef.current = true;
      onMapLoad(map);
    }
  };

  return (
    <Box sx={{ 
      height: '600px',
      display: show ? 'block' : 'none',
      borderRadius: 1,
      overflow: 'hidden',
      boxShadow: 3
    }}>
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <Map
          defaultCenter={selectedLocation ? { 
            lat: selectedLocation.lat, 
            lng: selectedLocation.lng 
          } : { lat: 0, lng: 0 }}
          defaultZoom={selectedLocation ? 12 : 2}
          onClick={onMapClick}
          onBoundsChanged={(e) => {
            if (e.map) {
              handleMapLoad(e.map);
            }
          }}
        >
          {selectedLocation && (
            <Marker 
              position={{ 
                lat: selectedLocation.lat, 
                lng: selectedLocation.lng 
              }}
            />
          )}
        </Map>
      </APIProvider>
    </Box>
  );
};

export default LocationMap; 