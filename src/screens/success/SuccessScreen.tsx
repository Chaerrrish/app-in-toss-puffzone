import { View } from "react-native";
import { Spacing, useNavigation, createRoute } from "@granite-js/react-native";
import { Asset, Badge, BottomSheet, Button, ConfirmDialog, FixedBottomCTA, FixedBottomCTAProvider, Toast, Txt } from "@toss/tds-react-native";
import { useAdaptive } from "@toss/tds-react-native/private";
import { useEffect, useState } from "react";
import { GoogleAdMob, closeView } from "@apps-in-toss/framework";
import { claimZoneReward, unlockAd } from '@/shared/api/reward';
import { z } from 'zod';

const AD_GROUP_ID = 'ait.v2.live.b3e078a776ce4fc5';

function useGoogleAdMob() {
    // Load ad on mount
    useEffect(() => {
        console.log('useGoogleAdMob: useEffect started');
        if (GoogleAdMob.loadAppsInTossAdMob.isSupported() !== true) {
            console.log('useGoogleAdMob: loadAppsInTossAdMob is not supported');
            return;
        }
        console.log('useGoogleAdMob: Starting loadAppsInTossAdMob');

        let cleanup: (() => void) | undefined;

        try {
            cleanup = GoogleAdMob.loadAppsInTossAdMob({
                options: {
                    adGroupId: AD_GROUP_ID,
                },
                onEvent: (event) => {
                    switch (event.type) {
                        case 'loaded':
                            console.log('광고 로드 성공', event.data);
                            break;
                    }
                },
                onError: (error) => {
                    console.error('광고 불러오기 실패', error);
                },
            });
        } catch (e) {
            console.error('loadAppsInTossAdMob execution failed', e);
        }

        return () => {
            cleanup?.();
        };
    }, []);

    const showAd = (onSuccess: () => void) => {
        if (GoogleAdMob.showAppsInTossAdMob.isSupported() !== true) {
            console.log('useGoogleAdMob: showAppsInTossAdMob is not supported');
            // Fallback for dev/unsupported env -> treat as success
            onSuccess();
            return;
        }

        GoogleAdMob.showAppsInTossAdMob({
            options: {
                adGroupId: AD_GROUP_ID,
            },
            onEvent: (event) => {
                if (event.type === 'userEarnedReward') {
                    console.log('광고 시청 보상이 지급되었습니다.');
                    onSuccess();
                }
            },
            onError: (error) => {
                console.error('광고 표시 중 오류 발생', error);
                // Optional: decide whether to navigate anyway or show error
            },
        });
    };

    return { showAd };
}

