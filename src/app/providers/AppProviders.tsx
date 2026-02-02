import { TDSProvider } from '@toss/tds-react-native';
import { PropsWithChildren } from 'react';

export default function AppProviders({ children }: PropsWithChildren<{}>) {
    return <TDSProvider>{children}</TDSProvider>;
}
