import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

interface TitleProps {
    label: string;
    required?: boolean;
}

export function Title({ label, required }: TitleProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            {required && <Text style={styles.required}>*</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 4,
    },
    label: {
        ...theme.text.l.b,
        color: theme.colors.text.primary,
    },
    required: {
        ...theme.text.l.b,
        color: theme.colors.red[50],
    },
});
