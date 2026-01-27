import { useCallback, useEffect, useRef, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// Granite / Toss imports
import { useNavigation } from '@granite-js/react-native';
import { Asset, FixedBottomCTA, FixedBottomCTAProvider } from '@toss/tds-react-native';
import { useAdaptive } from '@toss/tds-react-native/private';

// Local Components & Hooks
import { MoveToCurrentLocationButton } from './components/MoveToCurrentLocationButton';
import { NaverMapSelector, CameraState } from './components/NaverMapView';
import { useReportForm } from './hooks/useReportForm';
import { useReverseGeocode } from './hooks/useReverseGeocode';
import { useMoveToCurrentLocation } from './hooks/useMoveToCurrentLocation';

const INITIAL_CAMERA: CameraState = {
    latitude: 37.5536,
    longitude: 126.9725,
    zoom: 16,
};

export default function LocationScreen() {
    // Mock params support since useLocalSearchParams is Expo; using defaults or assuming nav params if available
    const params = {
        latitude: undefined,
        longitude: undefined,
        mode: 'new',
        source: 'unknown',
    };

    const navigation = useNavigation();
    const adaptive = useAdaptive();
    const insets = useSafeAreaInsets();

    const naverMapRef = useRef<any>(null); // Type 'any' for mock

    const { formData, setLocation } = useReportForm();
    const { getAddressFromCoords } = useReverseGeocode();

    const initialCoords = {
        latitude: params.latitude ? Number(params.latitude) : (formData.latitude ?? INITIAL_CAMERA.latitude),
        longitude: params.longitude ? Number(params.longitude) : (formData.longitude ?? INITIAL_CAMERA.longitude),
    };

    const [camera, setCamera] = useState<CameraState>(() => ({
        ...initialCoords,
        zoom: INITIAL_CAMERA.zoom,
    }));

    const [selectedCoords, setSelectedCoords] = useState<{
        latitude: number;
        longitude: number;
    }>(initialCoords);

    const [hasSelection, setHasSelection] = useState(true);
    const [isAtCurrentLocation, setIsAtCurrentLocation] = useState(false);

    const { handleMoveToCurrentLocation } = useMoveToCurrentLocation({
        naverMapRef,
        onLocationUpdated: ({ latitude, longitude }) => {
            setSelectedCoords({ latitude, longitude });
            setHasSelection(true);
            setCamera((prev) => ({
                ...prev,
                latitude,
                longitude,
            }));
            setLocation({
                latitude,
                longitude,
                address: '',
            });
            setIsAtCurrentLocation(true);
        },
    });

    const handleMoveToCurrent = useCallback(async () => {
        await handleMoveToCurrentLocation();
    }, [handleMoveToCurrentLocation]);

    const handleSelectLocation = useCallback(
        (latitude: number, longitude: number) => {
            setSelectedCoords({ latitude, longitude });
            setHasSelection(true);
            setIsAtCurrentLocation(false);
            setCamera((prev) => ({
                ...prev,
                latitude,
                longitude,
            }));
            setLocation({
                latitude,
                longitude,
                address: '',
            });
        },
        [setLocation]
    );

    const handleCameraChange = useCallback((newCamera: CameraState) => {
        setCamera(newCamera);
    }, []);

    const handleConfirm = useCallback(async () => {
        if (!hasSelection || !selectedCoords) {
            return;
        }

        const address = await getAddressFromCoords(selectedCoords.latitude, selectedCoords.longitude);

        setLocation({
            latitude: selectedCoords.latitude,
            longitude: selectedCoords.longitude,
            address: address ?? '',
        });

        console.log('Confirmed location:', selectedCoords, address);
        // Navigate away - replace router.back() or router.replace()
        navigation.pop();
    }, [getAddressFromCoords, hasSelection, selectedCoords, setLocation, navigation]);

    // Auto-move to current location when screen loads
    useEffect(() => {
        handleMoveToCurrent();
    }, []);

    useEffect(() => {
        if (!hasSelection || !selectedCoords) {
            return;
        }

        const fetchAddress = async () => {
            const address = await getAddressFromCoords(selectedCoords.latitude, selectedCoords.longitude);

            if (address !== null) {
                setLocation({
                    latitude: selectedCoords.latitude,
                    longitude: selectedCoords.longitude,
                    address,
                });
            }
        };

        void fetchAddress();
    }, [getAddressFromCoords, hasSelection, selectedCoords, setLocation]);

    return (
        <View style={[styles.container, { paddingBottom: insets.bottom }]}>
            <View style={styles.contentContainer}>
                <View style={styles.mapContainer}>
                    <NaverMapSelector
                        camera={camera}
                        mapRef={naverMapRef}
                        selectedLocation={selectedCoords}
                        onCameraChange={handleCameraChange}
                        onMapTap={handleSelectLocation}
                    />

                    <View pointerEvents="box-none" style={styles.floatingButtonContainer}>
                        <MoveToCurrentLocationButton isAtCurrentLocation={isAtCurrentLocation} onPress={handleMoveToCurrent} />
                    </View>
                </View>

                <View style={styles.infoContainer}>
                    <View style={styles.titleContainer}>
                        {/* Replaced t('...') with hardcoded or variable strings as i18n not imported */}
                        <Text style={styles.titleText}>위치 선택</Text>
                        <Text style={styles.subtitleText}>지도를 움직여 위치를 조정해보세요</Text>
                    </View>

                    <View style={styles.detailsContainer}>
                        <View style={styles.addressBox}>
                            <Text style={[styles.addressLabel, { color: adaptive.blue500 }]}>현재 주소</Text>
                            <Text style={styles.addressText}>{formData.address || '주소를 가져오는 중...'}</Text>
                        </View>

                        {/* Warning Box */}
                        <View style={styles.warningBox}>
                            {/* Asset Icon for warning if available, else text */}
                            <Asset.Icon name="icon-info-circle-mono" color="#FFD057" />
                            <Text style={styles.warningText}>정확한 리포트를 위해 위치를 확인해주세요.</Text>
                        </View>
                    </View>
                </View>
            </View>

            <FixedBottomCTAProvider>
                <FixedBottomCTA onPress={handleConfirm}>확인</FixedBottomCTA>
            </FixedBottomCTAProvider>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    mapContainer: {
        height: '100%',
        position: 'relative',
    },
    floatingButtonContainer: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        zIndex: 10,
    },
    infoContainer: {
        paddingHorizontal: 16,
        paddingVertical: 24,
        backgroundColor: '#fff',
        gap: 24,
    },
    titleContainer: {
        gap: 4,
    },
    titleText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333D4B', // grey900
    },
    subtitleText: {
        fontSize: 16,
        color: '#8B95A1', // grey600
    },
    detailsContainer: {
        gap: 16,
    },
    addressBox: {
        padding: 16,
        backgroundColor: '#F2F4F6', // grey100 / primary-95 approx
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E8EB',
        gap: 6,
    },
    addressLabel: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    addressText: {
        fontSize: 16,
        color: '#4E5968', // grey700
    },
    warningBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 10,
        backgroundColor: '#FEFBE8', // yellow-90 approx
        borderRadius: 12,
    },
    warningText: {
        fontSize: 14,
        color: '#6B7684', // grey600
    },
});
