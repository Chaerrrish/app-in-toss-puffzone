import { useCallback } from 'react';
import { getCurrentLocation, Accuracy } from '@apps-in-toss/framework';

interface UseMoveToCurrentLocationProps {
  mapProvider?: 'google' | 'naver';
  googleMapRef?: any;
  naverMapRef?: any;
  onLocationUpdated: (coords: { latitude: number; longitude: number }) => void;
}

export function useMoveToCurrentLocation({ naverMapRef, onLocationUpdated }: UseMoveToCurrentLocationProps) {
  const handleMoveToCurrentLocation = useCallback(async () => {
    try {
      console.log('Getting current location...');
      const location = await getCurrentLocation({
        accuracy: Accuracy.High,
      });

      console.log('Current location:', location.coords);

      const currentLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      if (naverMapRef.current) {
        naverMapRef.current.animateCameraTo({
          ...currentLocation,
          zoom: 16,
        });
      }

      onLocationUpdated(currentLocation);
    } catch (error) {
      console.error('Failed to get current location:', error);
    }
  }, [naverMapRef, onLocationUpdated]);

  return { handleMoveToCurrentLocation };
}
