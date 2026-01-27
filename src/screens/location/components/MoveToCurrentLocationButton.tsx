import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Asset } from '@toss/tds-react-native';

type MoveToCurrentLocationButtonProps = Readonly<{
    isAtCurrentLocation?: boolean;
    onPress: () => void;
}>;

export function MoveToCurrentLocationButton({
    isAtCurrentLocation = false,
    onPress,
}: MoveToCurrentLocationButtonProps) {
    return (
        <Pressable
            style={({ pressed }) => [
                styles.container,
                pressed && styles.pressed
            ]}
            onPress={onPress}
        >
            {/* Using a placeholder icon or available Toss Asset */}
            <Text>현재 위치로 이동</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        borderWidth: 0.8,
        borderColor: '#E5E8EB', // gray-80
        backgroundColor: '#FFFFFF',
        padding: 6,
    },
    pressed: {
        opacity: 0.8,
    },
});
