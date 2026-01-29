
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Image, Alert } from 'react-native';
import { theme } from '@/shared/styles/theme';
import { ReportFormData } from '../types';
import { Asset } from '@toss/tds-react-native';
import PhotoOptionBottomSheet from '../components/PhotoOptionBottomSheet';
// @ts-ignore
import { showImagePicker } from '@apps-in-toss/framework';
import { useNavigation } from '@granite-js/react-native';

const MAX_PHOTOS = 10;

interface ReportImageSectionProps {
    formData: ReportFormData;
    updateForm: (data: Partial<ReportFormData>) => void;
}

export default function ReportImageSection({ formData, updateForm }: ReportImageSectionProps) {
    const navigation = useNavigation();

    const handleRemovePhoto = (index: number) => {
        const newPhotos = [...formData.photos];
        newPhotos.splice(index, 1);
        updateForm({ photos: newPhotos });
    };


    const handleSelectPhoto = async (type: 'camera' | 'library') => {
        try {
            // TODO: Handle 'camera' type specifically if API differs
            const result = await showImagePicker({
                count: MAX_PHOTOS - formData.photos.length,
                type: 'limit', // or based on 'type' arg?
            });

            if (result && result.length > 0) {
                const newUris = result.map((p: any) => p.uri || p).filter(Boolean);
                const combined = [...formData.photos, ...newUris];
                const unique = Array.from(new Set(combined));
                updateForm({ photos: unique });
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>사진 등록</Text>
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
                            onPhotosSelected: (newPhotos: string[]) => {
                                const combined = [...formData.photos, ...newPhotos];
                                const unique = Array.from(new Set(combined));
                                updateForm({ photos: unique });
                            }
                        } as any)
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
    const isActive = currentCount > 0 && currentCount < maxCount;
    return (
        <Pressable onPress={onPress} style={styles.pickerCard}>
            <Asset.Icon name='icon-camera' color={theme.colors.gray[60]} />
            <View style={styles.countContainer}>
                <Text style={[styles.countText, isActive ? styles.textActive : styles.textFull]}>{currentCount}</Text>
                <Text style={styles.countTotal}>/{maxCount}</Text>
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
    countContainer: { flexDirection: 'row' },
    countText: { ...theme.text.m.m },
    countTotal: { ...theme.text.m.r, color: theme.colors.text.tertiary },
    textActive: { color: theme.colors.brand.primary },
    textFull: { color: theme.colors.text.tertiary },

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
