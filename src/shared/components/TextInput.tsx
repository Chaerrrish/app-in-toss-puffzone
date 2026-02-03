import { useRef, useState } from 'react';
import {
    KeyboardTypeOptions,
    Platform,
    Pressable,
    Text,
    TextInput,
    View,
    StyleSheet,
} from 'react-native';
import { Asset } from '@toss/tds-react-native';
import { theme } from '../styles/theme';
import { Title } from './Title';

interface BaseTextInputProps {
    showClear?: boolean;
    value: string;
    label?: string;
    required?: boolean;
    onChangeText: (text: string) => void;
    success?: string;
    description?: string;
    error?: string;
    placeholder?: string;
    keyboardType?: KeyboardTypeOptions;
    maxLength?: number;
    inputMode?:
    | 'text'
    | 'numeric'
    | 'decimal'
    | 'tel'
    | 'email'
    | 'url'
    | undefined;
}

export function BaseTextInput({
    showClear = true,
    value,
    label,
    onChangeText,
    success,
    description,
    required,
    error,
    placeholder,
    keyboardType,
    maxLength,
    inputMode,
}: BaseTextInputProps) {
    const textInputRef = useRef<TextInput>(null);
    const [focused, setFocused] = useState(false);

    return (
        <View style={styles.container}>
            {label && <Title label={label} required={required} />}
            <Pressable
                style={styles.inputContainer}
                onPress={() => textInputRef.current?.focus()}
            >
                <View
                    style={[
                        styles.inputWrapper,
                        error
                            ? styles.borderError
                            : focused
                                ? styles.borderFocused
                                : styles.borderDefault,
                    ]}
                >
                    <TextInput
                        ref={textInputRef}
                        inputMode={inputMode}
                        keyboardType={keyboardType}
                        maxLength={maxLength}
                        placeholder={placeholder}
                        placeholderTextColor={theme.colors.gray[60]}
                        textAlignVertical={Platform.OS === 'android' ? 'center' : undefined}
                        value={value}
                        onBlur={() => setFocused(false)}
                        onChangeText={onChangeText}
                        onFocus={() => setFocused(true)}
                        {...(Platform.OS === 'android'
                            ? { includeFontPadding: false }
                            : {})}
                        style={styles.input}
                    />

                    {error ? (
                        <Asset.Icon
                            name="icon-warning-filled"
                            color={theme.colors.red[50]}
                        />
                    ) : showClear && value.length > 0 ? (
                        <Pressable
                            hitSlop={8}
                            style={styles.iconButton}
                            onPressIn={() => {
                                onChangeText('');
                                textInputRef.current?.focus();
                            }}
                        >
                            <Asset.Icon
                                name="icon-cancel-circle-filled"
                                color={theme.colors.gray[40]}
                            />
                        </Pressable>
                    ) : null}
                </View>

                {description && !success && !error && (
                    <Text style={styles.descriptionText}>{description}</Text>
                )}
                {success && <Text style={styles.successText}>{success}</Text>}
                {error && <Text style={styles.errorText}>{error}</Text>}
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 8,
    },
    inputContainer: {
        gap: 6,
    },
    inputWrapper: {
        height: 44, // Increased slightly for better touch target than 34
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1.5,
        paddingBottom: 1.5,
    },
    borderDefault: {
        borderColor: theme.colors.gray[90],
    },
    borderFocused: {
        borderColor: theme.colors.primary[40],
    },
    borderError: {
        borderColor: theme.colors.red[50],
    },
    input: {
        flex: 1,
        padding: 0,
        color: theme.colors.gray[20],
        ...theme.text.b.r,
        height: '100%',
    },
    iconButton: {
        height: 28,
        width: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    descriptionText: {
        color: theme.colors.gray[50],
        ...theme.text.m.m,
    },
    successText: {
        color: theme.colors.primary[40],
        ...theme.text.m.m,
    },
    errorText: {
        color: theme.colors.red[50],
        ...theme.text.m.m,
    },
});
