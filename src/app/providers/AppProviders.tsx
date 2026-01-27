import { TDSProvider } from '@toss/tds-react-native';
import { PropsWithChildren } from 'react';

export function AppProviders({ children }: PropsWithChildren<{}>) {
    return <TDSProvider>{children}</TDSProvider>;
}
