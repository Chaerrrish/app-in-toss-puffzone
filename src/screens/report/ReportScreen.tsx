import { theme } from "@/shared/styles/theme";
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from "react-native";
import { Route } from "./route";
import ReportLocationSection from "./widgets/ReportLocationSection";
import ReportFormSection, { ReportInfoModalType } from "./widgets/ReportFormSection";
import ReportCategorySection from "./widgets/ReportCategorySection";
import { ReportFormData } from "./types";

export default function ReportScreen() {
    const params = Route.useParams();

    // Form State
    const [formData, setFormData] = useState<ReportFormData>({
        name: '',
        description: '',
        category: 'CATEGORY_GENERAL',
    });
    const [infoModal, setInfoModal] = useState<ReportInfoModalType>(null);

    const updateForm = (data: Partial<ReportFormData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                onTouchStart={() => {
                    if (infoModal) setInfoModal(null); // Close modal on outside tap
                }}
            >
                <ReportLocationSection
                    address={params.address}
                    latitude={params.latitude}
                    longitude={params.longitude}
                />
                <ReportFormSection
                    formData={formData}
                    updateForm={updateForm}
                    infoModal={infoModal}
                    onInfoModalChange={setInfoModal}
                />
                <ReportCategorySection
                    formData={formData}
                    updateForm={updateForm}
                />
            </ScrollView>
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