import { View, Text, ScrollView, StyleSheet, Pressable, Image } from 'react-native';
import { theme } from '@/shared/styles/theme';
import { ReportFormData } from '@/screens/report/types';
import { Asset } from '@toss/tds-react-native';
import { useNavigation } from '@granite-js/react-native';

const MAX_PHOTOS = 10;

interface ReportImageSectionProps {
    formData: ReportFormData;
    updateForm: (data: Partial<ReportFormData>) => void;
    latitude: number;
    longitude: number;
    address: string;
}



export default function ReportImageSection({ formData, updateForm, latitude, longitude, address }: ReportImageSectionProps) {
    const navigation = useNavigation();

    const handleRemovePhoto = (index: number) => {
        const newPhotos = [...formData.photos];
        newPhotos.splice(index, 1);
        updateForm({ photos: newPhotos });
    };


    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.sectionTitle}>사진 등록</Text>
                <Text style={styles.descriptionText}>한 장 이상의 사진 업로드는 필수예요.</Text>
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <ImagePickerCard
                    currentCount={formData.photos.length}
                    maxCount={MAX_PHOTOS}
                    onPress={() => {
                        navigation.navigate('/upload-guide', {
                            latitude,
                            longitude,
                            address
                        })
                    }}
                />
                {formData.photos.map((uri, index) => (
                    <View key={index + uri} style={styles.imageWrapper}>
                        <Image source={{ uri }} style={styles.image} resizeMode="cover" />
                        <Pressable style={styles.deleteButton} onPress={() => handleRemovePhoto(index)}>
                            <Text style={styles.deleteButtonText}>✕</Text>
                        </Pressable>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

function ImagePickerCard({ currentCount, maxCount, onPress }: { currentCount: number; maxCount: number; onPress: () => void }) {
    const isFull = currentCount >= maxCount;
    const isEmpty = currentCount === 0;

    return (
        <Pressable onPress={onPress} style={styles.pickerCard}>
            <Asset.Icon name='icon-camera' color={isFull ? theme.colors.gray[60] : theme.colors.gray[60]} />
            <View style={styles.countContainer}>
                <Text style={[
                    styles.countText,
                    isEmpty && styles.textEmpty,
                    isFull && styles.textFull
                ]}>{currentCount}</Text>
                <Text style={[
                    styles.countTotal,
                    isFull && styles.textFull
                ]}>/{maxCount}</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: { gap: 12 },
    sectionTitle: { ...theme.text.l.b, color: theme.colors.text.primary },
    scrollContent: { gap: 8, paddingRight: 16 },
    pickerCard: {
        width: 96, height: 96,
        backgroundColor: theme.colors.background.secondary,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    descriptionText: {
        ...theme.text.m.r,
        color: theme.colors.gray[60],
    },
    countContainer: { flexDirection: 'row' },
    countText: { ...theme.text.m.m, color: theme.colors.primary[50] },
    countTotal: { ...theme.text.m.r, color: theme.colors.gray[60] },
    textActive: { color: theme.colors.brand.primary },
    textFull: { ...theme.text.m.m, color: theme.colors.gray[80] },
    textEmpty: { color: theme.colors.gray[60] },
    requireLabel: {
        ...theme.text.l.b,
        color: theme.colors.primary[40],
    },

    imageWrapper: {
        width: 96, height: 96,
        borderRadius: 8,
        overflow: 'hidden',
    },


    image: { width: '100%', height: '100%' },
    deleteButton: {
        position: 'absolute', top: 4, right: 4,
        width: 20, height: 20, borderRadius: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center', justifyContent: 'center',
    },
    deleteButtonText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
});
