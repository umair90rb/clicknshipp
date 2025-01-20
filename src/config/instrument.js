import * as Sentry from '@sentry/node';

Sentry.init({
  // dsn: process.env.SENTRY_DNS,
  dns: 'https://b9e1bed15c34b85aa57550bcfc869e54@o4507859402096640.ingest.us.sentry.io/4508668200222720',
  tracesSampleRate: 1.0,
});
