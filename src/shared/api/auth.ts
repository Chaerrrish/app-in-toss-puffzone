import { apiFetch } from './client';

interface LoginWithTossResponse {
    success: boolean;
    result?: Record<string, any>; // Flexible result type for now
}

export const loginWithToss = async (code: string): Promise<LoginWithTossResponse | null> => {
    try {
        const data = await apiFetch<LoginWithTossResponse>('/api/auth/toss/start', {
            method: 'POST',
            body: JSON.stringify({ code }),
        });
        return data;
    } catch (error) {
        console.error('Error logging in with Toss:', error);
        return null;
    }
};
