import { useCallback } from 'react';
import { Alert, Linking } from 'react-native';
import { getCurrentLocation, Accuracy } from '@apps-in-toss/framework';

import { NaverMapHandle } from '../components/NaverMapView'; // Ensure proper import path

interface UseMoveToCurrentLocationProps {
  mapProvider?: 'google' | 'naver';
  googleMapRef?: unknown;
  naverMapRef?: React.RefObject<NaverMapHandle>;
  onLocationUpdated: (coords: { latitude: number; longitude: number }) => void;
}

export function useMoveToCurrentLocation({ naverMapRef, onLocationUpdated }: UseMoveToCurrentLocationProps) {
  const handleMoveToCurrentLocation = useCallback(async () => {
    try {
      // 1. 권한 확인 및 요청
      const permission = await getCurrentLocation.getPermission();
      console.log('Location permission:', permission);

      if (permission === 'denied' || permission === 'notDetermined') {
        const result = await getCurrentLocation.openPermissionDialog();
        if (result === 'denied') {
          Alert.alert('권한 필요', '위치 정보를 사용하려면 권한 허용이 필요합니다.');
          return;
        }
      }

      console.log('Getting current location (Lowest)...');
      // High/Balanced failed. Trying Lowest to diagnose permission/service issues.
      const location = await getCurrentLocation({ accuracy: Accuracy.Lowest });

      console.log('Current location:', location.coords);

      const currentLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      if (naverMapRef?.current) {
        console.log('[useMoveToCurrentLocation] Animate to:', currentLocation);
        naverMapRef.current.animateCameraTo({
          ...currentLocation,
          zoom: 16,
        });
      } else {
        console.warn('[useMoveToCurrentLocation] naverMapRef is null');
      }

      onLocationUpdated(currentLocation);
    } catch (error) {
      console.error('Failed to get current location:', JSON.stringify(error, null, 2));
      Alert.alert(
        '위치 오류',
        `현재 위치를 가져올 수 없습니다.\n(${JSON.stringify(error)})\n\n정확한 위치가 켜져있는지 확인해주시거나 설정으로 이동해 확인해주세요.`,
        [
          { text: '취소', style: 'cancel' },
          { text: '설정으로 이동', onPress: () => Linking.openSettings() },
        ],
      );
    }
  }, [naverMapRef, onLocationUpdated]);

  return { handleMoveToCurrentLocation };
}
