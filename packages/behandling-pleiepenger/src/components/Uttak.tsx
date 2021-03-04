import { MicroFrontend } from '@fpsak-frontend/utils';
import * as React from 'react';

const initializeUttak = (elementId, uttaksperioder, behandlingUuid: string) => {
  (window as any).renderUttakApp(elementId, {
    uttaksperioder,
    aktivBehandlingUuid: behandlingUuid,
  });
};

interface UttakProps {
  uuid: string;
  uttaksperioder: any;
}

const uttakAppID = 'uttakApp';
export default ({ uuid, uttaksperioder }: UttakProps) => (
  <MicroFrontend
    id={uttakAppID}
    jsSrc="/k9/microfrontend/psb-uttak/1.0.10/app.js"
    jsIntegrity="sha384-WOcVKGQGM6n++eqAFKy1dR3lwCYk1YxXjAY+B/nqvm/Uh4Z7HuDWP6OXTVfrY6Hx"
    stylesheetSrc="/k9/microfrontend/psb-uttak/1.0.10/styles.css"
    stylesheetIntegrity="sha384-51nKGyNXcGiRBsYcBQh15bMF6C3M1CTlUVBKKrcuiJdQ0I4p9RH96WOIRMko4RdY"
    onReady={() => initializeUttak(uttakAppID, uttaksperioder, uuid)}
  />
);
