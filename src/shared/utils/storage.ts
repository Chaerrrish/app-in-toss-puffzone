import { Storage } from '@apps-in-toss/framework';

const SESSION_KEY = 'puffzone.sessionToken';

// In-memory fallback is still useful for immediate updates within the session lifecycle if needed,
// but Toss Storage persists across app restarts.
let memoryToken: string | null = null;

/**
 * Save session token to Toss Storage
 */
export const saveSessionToken = async (token: string): Promise<void> => {
    memoryToken = token;
    try {
        await Storage.setItem(SESSION_KEY, token);
    } catch (error) {
        console.warn('Failed to save session token to Toss Storage:', error);
    }
};

/**
 * Get session token from Toss Storage
 */
export const getSessionToken = async (): Promise<string | null> => {
    if (memoryToken) return memoryToken;

    try {
        const token = await Storage.getItem(SESSION_KEY);
        if (token) {
            memoryToken = token;
            return token;
        }
        return null;
    } catch (error) {
        console.warn('Failed to get session token from Toss Storage:', error);
        return null;
    }
};

/**
 * Clear session token
 */
export const clearSessionToken = async (): Promise<void> => {
    memoryToken = null;
    try {
        if (typeof Storage.removeItem === 'function') {
            await Storage.removeItem(SESSION_KEY);
        } else {
            // Fallback if removeItem is not available
            await Storage.setItem(SESSION_KEY, '');
        }
    } catch (error) {
        console.warn('Failed to clear session token from Toss Storage:', error);
    }
};

