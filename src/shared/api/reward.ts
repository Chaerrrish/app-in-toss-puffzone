import { apiFetch } from './client';

interface RewardResponse {
    success: boolean;
    rewarded?: boolean;
    alreadyRewarded?: boolean;
    error?: string;
}

/**
 * Claim Toss Point Reward for a reported zone
 */
export const claimZoneReward = async (zoneId: string): Promise<RewardResponse> => {
    try {
        const data = await apiFetch<RewardResponse>('/api/promotion/reward/zone', {
            method: 'POST',
            body: JSON.stringify({ zoneId }),
        });
        return data;
    } catch (error) {
        console.error('Failed to claim zone reward:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
};
