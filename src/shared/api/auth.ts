/**
 * Auth API Service
 */

// TODO: Replace with actual environment variable or config
const BASE_URL = 'https://word-gmc-degrees-controlled.trycloudflare.com';

interface LoginWithTossResponse {
    success: boolean;
    result?: Record<string, any>; // Flexible result type for now
}

export const loginWithToss = async (code: string): Promise<LoginWithTossResponse | null> => {
    try {
        const response = await fetch(`${BASE_URL}/api/auth/toss/start`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
        });

        if (!response.ok) {
            console.error('Toss login failed:', response.status, response.statusText);
            return null;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error logging in with Toss:', error);
        return null;
    }
};
