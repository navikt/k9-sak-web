import '@fpsak-frontend/assets/styles/global.css';
import '@navikt/ft-plattform-komponenter/dist/style.css';
import { initialize } from 'msw-storybook-addon';
import preview from '../preview';

initialize({
  onUnhandledRequest: 'bypass',
  serviceWorker: {
    url: '/mockServiceWorker.js',
  },
});

export default preview;
