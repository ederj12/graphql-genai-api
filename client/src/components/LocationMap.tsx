import React, { useRef } from 'react';
import { Box } from '@mui/material';
import { Map, MapMouseEvent, APIProvider } from '@vis.gl/react-google-maps';

interface LocationMapProps {
  show: boolean;
  onMapClick: (e: MapMouseEvent) => void;
  onMapLoad: (map: google.maps.Map) => void;
}

const LocationMap: React.FC<LocationMapProps> = ({ show, onMapClick, onMapLoad }) => {
  const mapLoadedRef = useRef(false);

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
          defaultCenter={{ lat: 0, lng: 0 }}
          defaultZoom={2}
          onClick={onMapClick}
          onBoundsChanged={(e) => {
            if (e.map && !mapLoadedRef.current) {
              mapLoadedRef.current = true;
              onMapLoad(e.map);
            }
          }}
        />
      </APIProvider>
    </Box>
  );
};

export default LocationMap; 