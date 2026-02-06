import { getSessionToken } from '../utils/storage';

export const validateSession = async (): Promise<boolean> => {
    try {
        const token = await getSessionToken();
        if (!token) return false;

        const url = `${import.meta.env.BASE_URL}/api/auth/session/verify`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            return data.success === true && data.valid === true;
        }

        return false;
    } catch (error) {
        console.error('Session validation error:', error);
        return false;
    }
};
