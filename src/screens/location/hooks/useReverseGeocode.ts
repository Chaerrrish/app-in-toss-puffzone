import { useCallback } from 'react';

const NAVER_CLIENT_ID = import.meta.env.NAVER_MAP_CLIENT_ID;

export function useReverseGeocode() {
  const getAddressFromCoords = useCallback(async (latitude: number, longitude: number) => {
    try {
      console.log('Reverse Geocode:', latitude, longitude);

      const url = `https://openapi.naver.com/geocoding/v2/reverse?coords=${longitude},${latitude}&output=json&orders=addr,roadaddr`;

      const response = await fetch(url, {
        headers: {
          'X-Naver-Client-Id': NAVER_CLIENT_ID,
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Geocode API error:', response.status, response.statusText);
        return null;
      }

      const data = await response.json();

      console.log('Geocode response:', JSON.stringify(data));

      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        const region = result.region || {};
        const address = result.land || {};

        const sido = region.area1?.name || '';
        const sigungu = region.area2?.name || '';
        const dongmyun = region.area3?.name || '';
        const roadAddress = address.name || '';

        let fullAddress = `${sido} ${sigungu}`;
        if (dongmyun) {
          fullAddress += ` ${dongmyun}`;
        }
        if (roadAddress && roadAddress !== 'unknown') {
          fullAddress += ` ${roadAddress}`;
        }

        return fullAddress.trim();
      }

      console.warn('No results from geocode API');
      return null;
    } catch (error) {
      console.error('Reverse geocode failed:', error);
      return null;
    }
  }, []);

  return { getAddressFromCoords };
}
