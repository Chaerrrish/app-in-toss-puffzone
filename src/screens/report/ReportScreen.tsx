import { theme } from "@/shared/styles/theme";
import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Alert, View } from "react-native";
import { Spacing, useNavigation } from "@granite-js/react-native";
import ReportLocationSection from "./widgets/ReportLocationSection";
import { ReportFormData } from "./types";
import ReportFormSection, { ReportInfoModalType } from "./widgets/ReportFormSection";
import { reportZone } from "@/shared/api/report_zone";
import { BottomInfo, FixedBottomCTA, FixedBottomCTAProvider, Post } from "@toss/tds-react-native";
import ReportCategorySection from "./widgets/ReportCategorySection";
import ReportFeatureSection from "./widgets/ReportFeatureSection";
import ReportImageSection from "./widgets/ReportImageSection";

import { Route } from './route';

export default function ReportScreen() {
    const params = Route.useParams() as any;
    const navigation = useNavigation();

    // Form State
    const [formData, setFormData] = useState<ReportFormData>({
        name: '',
        description: '',
        category: 'CATEGORY_GENERAL',
        features: [],
        photos: [],
    });
    const [infoModal, setInfoModal] = useState<ReportInfoModalType>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (params.newPhotos && Array.isArray(params.newPhotos)) {
            // Append new photos
            const newUris = params.newPhotos.map((p: any) => p.uri || p).filter(Boolean);
            setFormData(prev => {
                // Avoid duplicates basic check
                const combined = [...prev.photos, ...newUris];
                // Unique
                const unique = Array.from(new Set(combined));
                return { ...prev, photos: unique };
            });
        }
    }, [params.newPhotos]);

    const updateForm = (data: Partial<ReportFormData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const handleSubmit = async () => {
        if (formData.photos.length === 0) {
            Alert.alert('알림', '최소 1장의 사진을 등록해주세요.');
            return;
        }

        if (!formData.name) {
            Alert.alert('알림', '장소명을 입력해주세요.');
            return;
        }

        setIsSubmitting(true);
        try {
            const imageFiles = formData.photos.map(uri => ({
                uri,
                type: 'image/jpeg', // Default or infer
                name: uri.split('/').pop() || 'upload.jpg',
            }));

            const result = await reportZone({
                name: formData.name,
                lat: Number(params.latitude),
                lng: Number(params.longitude),
                kind: 'SMOKING', // Default for now
                address: params.address,
                description: formData.description,
                category: formData.category,
                features: formData.features,
                // userId: User ID from auth context?
            }, imageFiles);

            if (result.success) {
                navigation.navigate('/success');
            } else {
                Alert.alert('제보 실패', result.error || '알 수 없는 오류가 발생했습니다.');
            }
        } catch (e: any) {
            Alert.alert('오류', e.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <FixedBottomCTAProvider
                wrapper={ScrollView}
                wrapperProps={{
                    onTouchStart: () => {
                        if (infoModal) setInfoModal(null); // Close modal on outside tap
                    },
                    style: styles.container,
                }}
            >
                <View style={styles.scrollContent}>
                    <ReportLocationSection
                        address={params.address ?? ''}
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
                </View>
                <Spacing size={24} />
                <BottomInfo style={{ paddingHorizontal: 0 }}>
                    <Post.H4>유의사항</Post.H4>
                    <Post.Ul>
                        <Post.Li>
                            <Post.Paragraph typography="t6">퍼프존 서비스는 주식회사 포트존에서 제공합니다.</Post.Paragraph>
                        </Post.Li>
                        <Post.Li>
                            <Post.Paragraph typography="t6">포인트 적립은 하루 5번(최대 100p)까지 가능합니다.</Post.Paragraph>
                        </Post.Li>
                        <Post.Li>
                            <Post.Paragraph typography="t6">{`지급된 포인트는 [혜택 -> 내 포인트] 에서 확인하실 수 있습니다.`}</Post.Paragraph>
                        </Post.Li>
                        <Post.Li>
                            <Post.Paragraph typography="t6">네트워크 장애 등으로 인해 포인트 지급이 지연될 수 있습니다.</Post.Paragraph>
                        </Post.Li>
                    </Post.Ul>
                </BottomInfo>
                <FixedBottomCTA loading={isSubmitting} onPress={handleSubmit}>
                    제보하기
                </FixedBottomCTA>
            </FixedBottomCTAProvider>

        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background.primary,
    },
    scrollContent: {
        gap: 32,
        paddingHorizontal: 16,
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