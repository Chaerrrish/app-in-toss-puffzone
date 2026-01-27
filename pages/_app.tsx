import { AppsInToss } from '@apps-in-toss/framework';
import { PropsWithChildren } from 'react';
import { InitialProps } from '@granite-js/react-native';
import { context } from '../require.context';
import { AppProviders } from '@/app/providers/AppProviders';

function AppContainer({ children }: PropsWithChildren<InitialProps>) {
    return <AppProviders>{children}</AppProviders>;
}

export default AppsInToss.registerApp(AppContainer, { context });
