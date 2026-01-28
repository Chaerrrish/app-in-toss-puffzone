
import { Pressable, View } from 'react-native';
import { theme } from '../styles/theme';

export default function RadioButton({
    selected,
    setSelected,
    disabled = false,
}: {
    selected: boolean;
    setSelected?: (selected: boolean) => void;
    disabled?: boolean;
}) {
    const innerCircle = selected ? 7.5 : 18.5;

    return (
        <Pressable
            disabled={disabled}
            style={{
                width: 28,
                height: 28,
                alignItems: 'center',
                justifyContent: 'center',
                padding: 8,
            }}
            onPress={() => setSelected?.(!selected)}
        >
            <View
                style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: disabled
                        ? theme.colors.gray[90]
                        : selected
                            ? theme.colors.primary[30]
                            : theme.colors.gray[80],
                }}
            >
                <View
                    style={{
                        borderRadius: 9999,
                        backgroundColor: disabled ? theme.colors.gray[98] : theme.colors.white,
                        width: innerCircle,
                        height: innerCircle,
                    }}
                />
            </View>
        </Pressable>
    );
}
