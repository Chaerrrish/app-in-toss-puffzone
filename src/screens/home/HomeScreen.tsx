import {
  Asset,
  Top,
  ListHeader,
  FixedBottomCTA,
  FixedBottomCTAProvider,
} from '@toss/tds-react-native';
import { Spacing, useNavigation } from '@granite-js/react-native';
import { useAdaptive } from '@toss/tds-react-native/private';



export default function HomeScreen() {
  const adaptive = useAdaptive();
  const navigation = useNavigation();

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
        <FixedBottomCTA loading={false} onPress={() => navigation.navigate('/location')}>다음</FixedBottomCTA>
      </FixedBottomCTAProvider>
    </>
  );
}