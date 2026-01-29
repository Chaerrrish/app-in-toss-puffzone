import { View } from "react-native";
import { Lottie, Spacing } from "@granite-js/react-native";
import { Asset, Button, FixedBottomCTA, FixedBottomCTAProvider, Txt } from "@toss/tds-react-native";
import { useAdaptive } from "@toss/tds-react-native/private";

export default function SuccessScreen() {
    const adaptive = useAdaptive();
    return (
        <>
            <View style={{ alignItems: 'center', paddingHorizontal: 24 }}>
                <Spacing size={160} />

                <Asset.Image
                    source={{ uri: 'https://static.toss.im/2d-emojis/svg/u1F600.svg' }}
                    frameShape={Asset.frameShape.SquareLarge}
                    backgroundColor={adaptive.grey100}
                    scale={0.55}
                    acc={<Asset.ContentImage source={{ uri: 'https://static.toss.im/icons/svg/icon-check-circle-green.svg' }} />}
                    accPosition="bottom-right"
                />
                <Spacing size={48} />
                <Txt color={adaptive.grey800} typography="t2" fontWeight="bold" style={{ textAlign: 'center' }}>
                    제보가 완료되었어요!
                </Txt>
                <Spacing size={8} />
                <Txt color={adaptive.grey700} style={{ textAlign: 'center' }}>{`흡연문화 개선에 도움을 주셔서 감사합니다`}</Txt>
            </View>
            <FixedBottomCTAProvider>
                <FixedBottomCTA.Double
                    leftButton={
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
                    rightButton={
                        <Button
                            type="primary"
                            style="fill"
                            display="block"
                            disabled={false}
                            loading={false}
                        >
                            광고 보고 20p 더 받기
                        </Button>
                    }
                />
            </FixedBottomCTAProvider>
        </>
    );
}