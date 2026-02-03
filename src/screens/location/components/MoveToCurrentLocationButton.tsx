import { Pressable, StyleSheet, View } from 'react-native';
import { Asset } from '@toss/tds-react-native';

type MoveToCurrentLocationButtonProps = Readonly<{
    onPress: () => void;
}>;

export function MoveToCurrentLocationButton({
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
            <View style={styles.iconContainer}>
                {/* Using a placeholder icon or available Toss Asset */}
                <Asset.Icon name="icon-conditional-order-dark" color="#26BF5B" />
            </View>
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
    iconContainer: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pressed: {
        opacity: 0.8,
    },
});