export default function SuccessScreen() {
    const { showAd } = useGoogleAdMob();
    const navigation = useNavigation();
    const adaptive = useAdaptive();
    const params = Route.useParams();
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
    // isToastOpen removed
    const [isPromotionSuccess, setIsPromotionSuccess] = useState(false);
    const [isPromotionFailure, setIsPromotionFailure] = useState(false);
    const [isRewarding, setIsRewarding] = useState(false);

    const [isLimitReachedBottomSheetOpen, setIsLimitReachedBottomSheetOpen] = useState(false);

    // Exit Dialog State
    const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);

    const handleReward = async () => {
        if (!params.zoneId) {
            console.error('Zone ID missing, cannot claim reward');
            return;
        }

        if (isRewarding) return; // Prevent double click
        setIsRewarding(true);

        try {
            const result = await claimZoneReward(params.zoneId);

            if (result.status === 'NEED_AD') {
                console.log('광고 시청 필요');
                setIsBottomSheetOpen(true);
                // We don't set Success/Failure here, just prompt Ad
                // Showing a toast manually if possible or using the failure state with custom text?
                // The existing toast is for failure.
                // Let's assume the user understands they need to watch ad since bottom sheet opens.
                return;
            }

            if (result.status === 'LIMIT_EXCEEDED') {
                console.log('일일 한도 초과');
                setIsLimitReachedBottomSheetOpen(true);
                return;
            }

            if (result.success || result.alreadyRewarded) {
                console.log('프로모션 지급 성공', result);
                setIsBottomSheetOpen(true);
                setIsPromotionSuccess(true);
            } else {
                console.error('프로모션 지급 실패', result.error);
                setIsPromotionFailure(true);
            }
        } catch (e) {
            console.error('Reward error:', e);
            setIsPromotionFailure(true);
        } finally {
            setIsRewarding(false);
        }
    };


    const handleConfirmExit = () => {
        setIsExitDialogOpen(false);
        closeView();
    };

    const handleAdReward = () => {
        showAd(async () => {
            // Unlock Ad status on server
            await unlockAd();

            // Navigate to report screen for additional report
            navigation.navigate('/location');
        });
    };


    return (
        <>
            <View style={{ alignItems: 'center', paddingHorizontal: 24 }}>
                <Spacing size={160} />

                <Asset.Image
                    source={{ uri: 'https://static.toss.im/icons/svg/icon-check-circle-green.svg' }}
                    frameShape={{ width: 64, height: 64 }}
                />
                <Spacing size={48} />
                <Txt color={adaptive.grey800} typography="t2" fontWeight="bold" style={{ textAlign: 'center' }}>
                    제보가 완료되었어요!
                </Txt>
                <Spacing size={8} />
                <Txt color={adaptive.grey700} style={{ textAlign: 'center' }}>내 주변 흡연구역 정보, 퍼프존</Txt>
            </View>
            <FixedBottomCTAProvider>
                <FixedBottomCTA.Double
                    rightButton={
                        <Button
                            type="dark"
                            style="weak"
                            display="block"
                            disabled={false}
                            loading={false}
                            onPress={() => setIsExitDialogOpen(true)}
                        >
                            닫기
                        </Button>
                    }
                    leftButton={
                        <Button
                            type="primary"
                            style="fill"
                            display="block"
                            loading={isRewarding}
                            disabled={isPromotionSuccess}
                            textStyle={{ paddingLeft: 8 }}
                            containerStyle={{ paddingLeft: 16 }}
                            onPress={handleReward}
                            leftAccessory={
                                <Asset.Icon name='icon-point-collect' />
                            }
                        >
                            {isPromotionSuccess ? '토스 포인트 지급 완료' : '토스 포인트 20p 받기'}
                        </Button>
                    }
                />
            </FixedBottomCTAProvider>
            {/* Ad Reward BottomSheet */}
            <BottomSheet.Root open={isBottomSheetOpen} onClose={() => { setIsBottomSheetOpen(false) }}>
                <Spacing size={16} />
                <BottomSheet.Header>{`광고 시청 후 \n흡연구역을 하나 더 제보할 수 있어요`}</BottomSheet.Header>
                <BottomSheet.HeaderDescription>흡연구역 추가 제보 후 20p 더 받아가세요</BottomSheet.HeaderDescription>
                <BottomSheet.CTA.Double
                    leftButton={
                        <Button
                            type="primary"
                            style="fill"
                            display="block"
                            disabled={false}
                            textStyle={{ paddingLeft: 8 }}
                            containerStyle={{ paddingLeft: 16 }}
                            leftAccessory={
                                <Badge size="small" type="green" badgeStyle="fill">
                                    AD
                                </Badge>}
                            onPress={handleAdReward}
                        >
                            광고 보고 20p 더 받기
                        </Button>
                    }
                    rightButton={
                        <Button
                            type="dark"
                            style="weak"
                            display="block"
                            disabled={false}
                            loading={false}
                            onPress={() => setIsBottomSheetOpen(false)}
                        >
                            닫기
                        </Button>
                    }
                />
            </BottomSheet.Root>

            {/* Limit Reached BottomSheet */}
            <BottomSheet.Root open={isLimitReachedBottomSheetOpen} onClose={() => { setIsLimitReachedBottomSheetOpen(false) }}>
                <Spacing size={16} />
                <BottomSheet.Header>{`오늘 받을 수 있는 \n포인트를 모두 받았어요`}</BottomSheet.Header>
                <BottomSheet.HeaderDescription>{`내일 또 포인트를 받을 수 있어요.\n흡연구역 제보하고 매일 최대 100p 받아가세요.`}</BottomSheet.HeaderDescription>
                <View style={{ alignItems: 'center', paddingTop: 24 }}>
                    <Asset.Icon
                        frameShape={{ width: 96, height: 96 }}
                        name="icon-money-bag-warning-orange"
                    />
                </View>
                <BottomSheet.CTA
                    type="primary"
                    style="fill"
                    onPress={() => { setIsLimitReachedBottomSheetOpen(false) }}
                >
                    확인
                </BottomSheet.CTA>
            </BottomSheet.Root>

            <Toast
                open={isPromotionFailure}
                text="포인트가 지급되지 않았어요"
                position="top"
                icon={<Toast.LottieIcon preset type="error" />}
                onClose={() => setIsPromotionFailure(false)}
            />
            <ConfirmDialog
                open={isExitDialogOpen}
                title='퍼프존을 종료할까요?'
                leftButton={<ConfirmDialog.Button style="weak" type="light" onPress={() => setIsExitDialogOpen(false)}>취소</ConfirmDialog.Button>}
                rightButton={<ConfirmDialog.Button onPress={handleConfirmExit}>종료하기</ConfirmDialog.Button>}
                onClose={() => setIsExitDialogOpen(false)}
                onExited={() => { }}
            />
        </>
    );
}

export const Route = createRoute('/success', {
    component: SuccessScreen,
    validateParams: z.object({
        zoneId: z.string().optional(),
    }),
});
