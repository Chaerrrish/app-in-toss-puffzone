import {
  Top,
  FixedBottomCTA,
  FixedBottomCTAProvider,
  StepperRow,
  Toast,
} from '@toss/tds-react-native';
import { Spacing, useNavigation } from '@granite-js/react-native';
import { useAdaptive } from '@toss/tds-react-native/private';
import { appLogin } from '@apps-in-toss/framework';
import { loginWithToss } from '@/shared/api/auth';
import { useState, useEffect } from 'react';
import MapIcon from '@/shared/assets/MapIcon';
import { saveSessionToken, getSessionToken, clearSessionToken } from '@/shared/utils/storage';

import { validateSession } from '@/shared/api/session-check';

export default function HomeScreen() {
  const adaptive = useAdaptive();
  const navigation = useNavigation();

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoginFailed, setIsLoginFailed] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const token = await getSessionToken();
      if (token) {
        const isValid = await validateSession();
        if (isValid) {
          console.log('Session valid, auto-logging in...');
          navigation.navigate('/location');
        } else {
          console.log('Session invalid, clearing...');
          await clearSessionToken();
        }
      }
    };
    checkSession();
  }, []);

  const handleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    setIsLoginFailed(false);

    try {
      const { authorizationCode } = await appLogin();

      const result = await loginWithToss(authorizationCode);

      if (result && result.success && typeof result.result?.sessionToken === 'string') {
        const token = result.result.sessionToken;
        await saveSessionToken(token);
        navigation.navigate('/location');
      } else {
        console.error('Login failed or no session token');
        setIsLoginFailed(true);
      }
    } catch (error) {
      console.error('Failed to login:', error);
      setIsLoginFailed(true);
    } finally {
      setIsLoggingIn(false);
    }
  };



  return (
    <>
      <FixedBottomCTAProvider>

        <Spacing size={12} />
        <Top
          title={
            <Top.TitleParagraph size={28} color={adaptive.grey800}>
              내 주변 흡연구역 제보하기
            </Top.TitleParagraph>
          }
          subtitle2={
            <Top.SubtitleParagraph color={adaptive.grey700}>
              흡연구역 제보하고 20P 받기
            </Top.SubtitleParagraph>
          }
          upper={
            <Top.UpperAssetContent
              content={
                <MapIcon width={90} height={90} />
              }
            />
          }
        />

        <Spacing size={160} />

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


        <FixedBottomCTA loading={isLoggingIn} onPress={handleLogin}>시작하기</FixedBottomCTA>
        {/* <FixedBottomCTA loading={false} onPress={() => navigation.navigate('/success')}>시작하기</FixedBottomCTA> */}
      </FixedBottomCTAProvider>
      <Toast
        open={isLoginFailed}
        text="로그인에 실패했어요. 다시 시도해주세요."
        position="top"
        icon={<Toast.Icon name="icon-warning-circle" />}
        onClose={() => setIsLoginFailed(false)}
      />
    </>
  );
}