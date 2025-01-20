import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DNS,
  tracesSampleRate: 1.0,
});
