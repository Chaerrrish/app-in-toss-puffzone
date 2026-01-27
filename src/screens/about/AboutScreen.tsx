import { Spacing } from '@granite-js/react-native';
import { BottomSheet, Button, Top, Asset } from '@toss/tds-react-native';
import { useOverlay, useAdaptive } from '@toss/tds-react-native/private';
import React, { useEffect } from 'react';



export default function AboutScreen() {
  const overlay = useOverlay();
  const adaptive = useAdaptive();

  useEffect(() => {
    overlay.open(({ isOpen, close, exit }) => {
      return (
        <BottomSheet.Root open={isOpen} onClose={close} onExited={exit}>
        </BottomSheet.Root>
      );
    });
  }, [overlay]);

  return (
    <>
      <BottomSheet.Root open={true} onClose={() => { }}>
      </BottomSheet.Root>
      <Button>확인</Button>
      <Top
        title={
          <Top.TitleParagraph color={adaptive.background}>
            크기를 조절해주세요
          </Top.TitleParagraph>
        }
      />

      <Spacing size={10} />
      <>
        <Asset.Icon
          frameShape={Asset.frameShape.CleanW24}
          name="icon-arrow-back-ios-mono"
          color="#ffffff"
        />
      </>
      <>
        <Asset.Icon
          frameShape={{ width: 20 }}
          name="icon-dots-mono"
          color="#FDFDFFbf"
        />
      </>
      <>
        <Asset.Icon
          frameShape={{ width: 20 }}
          name="icon-x-mono"
          color="#FDFDFFbf"
        />
      </>
    </>
  );
}