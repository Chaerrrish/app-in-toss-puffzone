import {
  Asset,
  Top,
  ListHeader,
  FixedBottomCTA,
  FixedBottomCTAProvider,
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
          <Top.TitleParagraph color={adaptive.grey900}>
            타이틀을 입력해주세요.
          </Top.TitleParagraph>
        }
      />
      <>
        <Asset.Image
          frameShape={{ width: 250 }}
          source={{
            uri: 'https://static.toss.im/3d/tossmobile-kv-mobile-pay-hero.png',
          }}
        />
      </>
      <Spacing size={12} />
      <ListHeader
        title={
          <ListHeader.TitleParagraph
            color={adaptive.grey800}
            fontWeight="bold"
            typography="t5"
          >
            타이틀 내용
          </ListHeader.TitleParagraph>
        }
      />

      <FixedBottomCTAProvider>
        <FixedBottomCTA loading={false} onPress={handleLogin}>토스로 로그인하기</FixedBottomCTA>
      </FixedBottomCTAProvider>
    </>
  );
}