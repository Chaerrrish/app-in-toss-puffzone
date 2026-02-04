import { View, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

export function HBar() {
    return <View style={styles.bar} />;
}

const styles = StyleSheet.create({
    bar: {
        height: 1,
        backgroundColor: theme.colors.gray[90], // used gray-90 in user code
        width: '100%',
    },
});
