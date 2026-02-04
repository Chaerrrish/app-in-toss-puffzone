import { useCallback } from 'react';


interface NaverGeocodeResult {
    name: string;
    region: {
        area1: { name: string };
        area2: { name: string };
        area3: { name: string };
    };
    land?: {
        name: string;
        number1: string;
        number2: string;
    };
}

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

            if (data.results && data.results.length > 0) {
                // 도로명 주소 우선 (Road Name Address Priority)
                const roadAddrResult = data.results.find((result: NaverGeocodeResult) => result.name === 'roadaddr');
                if (roadAddrResult?.land?.name && roadAddrResult.region) {
                    const region = roadAddrResult.region;
                    const land = roadAddrResult.land;
                    return `${region.area1.name} ${region.area2.name} ${region.area3.name} ${land.name} ${land.number1}${land.number2 ? '-' + land.number2 : ''}`.trim();
                }

                // 지번 주소 (Jibun Address Priority)
                const addrResult = data.results.find((result: NaverGeocodeResult) => result.name === 'addr');
                if (addrResult?.land && addrResult.region) {
                    const region = addrResult.region;
                    const land = addrResult.land;
                    return `${region.area1.name} ${region.area2.name} ${region.area3.name} ${land.number1}${land.number2 ? '-' + land.number2 : ''}`.trim();
                }

                // 행정구역만 (Region Only Fallback)
                const result = data.results[0];
                if (result?.region) {
                    const region = result.region;
                    return `${region.area1.name} ${region.area2.name} ${region.area3.name}`.trim();
                }

                return null;
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
