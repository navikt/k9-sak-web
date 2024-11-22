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

  const cli = new SentryCli(null, { project: 'ung-sak-web' });

  try {
    console.log(`Oppretter Sentry-release ${release}`);
    await cli.releases.new(release);

    console.log('Laster opp source maps');
    await cli.releases.uploadSourceMaps(release, {
      include: ['dist/ung/web'],
      urlPrefix: '~/ung/web/',
      rewrite: false,
    });

    console.log('Releaser');
    await cli.releases.finalize(release);
  } catch (e) {
    console.error('Noe gikk galt under source map-opplasting:', e);
  }
}

opprettReleaseTilSentry();
