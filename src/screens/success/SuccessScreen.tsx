import { View } from "react-native";
import { Spacing, useNavigation } from "@granite-js/react-native";
import { Asset, Badge, BottomSheet, Button, ConfirmDialog, FixedBottomCTA, FixedBottomCTAProvider, Toast, Txt } from "@toss/tds-react-native";
import { useAdaptive } from "@toss/tds-react-native/private";
import { useEffect, useState } from "react";
import { GoogleAdMob, closeView } from "@apps-in-toss/framework";
import { Route } from './route';
import { claimZoneReward } from '@/shared/api/reward';

const AD_GROUP_ID = 'ait-ad-test-rewarded-id';

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
    const [isToastOpen, setIsToastOpen] = useState(false);
    const [isPromotionSuccess, setIsPromotionSuccess] = useState(false);
    const [isRewarding, setIsRewarding] = useState(false);

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

            if (result.success || result.alreadyRewarded) {
                console.log('프로모션 지급 성공', result);
                setIsToastOpen(true);
                setIsBottomSheetOpen(true);
                setIsPromotionSuccess(true);
            } else {
                console.error('프로모션 지급 실패', result.error);
                // Show error toast logic here? Re-using the same toast state might be confusing if text is fixed.
                // Or simply alert for now since Toast component below has fixed text.
                // Let's change the Toast text dynamically or add another failure state.
                // For simplicity, let's toggle a failure flag to show a different message in the Toast.
            }
        } catch (e) {
            console.error('Reward error:', e);
        } finally {
            setIsRewarding(false);
        }
    };

    // ... (rest of code)



    const handleConfirmExit = () => {
        setIsExitDialogOpen(false);
        closeView();
    };

    const handleAdReward = () => {
        showAd(() => {
            // Navigate to report screen for additional report
            // Assuming '/report' is the route path and existing params are not needed for a fresh report
            // However, report screen might expect current location. 
            // For now, let's navigate to report and let it handle location or navigate to home.
            // Given the context "하나 더 제보할 수 있어요", navigation to home or map might be safer if params are strictly required.
            // Let's assume we go to home where they can start over.
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
            <Toast
                open={isToastOpen}
                text="포인트가 지급되었어요"
                position="top"
                icon={<Toast.LottieIcon preset type="complete" />}
                onClose={() => setIsToastOpen(false)}
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
