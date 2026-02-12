import { View, Text, StyleSheet, Pressable } from "react-native";
import { theme } from "@/shared/styles/theme";
import { useNavigation } from '@granite-js/react-native';
import { StaticNaverMapView } from "@/screens/report/components";

type ReportLocationSectionProps = {
    address?: string | null;
    latitude: number;
    longitude: number;
};

export default function ReportLocationSection({
    address,
    latitude,
    longitude,
}: ReportLocationSectionProps) {

    const navigation = useNavigation();
    return (
        <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>
                위치 설정
            </Text>
            <View style={styles.contentGap}>
                <Pressable
                    style={styles.mapWrapper}
                    onPress={() => navigation.goBack()}
                >
                    <View style={styles.mapContainer}>
                        <StaticNaverMapView latitude={latitude} longitude={longitude} />
                    </View>
                    <View style={styles.changeBadge}>
                        <Text style={styles.changeBadgeText}>
                            마커 위치 변경하기
                        </Text>
                    </View>
                </Pressable>
                <Text style={styles.addressText}>{address || '주소 없음'}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background.primary,
    },
    scrollContent: {
        padding: 16,
        gap: 32,
    },
    sectionContainer: {
        gap: 16,
    },
    sectionTitle: {
        ...theme.text.l.b,
        color: theme.colors.text.primary,
    },
    contentGap: {
        gap: 8,
    },
    mapWrapper: {
        height: 100,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 8,
    },
    mapContainer: {
        flex: 1,
    },
    changeBadge: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        borderRadius: 6,
        backgroundColor: theme.colors.background.overlay,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    changeBadgeText: {
        ...theme.text.s.sb,
        color: theme.colors.text.white,
    },
    addressText: {
        ...theme.text.m.r,
        color: theme.colors.text.tertiary,
    }
});