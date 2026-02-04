import { View, Text, Pressable, StyleSheet } from 'react-native';
import RadioButton from '@/shared/components/RadioButton';
import { theme } from '@/shared/styles/theme';
import { ReportFormData, ZoneCategory } from '../types';

interface ReportCategorySectionProps {
    formData: ReportFormData;
    updateForm: (data: Partial<ReportFormData>) => void;
}

const CATEGORY_OPTIONS: {
    value: ZoneCategory;
    label: string;
    description: string;
}[] = [
        {
            value: 'CATEGORY_GENERAL',
            label: '일반 흡연구역',
            description: '길거리, 건물 앞 등 개방된 흡연 공간입니다.',
        },
        {
            value: 'CATEGORY_SMOKING_STORE',
            label: '실내 흡연 가능 매장',
            description: '카페, PC방, 술집 등 흡연실이 있는 매장입니다.',
        },
    ];

export default function ReportCategorySection({
    formData,
    updateForm,
}: ReportCategorySectionProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>카테고리 선택</Text>
            <View style={styles.listContainer}>
                {CATEGORY_OPTIONS.map((option) => {
                    const isSelected = formData.category === option.value;
                    return (
                        <Pressable
                            key={option.value}
                            style={[
                                styles.optionBox,
                                isSelected ? styles.optionBoxSelected : styles.optionBoxUnselected,
                            ]}
                            onPress={() => updateForm({ category: option.value })}
                        >
                            <View style={styles.radioContainer}>
                                <View pointerEvents="none">
                                    <RadioButton
                                        selected={isSelected}
                                    />
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={styles.label}>{option.label}</Text>
                                    <Text style={styles.description}>{option.description}</Text>
                                </View>
                            </View>
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
    listContainer: {
        gap: 8,
    },
    optionBox: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderRadius: 12,
        borderWidth: 1,
    },
    optionBoxUnselected: {
        borderColor: theme.colors.gray[90],
        backgroundColor: theme.colors.white,
    },
    optionBoxSelected: {
        borderColor: theme.colors.gray[90],
        backgroundColor: theme.colors.white,
    },
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    textContainer: {
        gap: 2,
        flex: 1,
    },
    label: {
        ...theme.text.b.sb,
        color: theme.colors.text.primary,
    },
    description: {
        ...theme.text.b.r,
        color: theme.colors.gray[60],
    },
});
