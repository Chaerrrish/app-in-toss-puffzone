import { theme } from "@/shared/styles/theme";
import { useState } from 'react';
import { ScrollView, StyleSheet } from "react-native";
import { Route } from "./route";
import ReportLocationSection from "./widgets/ReportLocationSection";
import ReportFormSection, { ReportInfoModalType } from "./widgets/ReportFormSection";
import ReportCategorySection from "./widgets/ReportCategorySection";
import ReportFeatureSection from "./widgets/ReportFeatureSection";
import ReportImageSection from "./widgets/ReportImageSection";
import { ReportFormData } from "./types";
import { FixedBottomCTA, FixedBottomCTAProvider } from "@toss/tds-react-native";

export default function ReportScreen() {
    const params = Route.useParams();

    // Form State
    const [formData, setFormData] = useState<ReportFormData>({
        name: '',
        description: '',
        category: 'CATEGORY_GENERAL',
        features: [],
        photos: [],
    });
    const [infoModal, setInfoModal] = useState<ReportInfoModalType>(null);

    const updateForm = (data: Partial<ReportFormData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    return (
        <FixedBottomCTAProvider
            wrapper={ScrollView}
            wrapperProps={{
                contentContainerStyle: styles.scrollContent,
                onTouchStart: () => {
                    if (infoModal) setInfoModal(null); // Close modal on outside tap
                },
                style: styles.container,
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
            <ReportFeatureSection
                formData={formData}
                updateForm={updateForm}
            />
            <ReportImageSection
                formData={formData}
                updateForm={updateForm}
            />
            <FixedBottomCTA loading={false} onPress={() => { }}>다음</FixedBottomCTA>
        </FixedBottomCTAProvider>
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