import { PropsWithChildren } from 'react';
import { View, StyleSheet } from 'react-native';
// import AuthListener from '@/app/providers/AuthListener';

export default function PageLayout({ children }: PropsWithChildren) {
    return (
        <View style={styles.container}>
            {/* <AuthListener /> */}
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
