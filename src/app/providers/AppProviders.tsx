import { TDSProvider } from '@toss/tds-react-native';
import { PropsWithChildren } from 'react';

import AuthListener from './AuthListener';

export default function AppProviders({ children }: PropsWithChildren) {
    return (
        <TDSProvider>
            <AuthListener />
            {children}
        </TDSProvider>
    );
}
