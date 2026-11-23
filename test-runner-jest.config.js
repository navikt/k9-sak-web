import { getJestConfig } from '@storybook/test-runner';

const defaultConfig = getJestConfig();

/**
 * Nødvendig for å kjøre test-storybook i cplt-sandkassen.
 *
 * Som standard (launchType SERVER) starter test-runner én nettleserserver på en tilfeldig localhost-port,
 * og Jest-workerne kobler seg til den over WebSocket. Sandkassen tillater bare bestemte localhost-porter,
 * så den tilkoblingen blokkeres. Med launchType LAUNCH starter hver worker sin egen nettleser og snakker
 * med den over en pipe, så ingen port trengs.
 */
export default {
  ...defaultConfig,
  testEnvironmentOptions: {
    ...defaultConfig.testEnvironmentOptions,
    'jest-playwright': {
      ...defaultConfig.testEnvironmentOptions['jest-playwright'],
      launchType: 'LAUNCH',
    },
  },
};
