import { Asset, BottomSheet } from "@toss/tds-react-native";
import { Pressable, View, Text, StyleSheet } from "react-native";
import { theme } from "@/shared/styles/theme";

interface PhotoOptionBottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (type: 'camera' | 'library') => void;
}

export default function PhotoOptionBottomSheet({ isOpen, onClose, onSelect }: PhotoOptionBottomSheetProps) {
    return (
        <BottomSheet.Root open={isOpen} onClose={onClose}>
            <View style={styles.container}>
                <Pressable
                    style={({ pressed }) => [styles.optionRow, pressed && styles.pressed]}
                    onPress={() => {
                        onSelect('camera');
                        onClose();
                    }}
                >
                    <Asset.Icon name="icon-camera" style={{ width: 28, height: 28 }} color={theme.colors.gray[70]} />
                    <Text style={styles.optionText}>사진 촬영하기</Text>
                </Pressable>

                <Pressable
                    style={({ pressed }) => [styles.optionRow, pressed && styles.pressed]}
                    onPress={() => {
                        onSelect('library');
                        onClose();
                    }}
                >
                    <Asset.Icon name="icon-picture" style={{ width: 28, height: 28 }} />
                    <Text style={styles.optionText}>앨범에서 선택하기</Text>
                </Pressable>
            </View>
        </BottomSheet.Root>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingBottom: 24,
        paddingTop: 12,
        gap: 4,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 8,
        gap: 8,
        borderRadius: 8,
    },
    pressed: {
        backgroundColor: theme.colors.gray[95],
    },
    optionText: {
        ...theme.text.b.m,
        color: theme.colors.gray[20],
        flex: 1,
    }
});