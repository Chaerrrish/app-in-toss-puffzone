import { View } from "react-native";
import { Spacing } from "@granite-js/react-native";
import { Asset, Badge, BottomSheet, Button, ConfirmDialog, FixedBottomCTA, FixedBottomCTAProvider, Toast, Txt } from "@toss/tds-react-native";
import { useAdaptive } from "@toss/tds-react-native/private";
import { useEffect, useState } from "react";
import { GoogleAdMob, closeView } from "@apps-in-toss/framework";

const AD_GROUP_ID = 'ait-ad-test-rewarded-id';

function useGoogleAdMobLoad() {
    useEffect(() => {
        console.log('useGoogleAdMobLoad: useEffect started');
        if (GoogleAdMob.loadAppsInTossAdMob.isSupported() !== true) {
            console.log('useGoogleAdMobLoad: loadAppsInTossAdMob is not supported');
            return;
        }
        console.log('useGoogleAdMobLoad: Starting loadAppsInTossAdMob');
        const cleanup = GoogleAdMob.loadAppsInTossAdMob({
            options: {
                adGroupId: AD_GROUP_ID,
            },
            onEvent: (event) => {
                switch (event.type) {
                    case 'loaded':
                        console.log('광고 로드 성공', event.data);
                        cleanup();
                        break;
                }
            },
            onError: (error) => {
                console.error('광고 불러오기 실패', error);
                cleanup?.();
            },
        });
    }, []);
}

export default function SuccessScreen() {
    useGoogleAdMobLoad();
    const adaptive = useAdaptive();
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
    const [isToastOpen, setIsToastOpen] = useState(false);
    const [isPromotionSuccess, setIsPromotionSuccess] = useState(false);

    // Exit Dialog State
    const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);

    const handleReward = () => {
        // 프로모션 지급 로직 추가

        setIsToastOpen(true);
        setIsBottomSheetOpen(true);
        setIsPromotionSuccess(true);
    }

    const handleConfirmExit = () => {
        setIsExitDialogOpen(false);
        closeView();
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
                            disabled={isPromotionSuccess}
                            textStyle={{ paddingLeft: 8 }}
                            containerStyle={{ paddingLeft: 16 }}
                            onPress={handleReward}
                            leftAccessory={
                                <Asset.Icon name='icon-point-collect' />
                            }
                        >
                            토스 포인트 20p 받기
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
                            onPress={() => setIsExitDialogOpen(true)}
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
