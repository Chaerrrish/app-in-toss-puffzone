import { getSessionToken, clearSessionToken } from '../utils/storage';
import { authEvents } from '../utils/auth-events';

// TODO: Manage this via .env or config
// Fallback to dev tunnel if env is missing (for local dev without full env setup)

export class AuthError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AuthError';
    }
}

/**
 * Universal Fetch Wrapper
 * - Inject Authorization header
 * - Handle 401/403 (Logout)
 */
export const apiFetch = async <T = any>(
    path: string,
    init?: RequestInit
): Promise<T> => {
    const url = `${import.meta.env.BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
    console.log(`[API] Requesting: ${url}`); // Debug log
    const token = await getSessionToken();

    const headers = new Headers(init?.headers);
    headers.set('Content-Type', 'application/json');
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    try {
        const response = await fetch(url, {
            ...init,
            headers,
        });

        if (response.status === 401 || response.status === 403) {
            await clearSessionToken();
            // Trigger global session expired event
            authEvents.emit('sessionExpired');
            throw new AuthError('Session expired');
        }

        if (!response.ok) {
            // Try to parse error message
            const errorText = await response.text();
            throw new Error(`API Error ${response.status}: ${errorText}`);
        }

        // Handle empty responses (e.g. 204)
        if (response.status === 204) {
            return {} as T;
        }

        const data = await response.json();
        return data as T;
    } catch (error) {
        throw error;
    }
};
