import {
  Asset,
  Top,
  FixedBottomCTA,
  FixedBottomCTAProvider,
  StepperRow,
} from '@toss/tds-react-native';
import { Spacing, useNavigation } from '@granite-js/react-native';
import { useAdaptive } from '@toss/tds-react-native/private';
import { appLogin } from '@apps-in-toss/framework';
import { loginWithToss } from '../../shared/api/auth';



import { useState } from 'react';

export default function HomeScreen() {
  const adaptive = useAdaptive();
  const navigation = useNavigation();

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);

    try {
      const { authorizationCode } = await appLogin();
      console.log('Got auth code:', authorizationCode);

      const result = await loginWithToss(authorizationCode);

      if (result && result.success && result.result?.success !== false) {
        console.log('Login successful:', result);
        navigation.navigate('/location');
      } else {
        console.error('Login failed:', result);
        // Optionally handle error (toast, alert)
      }
    } catch (error) {
      console.error('Failed to login:', error);
    } finally {
      setIsLoggingIn(false);
    }
  };



  return (
    <>
      <FixedBottomCTAProvider>
        <>
          <Asset.Icon
            frameShape={{ width: 20 }}
            name="icon-dots-mono"
            color="rgba(0, 19, 43, 0.58)"
          />
        </>
        <>
          <Asset.Icon
            frameShape={{ width: 20 }}
            name="icon-x-mono"
            color="rgba(0, 19, 43, 0.58)"
          />
        </>
        <Spacing size={12} />
        <Top
          title={
            <Top.TitleParagraph size={28} color={adaptive.grey900}>
              내 주변 흡연구역 제보하기
            </Top.TitleParagraph>
          }
          subtitle2={
            <Top.SubtitleParagraph>
              흡연구역 제보하고 20P 받기
            </Top.SubtitleParagraph>
          }
          upper={
            <Top.UpperAssetContent
              content={
                <Asset.Image
                  frameShape={{ width: 80, height: 80 }}
                  source={{
                    uri: 'https://static.toss.im/2d-emojis/png/4x/uE116.png',
                  }}
                  accessibilityLabel=""
                />
              }
            />
          }
          lowerGap={0}
        />
        <>
          <Asset.Image
            frameShape={{ width: 250 }}
            source={{
              uri: 'https://static.toss.im/3d/tossmobile-kv-mobile-pay-hero.png',
            }}
          />
        </>
        <Spacing size={190} />

        <StepperRow
          left={<StepperRow.NumberIcon number={1} />}
          center={<StepperRow.Texts type="B" title="지도에서 위치를 선택해요" description="제보할 장소를 콕 찍어주세요" />}
        />
        <StepperRow
          left={<StepperRow.NumberIcon number={2} />}
          center={<StepperRow.Texts type="B" title="내 주변 흡연구역을 제보해요" description="전국 어디든 제보할 수 있어요" />}
        />
        <StepperRow
          left={<StepperRow.NumberIcon number={3} />}
          center={<StepperRow.Texts type="B" title="토스 포인트를 받아가세요" description="제보만 하면 그 즉시 보상 받을 수 있어요" />}
          hideLine
        />


        <FixedBottomCTA loading={false} onPress={() => { navigation.navigate('/location') }}>시작하기</FixedBottomCTA>
      </FixedBottomCTAProvider>
    </>
  );
}