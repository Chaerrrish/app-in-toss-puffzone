import { apiFetch } from './client';

interface LoginWithTossResponse {
    success: boolean;
    result?: {
        sessionToken?: string;
        // Add other fields from Toss response if needed
        [key: string]: string | number | boolean | null | undefined | object;
    };
    error?: string;
}

export const loginWithToss = async (code: string, referrer?: string): Promise<LoginWithTossResponse | null> => {
    try {
        const data = await apiFetch<LoginWithTossResponse>('/api/auth/toss/start', {
            method: 'POST',
            body: JSON.stringify({ code, referrer }),
            skipAuth: true,
        });
        return data;
    } catch (error) {
        console.error('Error logging in with Toss:', error);
        return null;
    }
};
