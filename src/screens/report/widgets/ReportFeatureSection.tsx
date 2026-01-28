import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { theme } from '@/shared/styles/theme';
import { ReportFormData, ZoneFeature } from '../types';

interface ReportFeatureSectionProps {
    formData: ReportFormData;
    updateForm: (data: Partial<ReportFormData>) => void;
}

const FEATURE_OPTIONS: { code: ZoneFeature; label: string }[] = [
    { code: 'OPEN', label: '개방형' },
    { code: 'CLOSED', label: '폐쇄형' },
    { code: 'CLEAN', label: '깨끗함' },
    { code: 'GOOD_VENTILATION', label: '환기 잘 됨' },
    { code: 'HAS_ROOF', label: '지붕이 있음' },
    { code: 'HAS_SEATING', label: '앉을 곳이 있음' },
    { code: 'HAS_AIR_CONDITIONING', label: '냉방/난방' },
    { code: 'HAS_SPACE', label: '공간 넓음' },
    { code: 'EASY_TO_FIND', label: '찾기 쉬움' },
];

export default function ReportFeatureSection({
    formData,
    updateForm,
}: ReportFeatureSectionProps) {
    const toggleFeature = (code: ZoneFeature) => {
        const hasCode = formData.features.includes(code);
        updateForm({
            features: hasCode
                ? formData.features.filter((feature) => feature !== code)
                : [...formData.features, code],
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>특징</Text>
            <View style={styles.chipContainer}>
                {FEATURE_OPTIONS.map((option) => {
                    const isSelected = formData.features.includes(option.code);
                    return (
                        <Pressable
                            key={option.code}
                            style={[
                                styles.chip,
                                isSelected ? styles.chipSelected : styles.chipUnselected,
                            ]}
                            onPress={() => toggleFeature(option.code)}
                        >
                            <Text
                                style={[
                                    styles.chipText,
                                    isSelected ? styles.chipTextSelected : styles.chipTextUnselected,
                                ]}
                            >
                                {option.label}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 12,
    },
    sectionTitle: {
        ...theme.text.l.b,
        color: theme.colors.text.primary,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        paddingVertical: 8,
        paddingHorizontal: 12, // Visual estimation from image
        borderRadius: 20, // Rounded pill shape
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chipUnselected: {
        backgroundColor: theme.colors.white,
        borderColor: theme.colors.gray[90], // Light gray border
    },
    chipSelected: {
        backgroundColor: theme.colors.white,
        borderColor: theme.colors.primary[30], // Green border
    },
    chipText: {
        ...theme.text.b.m,
    },
    chipTextUnselected: {
        color: theme.colors.gray[50], // Gray text
    },
    chipTextSelected: {
        color: theme.colors.text.primary, // Darker text for selected state (or theme.text.primary)
    },
});
