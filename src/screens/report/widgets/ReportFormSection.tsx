import { View, Text, StyleSheet, Pressable } from "react-native";
import { theme } from "@/shared/styles/theme";
import { HBar } from "@/shared/components/Divider";
import { BaseTextInput } from "@/shared/components/TextInput";
import { Asset } from '@toss/tds-react-native'; // Use Toss Asset if available, or fallbacks
import { ReportFormData } from '../types';

// Types (simplified for now, ideally import from types file)
export type ReportInfoModalType = 'name' | 'description' | null;

type ReportFormSectionProps = {
    formData: ReportFormData;
    updateForm: (data: Partial<ReportFormData>) => void;
    infoModal: ReportInfoModalType;
    onInfoModalChange: (modal: ReportInfoModalType) => void;
};


export default function ReportFormSection({
    formData,
    updateForm,
    infoModal,
    onInfoModalChange,
}: ReportFormSectionProps) {

    const toggleInfoModal = (target: ReportInfoModalType) => {
        onInfoModalChange(infoModal === target ? null : target);
    };

    return (
        <View style={styles.container}>
            {/* Name Field */}
            <View style={[styles.fieldContainer, infoModal === 'name' && { zIndex: 10 }]}>
                <View style={styles.labelRow}>
                    <Text style={styles.labelText}>
                        장소 이름
                    </Text>
                    <Pressable
                        style={styles.infoIconWrapper}
                        onPress={() => toggleInfoModal('name')}
                        hitSlop={8}
                    >
                        <Asset.Icon name="icon-info-circle-line-mono" color={theme.colors.gray[80]} />
                    </Pressable>
                </View>

                {infoModal === 'name' && (
                    <View style={styles.infoModal} onTouchStart={(e) => e.stopPropagation()}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Asset.Icon name="icon-info-circle-mono" color={theme.colors.primary[50]} />
                                <Text style={styles.modalTitle}>작성안내</Text>
                            </View>
                            <Text style={styles.modalDescription}>흡연구역 근처에 있는 찾기 쉬운 건물을 기준으로 장소명을 입력해주세요</Text>
                        </View>
                        <HBar />
                        <Text style={styles.modalFooter}>예: ‘강남역 2번 출구 흡연부스’, ‘○○빌딩 앞 흡연구역’, ‘△△공원 입구 흡연구역’, ‘□□타워 뒤편 흡연부스’, ‘◇◇주차장 옆 흡연구역’</Text>
                    </View>
                )}

                <BaseTextInput
                    placeholder="예: OO역 1번출구 옆 골목"
                    value={formData.name}
                    onChangeText={(text) => updateForm({ name: text })}
                />
            </View>

            {/* Description Field */}
            <View style={[styles.fieldContainer, infoModal === 'description' && { zIndex: 10 }]}>
                <View style={styles.labelRow}>
                    <Text style={styles.labelText}>
                        위치 설명
                    </Text>
                    <Pressable
                        style={styles.infoIconWrapper}
                        onPress={() => toggleInfoModal('description')}
                        hitSlop={8}
                    >
                        <Asset.Icon name="icon-info-circle-line-mono" color={theme.colors.gray[80]} />
                    </Pressable>
                </View>

                {infoModal === 'description' && (
                    <View style={styles.infoModal} onTouchStart={(e) => e.stopPropagation()}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Asset.Icon name="icon-info-circle-mono" color={theme.colors.primary[50]} />
                                <Text style={styles.modalTitle}>작성안내</Text>
                            </View>
                            <Text style={styles.modalDescription}>흡연구역을 쉽게 찾을 수 있도록, 구체적인 위치 또는 길 안내를 작성해주세요</Text>
                        </View>
                        <HBar />
                        <Text style={styles.modalFooter}>예: ‘가산디지털단지역 11번 출구에서 나와 배스킨라빈스 오른쪽 골목으로 30m 들어간 곳에 위치합니다.’, ‘○○빌딩 정문을 기준으로 왼쪽으로 20m 직진하면 보이는 유리 흡연부스입니다.’, ‘△△공원 입구에서 우측 산책로로 50m 이동하면 나오는 벤치 옆 흡연구역입니다.’</Text>
                    </View>
                )}

                <BaseTextInput
                    placeholder='예: OO역 1번출구에서 오른쪽으로 돌면 있습니다'
                    value={formData.description}
                    onChangeText={(text) => updateForm({ description: text })}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 32, // Consistent vertical spacing
    },
    fieldContainer: {
        gap: 12,
        zIndex: 1, // Default zIndex
        // To allow modal overlap naturally, specific zIndex management might be needed on parents or here
        position: 'relative',
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    labelText: {
        ...theme.text.l.b,
        color: theme.colors.text.primary,
    },
    infoIconWrapper: {
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoModal: {
        position: 'absolute',
        top: 32, // Adjusted top offset
        left: 0,
        right: 0,
        zIndex: 100, // High zIndex to float above
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        gap: 16,
        // Drop shadow
        shadowColor: theme.colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 10,
        borderWidth: 1,
        borderColor: theme.colors.gray[90],
    },
    modalContent: {
        gap: 8,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    modalTitle: {
        ...theme.text.b.b,
        color: theme.colors.text.secondary,
    },
    modalDescription: {
        ...theme.text.b.r,
        color: theme.colors.text.secondary, // gray-20/gray-30?
    },
    modalFooter: {
        ...theme.text.m.m,
        color: theme.colors.text.tertiary,
    },
});