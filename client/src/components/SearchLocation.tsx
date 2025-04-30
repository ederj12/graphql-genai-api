import React, { useState, useEffect, useRef } from 'react';
import { TextField, Box, List, ListItem, ListItemText, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { googleMapsLoader } from '../utils/googleMapsLoader';

interface Location {
  lat: number;
  lng: number;
  address: string;
}

interface SearchLocationProps {
  onLocationSelect: (location: Location) => void;
  onClear: () => void;
}

export default function SearchLocation({ onLocationSelect, onClear }: SearchLocationProps) {
  const [searchText, setSearchText] = useState('');
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [autocompleteService, setAutocompleteService] = useState<google.maps.places.AutocompleteService | null>(null);
  const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const initializeServices = async () => {
      try {
        await googleMapsLoader.load({ libraries: ['places'] });
        
        if (window.google) {
          const { AutocompleteService, PlacesService } = await window.google.maps.importLibrary('places') as google.maps.PlacesLibrary;
          setAutocompleteService(new AutocompleteService());
          // Create a temporary div for PlacesService (required)
          const tempDiv = document.createElement('div');
          setPlacesService(new PlacesService(tempDiv));
        }
      } catch (error) {
        console.error('Failed to load Google Maps:', error);
      }
    };

    initializeServices();
  }, []);

  const handleInputChange = async (value: string) => {
    setSearchText(value);
    setSelectedIndex(-1);
    
    if (!value) {
      setPredictions([]);
      onClear();
      return;
    }

    if (!autocompleteService) return;

    try {
      const request: google.maps.places.AutocompletionRequest = {
        input: value,
        types: ['geocode', 'establishment']
      };

      const response = await new Promise<google.maps.places.AutocompletePrediction[]>((resolve, reject) => {
        autocompleteService.getPlacePredictions(
          request,
          (results: google.maps.places.AutocompletePrediction[] | null, status: google.maps.places.PlacesServiceStatus) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
              resolve(results);
            } else {
              reject(status);
            }
          }
        );
      });

      setPredictions(response);
    } catch (error) {
      console.error('Error fetching predictions:', error);
      setPredictions([]);
    }
  };

  const handlePlaceSelect = async (prediction: google.maps.places.AutocompletePrediction) => {
    if (!placesService) return;

    setIsLoading(true);
    try {
      const result = await new Promise<google.maps.places.PlaceResult>((resolve, reject) => {
        placesService.getDetails(
          {
            placeId: prediction.place_id,
            fields: ['name', 'geometry']
          },
          (place: google.maps.places.PlaceResult | null, status: google.maps.places.PlacesServiceStatus) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && place) {
              resolve(place);
            } else {
              reject(status);
            }
          }
        );
      });

      if (result.geometry?.location) {
        const location: Location = {
          lat: result.geometry.location.lat(),
          lng: result.geometry.location.lng(),
          address: result.name || prediction.description
        };
        onLocationSelect(location);
        setSearchText(location.address);
        setPredictions([]);
        setSelectedIndex(-1);
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (predictions.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex((prevIndex) => 
          prevIndex < predictions.length - 1 ? prevIndex + 1 : prevIndex
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex((prevIndex) => 
          prevIndex > 0 ? prevIndex - 1 : prevIndex
        );
        break;
      case 'Enter':
        event.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < predictions.length) {
          handlePlaceSelect(predictions[selectedIndex]);
        }
        break;
      case 'Escape':
        setPredictions([]);
        setSelectedIndex(-1);
        break;
    }
  };

  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const selectedItem = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedItem) {
        selectedItem.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          value={searchText}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search for a location"
          disabled={isLoading}
        />
        <IconButton 
          onClick={() => searchText && handleInputChange(searchText)}
          disabled={isLoading}
        >
          <SearchIcon />
        </IconButton>
      </Box>
      
      {predictions.length > 0 && (
        <List
          ref={listRef}
          sx={{
            position: 'absolute',
            width: '100%',
            bgcolor: 'background.paper',
            boxShadow: 3,
            zIndex: 1,
            maxHeight: 300,
            overflowY: 'auto'
          }}
        >
          {predictions.map((prediction, index) => (
            <ListItem
              key={prediction.place_id}
              button
              onClick={() => handlePlaceSelect(prediction)}
              selected={index === selectedIndex}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                },
                '&.Mui-selected:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                },
              }}
            >
              <ListItemText
                primary={prediction.structured_formatting.main_text}
                secondary={prediction.structured_formatting.secondary_text}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
} 