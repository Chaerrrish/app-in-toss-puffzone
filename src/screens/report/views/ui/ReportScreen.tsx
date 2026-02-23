import { theme } from '@/shared/styles/theme';
import { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Spacing, useNavigation, createRoute } from '@granite-js/react-native';
import { z as zod } from 'zod';
import { ReportFormData, ReportInfoModalType } from '@/screens/report';
import { reportZone } from "@/shared/api/report_zone";
import { BottomInfo, FixedBottomCTA, FixedBottomCTAProvider, Post, AlertDialog, Toast } from '@toss/tds-react-native';
import { ReportCategorySection, ReportFeatureSection, ReportFormSection, ReportImageSection, ReportLocationSection } from '@/screens/report/widgets';

export interface ReportScreenParams {
    latitude: number;
    longitude: number;
    address: string;
    newPhotos?: (string | { uri: string })[];
}

export default function ReportScreen() {
    const params = Route.useParams() as unknown as ReportScreenParams;
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
    const [isSubmittingFailed, setIsSubmittingFailed] = useState(false);

    // Alert State
    const [alertConfig, setAlertConfig] = useState<{
        open: boolean;
        title: string;
        description: string;
    }>({
        open: false,
        title: '',
        description: '',
    });

    const showAlert = (title: string, description: string) => {
        setAlertConfig({ open: true, title, description });
    };

    useEffect(() => {
        if (params.newPhotos && Array.isArray(params.newPhotos)) {
            // Append new photos
            const newUris = params.newPhotos
                .map((p) => {
                    if (typeof p === 'string') return p;
                    return p.uri;
                })
                .filter(Boolean) as string[];
            setFormData((prev) => {
                // Avoid duplicates basic check
                const combined = [...prev.photos, ...newUris];
                // Unique
                const unique = Array.from(new Set(combined));

                if (unique.length > 10) {
                    showAlert('알림', '사진은 최대 10장까지만 업로드할 수 있습니다.');
                    return { ...prev, photos: unique.slice(0, 10) };
                }

                return { ...prev, photos: unique };
            });
        }
    }, [params.newPhotos]);

    const updateForm = (data: Partial<ReportFormData>) => {
        setFormData((prev) => ({ ...prev, ...data }));
    };

    const handleSubmit = async () => {
        if (formData.photos.length === 0) {
            showAlert('알림', '최소 1장의 사진을 등록해주세요.');
            return;
        }

        if (!formData.name) {
            showAlert('알림', '장소명을 입력해주세요.');
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
            }, imageFiles);

            if (result.success && result.zoneId) {
                navigation.replace('/success', { zoneId: result.zoneId });
            } else {
                setIsSubmittingFailed(true);
            }
        } catch (e: unknown) {
            setIsSubmittingFailed(true);
            console.error('Report failed:', e);
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
                        latitude={Number(params.latitude)}
                        longitude={Number(params.longitude)}
                    />
                    <ReportFormSection
                        formData={formData}
                        updateForm={updateForm}
                        infoModal={infoModal}
                        onInfoModalChange={setInfoModal}
                    />
                    <ReportCategorySection formData={formData} updateForm={updateForm} />
                    <ReportFeatureSection formData={formData} updateForm={updateForm} />
                    <ReportImageSection
                        formData={formData}
                        updateForm={updateForm}
                        latitude={Number(params.latitude)}
                        longitude={Number(params.longitude)}
                        address={params.address}
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
                            <Post.Paragraph typography="t6">포인트 적립은 하루 2번(최대 40p)까지 가능합니다.</Post.Paragraph>
                        </Post.Li>
                        <Post.Li>
                            <Post.Paragraph typography="t6">{`지급된 포인트는 [혜택] > [내 포인트]에서 확인하실 수 있습니다.`}</Post.Paragraph>
                        </Post.Li>
                        <Post.Li>
                            <Post.Paragraph typography="t6">
                                네트워크 장애 등으로 인해 포인트 지급이 지연될 수 있습니다.
                            </Post.Paragraph>
                        </Post.Li>
                    </Post.Ul>
                </BottomInfo>
                <FixedBottomCTA
                    loading={isSubmitting}
                    onPress={handleSubmit}
                    disabled={!formData.name || !formData.description || formData.photos.length === 0}
                >
                    제보하기
                </FixedBottomCTA>
            </FixedBottomCTAProvider>
            <Toast
                open={isSubmittingFailed}
                text="제보에 실패했어요"
                position="top"
                icon={<Toast.LottieIcon preset type="error" />}
                onClose={() => setIsSubmittingFailed(false)}
            />

            <AlertDialog
                open={alertConfig.open}
                title={alertConfig.title}
                description={alertConfig.description}
                buttonText="확인"
                onButtonPress={() => setAlertConfig((prev) => ({ ...prev, open: false }))}
                onClose={() => setAlertConfig((prev) => ({ ...prev, open: false }))}
                onExited={() => { }}
            />
        </>
    );
}

export const Route = createRoute('/report', {
    component: ReportScreen,
    validateParams: zod.object({
        latitude: zod.number(),
        longitude: zod.number(),
        address: zod.string(),
        newPhotos: zod.array(zod.union([zod.string(), zod.object({ uri: zod.string() })])).optional(),
    }),
});

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
    },
});
