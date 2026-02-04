import { useState, useEffect } from 'react';
import { useNavigation } from '@granite-js/react-native';
import { authEvents } from '@/shared/utils/auth-events';
import { AlertDialog } from '@toss/tds-react-native';

export default function AuthListener() {
    const navigation = useNavigation();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const unsubscribe = authEvents.on('sessionExpired', () => {
            setIsOpen(true);
        });

        return () => {
            unsubscribe();
        };
    }, [navigation]);

    return (
        <AlertDialog
            open={isOpen}
            title="세션 만료"
            description="로그인 정보가 만료되었어요. 다시 로그인해주세요."
            buttonText="확인"
            onButtonPress={() => {
                setIsOpen(false);
                navigation.navigate('/');
            }}
            onClose={() => setIsOpen(false)}
            onExited={() => { }}
        />
    );
}
