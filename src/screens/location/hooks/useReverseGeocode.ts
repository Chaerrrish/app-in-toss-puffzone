import { useCallback } from 'react';


export function useReverseGeocode() {
    const getAddressFromCoords = useCallback(async (latitude: number, longitude: number) => {
        try {
            console.log('Reverse Geocode:', latitude, longitude);

            const searchParams = new URLSearchParams({
                coords: `${longitude},${latitude}`,
                sourcecrs: 'EPSG:4326',
                targetcrs: 'EPSG:4326',
                orders: 'legalcode,admcode,addr,roadaddr',
                output: 'json',
                provider: 'naver',
            });

            // Assuming the endpoint is /api/map/reverse-geocode based on typical structure
            const url = `https://puffzone.co.kr/api/reverse-geocoding?${searchParams.toString()}`;

            const response = await fetch(url, {
                method: 'GET',
                // User stated: "authentication is possible without adding a separate header"
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
