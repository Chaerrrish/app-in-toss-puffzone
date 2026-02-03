import { Text, View } from 'react-native';

export default function NotFoundScreen() {
    return (
        <View
            style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Text>404 Not Found</Text>
        </View>
    );
}
