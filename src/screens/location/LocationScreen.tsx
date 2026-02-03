import { useCallback, useEffect, useRef, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// Granite / Toss imports
import { useNavigation } from '@granite-js/react-native';
import { Asset, FixedBottomCTA, FixedBottomCTAProvider } from '@toss/tds-react-native';

// Local Components & Hooks
import { MoveToCurrentLocationButton } from './components/MoveToCurrentLocationButton';
import { NaverMapSelector, CameraState } from './components/NaverMapView';
import { useReportForm } from './hooks/useReportForm';
import { useReverseGeocode } from './hooks/useReverseGeocode';
import { useMoveToCurrentLocation } from './hooks/useMoveToCurrentLocation';
import { theme } from '@/shared/styles/theme';

const INITIAL_CAMERA: CameraState = {
    latitude: 37.5536,
    longitude: 126.9725,
    zoom: 16,
};

export default function LocationScreen() {
    const params = {
        latitude: undefined,
        longitude: undefined,
        mode: 'new',
        source: 'unknown',
    };

    const navigation = useNavigation();
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
        },
    });

    const handleMoveToCurrent = useCallback(async () => {
        await handleMoveToCurrentLocation();
    }, [handleMoveToCurrentLocation]);

    const handleSelectLocation = useCallback(
        (latitude: number, longitude: number) => {
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
    }, [getAddressFromCoords, hasSelection, selectedCoords, setLocation]);

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
                        <MoveToCurrentLocationButton onPress={handleMoveToCurrent} />
                    </View>
                </View>

                <View style={styles.infoContainer}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.titleText}>흡연구역의 위치를 확인해주세요</Text>
                        <Text style={styles.subtitleText}>지도를 터치하여 흡연구역의 위치를 표시해주세요</Text>
                    </View>

                    <View style={styles.detailsContainer}>
                        <View style={styles.addressBox}>
                            <Text style={[styles.addressLabel, { color: theme.colors.primary[40] }]}>현 위치</Text>
                            <Text style={styles.addressText}>{formData.address || '주소를 가져오는 중...'}</Text>
                        </View>

                        <View style={styles.warningBox}>
                            <Asset.Icon name="icon-info-circle-mono" color="#FFD057" />
                            <Text style={styles.warningText}>지도의 표시와 실제 위치가 맞는지 확인해주세요</Text>
                        </View>
                    </View>
                </View>
            </View>

            <FixedBottomCTAProvider>
                <FixedBottomCTA disabled={!hasSelection} onPress={() => {
                    handleConfirm();
                    navigation.navigate('/report', {
                        latitude: selectedCoords.latitude,
                        longitude: selectedCoords.longitude,
                        address: formData.address || '',
                    });
                }}>해당 위치로 흡연구역을 설정할게요</FixedBottomCTA>
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
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.gray[10],
    },
    subtitleText: {
        fontSize: 16,
        color: theme.colors.gray[30],
    },
    detailsContainer: {
        gap: 16,
    },
    addressBox: {
        padding: 16,
        backgroundColor: theme.colors.primary[95], // grey100 / primary-95 approx
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.colors.primary[80],
        gap: 6,
    },
    addressLabel: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    addressText: {
        fontSize: 16,
        color: theme.colors.gray[20],
    },
    warningBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 10,
        backgroundColor: theme.colors.yellow[90],
        borderRadius: 12,
    },
    warningText: {
        fontSize: 14,
        color: theme.colors.gray[30],
    },
});
