import { register } from '@granite-js/react-native';
import * as Sentry from '@sentry/react-native';
import App from './pages/_app';

Sentry.init({
    dsn: "https://0b70bc82022a5c050c3807bcd4271c8e@o4510831535063040.ingest.us.sentry.io/4510831543189504",
    enableNative: false,
    debug: true,
});

register(App);
