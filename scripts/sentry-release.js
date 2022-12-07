// eslint-disable-next-line @typescript-eslint/no-var-requires
const SentryCli = require('@sentry/cli');

async function opprettReleaseTilSentry() {
  const release = process.env.SENTRY_RELEASE;
  const authToken = process.env.SENTRY_AUTH_TOKEN;

  if (!release) {
    throw new Error('"SENTRY_RELEASE" er ikke satt');
  }

  if (!authToken) {
    throw new Error('"SENTRY_AUTH_TOKEN" er ikke satt');
  }

  const cli = new SentryCli();

  try {
    console.log(`Oppretter Sentry-release ${release}`);
    await cli.releases.new(release);

    console.log('Laster opp source maps');
    await cli.releases.uploadSourceMaps(release, {
      include: ['k9/web'],
      urlPrefix: '~/k9/web/',
      rewrite: false,
    });

    console.log('Releaser');
    await cli.releases.finalize(release);
  } catch (e) {
    console.error('Noe gikk galt under source map-opplasting:', e);
  }
}

opprettReleaseTilSentry();
