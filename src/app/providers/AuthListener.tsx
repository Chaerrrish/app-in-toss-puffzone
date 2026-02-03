import { useEffect } from 'react';
import { useNavigation } from '@granite-js/react-native';
import { authEvents } from '@/shared/utils/auth-events';
import { Alert } from 'react-native';

export default function AuthListener() {
    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = authEvents.on('sessionExpired', () => {
            Alert.alert(
                '세션 만료',
                '로그인 정보가 만료되었습니다. 다시 로그인해주세요.',
                [
                    {
                        text: '확인',
                        onPress: () => {
                            navigation.navigate('/');
                        }
                    }
                ]
            );
        });

        return () => {
            unsubscribe();
        };
    }, [navigation]);

    return null;
}
