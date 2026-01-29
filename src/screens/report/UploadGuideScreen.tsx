
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { theme } from '@/shared/styles/theme';
import { Asset, FixedBottomCTA, FixedBottomCTAProvider } from '@toss/tds-react-native';
import PhotoOptionBottomSheet from './components/PhotoOptionBottomSheet';
// @ts-ignore
import { showImagePicker } from '@apps-in-toss/framework';
import { fetchAlbumPhotos } from '@apps-in-toss/native-modules';
import { FetchAlbumPhotosPermissionError } from '@apps-in-toss/types';
import { useNavigation } from '@granite-js/react-native';

const GUIDE_IMAGES = [
    {
        image: 'https://puffzone.co.kr/toss/photo_example/1.png',
        label: '흡연공간을 전체적으로 촬영'
    },
    {
        image: 'https://puffzone.co.kr/toss/photo_example/2.png',
        label: '주변환경이 잘 보이게 촬영'
    },
    {
        image: 'https://puffzone.co.kr/toss/photo_example/3.png',
        label: '근접 촬영'
    },
    {
        image: 'https://puffzone.co.kr/toss/photo_example/4.png',
        label: '관련 없는 사진'
    },
    {
        image: 'https://puffzone.co.kr/toss/photo_example/5.png',
        label: '잘 안 보이는 사진'
    },
];


export default function UploadGuideScreen() {
    const navigation = useNavigation();

    const [isPhotoSheetOpen, setIsPhotoSheetOpen] = React.useState(false);

    const handleSelectPhoto = async (type: 'camera' | 'library') => {
        if (type === 'library') {
            try {
                console.log('fetchAlbumPhotos called');
                // @ts-ignore
                const permission = await fetchAlbumPhotos.getPermission();
                console.log('Permission status:', permission);

                if (permission === 'denied' || permission === 'notDetermined') {
                    // @ts-ignore
                    const result = await fetchAlbumPhotos.openPermissionDialog();
                    if (result === 'denied') return;
                }

                // @ts-ignore
                const response = await fetchAlbumPhotos({
                    maxCount: 10,
                    maxWidth: 1024,
                    base64: false,
                });

                if (response && response.length > 0) {
                    const newPhotos = response.map((img: any) => img.dataUri);
                    navigation.navigate('/report', {
                        newPhotos: newPhotos
                    } as any);
                }
            } catch (error) {
                // @ts-ignore
                if (error instanceof FetchAlbumPhotosPermissionError) {
                    // @ts-ignore
                    await fetchAlbumPhotos.openPermissionDialog();
                }
                console.error('앨범을 가져오는 데 실패했어요:', error);
            }
        } else {
            try {
                const result = await showImagePicker({
                    count: 10,
                    type: 'camera',
                });

                if (result && result.length > 0) {
                    navigation.navigate('/report', {
                        newPhotos: result
                    } as any);
                }
            } catch (e) {
                console.error(e);
            }
        }
    };

    return (
        <>
            <FixedBottomCTAProvider>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    style={styles.scrollView}
                >
                    <View style={styles.header}>
                        <Text style={styles.title}>사진 업로드 안내</Text>
                        <Text style={styles.subtitle}>아래 가이드를 참고해 사진을 추가해주세요</Text>
                    </View>

                    <View style={styles.sectionContainer}>
                        {/* Good Examples */}
                        <View style={styles.subSection}>
                            <View style={styles.sectionHeaderRow}>
                                <Asset.Icon name="icon-thumb-up" />
                                <Text style={styles.sectionTitle}>이런 사진을 올려주세요</Text>
                            </View>
                            <View style={styles.tipBox}>
                                <Text style={styles.tipText}>
                                    1. 실제 흡연공간을 촬영해주세요{'\n'}
                                    2. 사용자가 주변 환경을 쉽게 이해할 수 있는 사진을 권장해요
                                </Text>
                            </View>
                            <View style={styles.imageRow}>
                                {GUIDE_IMAGES.slice(0, 2).map((item, index) => (
                                    <View key={index} style={styles.imageContainer}>
                                        <Asset.Image
                                            source={{ uri: item.image }}
                                            frameShape={{ width: 173, height: 120 }}
                                            scaleType="crop"
                                            style={{ borderRadius: 8, backgroundColor: theme.colors.gray[95] }}
                                        />
                                        <Text style={styles.imageLabel}>{item.label}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        <View style={styles.divider} />

                        {/* Bad Examples */}
                        <View style={styles.subSection}>
                            <View style={styles.sectionHeaderRow}>
                                <Asset.Icon name="icon-siren" />
                                <Text style={styles.sectionTitle}>이런 사진은 피해주세요</Text>
                            </View>
                            <View style={styles.tipBox}>
                                <Text style={styles.tipText}>
                                    1. 근접 촬영한 사진{'\n'}
                                    2. 흡연구역과 관련 없는 사진{'\n'}
                                    3. 잘 안 보이는 사진 (낮은 해상도, 흔들린 사진, 너무 어둡거나 밝은 사진)
                                </Text>
                            </View>
                            <View style={styles.imageRow}>
                                {GUIDE_IMAGES.slice(2, 5).map((item, index) => (
                                    <View key={index} style={styles.imageContainer}>
                                        <Asset.Image
                                            source={{ uri: item.image }}
                                            frameShape={{ width: 114, height: 96 }}
                                            scaleType="crop"
                                            style={{ borderRadius: 8, backgroundColor: theme.colors.gray[95] }}
                                        />
                                        <Text style={styles.imageLabel}>{item.label}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <FixedBottomCTA onPress={() => setIsPhotoSheetOpen(true)}>사진 업로드하기</FixedBottomCTA>
            </FixedBottomCTAProvider>

            <PhotoOptionBottomSheet
                isOpen={isPhotoSheetOpen}
                onClose={() => setIsPhotoSheetOpen(false)}
                onSelect={handleSelectPhoto}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 60, // Extra padding for bottom button
        gap: 32,
    },
    header: {
        gap: 8,
    },
    title: {
        ...theme.text['2xl'].b,
        color: theme.colors.text.primary,
    },
    subtitle: {
        ...theme.text.l.r,
        color: theme.colors.text.tertiary,
    },
    sectionContainer: {
        gap: 24,
    },
    subSection: {
        gap: 16,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    sectionTitle: {
        ...theme.text.l.sb,
        color: theme.colors.gray[20],
    },
    tipBox: {
        backgroundColor: theme.colors.gray[98],
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: theme.colors.gray[90],
    },
    tipText: {
        ...theme.text.b.m,
        color: theme.colors.gray[40],
    },
    imageRow: {
        flexDirection: 'row',
        gap: 8,
    },
    imageContainer: {
        flex: 1,
        alignItems: 'center',
        gap: 12,
    },
    divider: {
        height: 0.5,
        backgroundColor: theme.colors.gray[90],
    },
    guideImage: {
        width: '100%',
        height: 120,
        borderRadius: 8,
        backgroundColor: theme.colors.gray[95],
    },
    guideImageSmall: {
        width: '100%',
        height: 96,
        borderRadius: 8,
        backgroundColor: theme.colors.gray[95],
    },
    imageLabel: {
        ...theme.text.m.m,
        color: theme.colors.gray[30],
        textAlign: 'center',
    },
    bottomButtonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: theme.colors.white,
        padding: 16,
        paddingBottom: 34, // Safe area
        borderTopWidth: 1,
        borderTopColor: theme.colors.gray[90],
    },
    button: {
        backgroundColor: theme.colors.brand.primary,
        height: 52,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        ...theme.text.l.sb,
        color: theme.colors.white,
    },
});
