import { createRoute } from '@granite-js/react-native';
import { z } from 'zod';
import SuccessScreen from './SuccessScreen';

export const Route = createRoute('/success', {
    component: SuccessScreen,
    validateParams: z.object({
        zoneId: z.string().optional(),
    }),
});
