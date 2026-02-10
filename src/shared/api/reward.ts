import { getSessionToken } from '../utils/storage';

export interface RewardResponse {
    success: boolean;
    rewarded?: boolean;
    alreadyRewarded?: boolean;
    error?: string;
    status?: 'NEED_AD' | 'LIMIT_EXCEEDED' | 'ALREADY_REPORTED' | 'SUCCESS';
}

export interface AdUnlockResponse {
    success: boolean;
    data?: any;
    error?: string;
}

/**
 * Claim Toss Point Reward for a reported zone
 * Handles 428 (Need Ad) and 403 (Limit) by returning them in the response object
 */
export const claimZoneReward = async (zoneId: string): Promise<RewardResponse> => {
    try {
        const token = await getSessionToken();
        const url = `${import.meta.env.BASE_URL}/api/promotion/reward/zone`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token || ''}`
            },
            body: JSON.stringify({ zoneId }),
        });

        if (response.status === 428) {
            return { success: false, status: 'NEED_AD', error: '광고 시청이 필요해요' };
        }
        if (response.status === 403) {
            return { success: false, status: 'LIMIT_EXCEEDED', error: '하루 제보 한도를 초과했어요' };
        }

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: data.error || `Error ${response.status}`,
            };
        }

        return data;

    } catch (error) {
        console.error('Failed to claim zone reward:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
};

/**
 * Unlock Ad Reward (called after watching ad)
 */
export const unlockAd = async (): Promise<AdUnlockResponse> => {
    try {
        const token = await getSessionToken();
        const url = `${import.meta.env.BASE_URL}/api/ad/unlock`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token || ''}`
            },
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to unlock ad:', error);
        return { success: false, error: 'Network error' };
    }
};
