import { View } from "react-native";
import { Lottie, Spacing } from "@granite-js/react-native";
import { Asset, Badge, BottomSheet, Button, FixedBottomCTA, FixedBottomCTAProvider, Toast, Txt } from "@toss/tds-react-native";
import { useAdaptive } from "@toss/tds-react-native/private";
import { useState } from "react";

export default function SuccessScreen() {
    const adaptive = useAdaptive();
    const [open, setOpen] = useState(false);
    const [isToastOpen, setIsToastOpen] = useState(false);
    const [isPromotionSuccess, setIsPromotionSuccess] = useState(false);

    const handleReward = () => {
        // 프로모션 지급 로직 추가

        setIsToastOpen(true);
        setOpen(true);
        setIsPromotionSuccess(true);
    }
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
            <BottomSheet.Root open={open} onClose={() => { setOpen(false) }}>
                <Spacing size={16} />
                <BottomSheet.Header>{`광고 시청 후 \n흡연구역을 하나 더 제보할 수 있어요`}</BottomSheet.Header>
                <BottomSheet.HeaderDescription>흡연구역 추가 제보 후 20p 더 받아가세요</BottomSheet.HeaderDescription>
                <BottomSheet.CTA
                    type="primary"
                    disabled={false}
                    style="fill"
                    display="block"
                    textStyle={{ paddingLeft: 8 }}
                    containerStyle={{ paddingLeft: 16 }}
                    leftAccessory={
                        <Badge size="small" type="green" badgeStyle="fill">
                            AD
                        </Badge>}
                >
                    광고 보고 포인트 더 받기
                </BottomSheet.CTA>
            </BottomSheet.Root>
            <Toast
                open={isToastOpen}
                text="완료되었어요"
                position="top"
                icon={<Toast.LottieIcon preset type="complete" />}
                onClose={() => setIsToastOpen(false)}
            />
        </>
    );
}
