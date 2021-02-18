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
    jsSrc="https://psb-uttak-frontend.dev.adeo.no/1.0.1/app.js"
    jsIntegrity="sha384-m6thzpLVP6hFhhevI0FBGQwy31E7oaZ1Y+JNW3ta0ZZrORSdZwcgpxYLUjroLOvi"
    stylesheetSrc="https://psb-uttak-frontend.dev.adeo.no/1.0.1/styles.css"
    stylesheetIntegrity="sha384-2O4j2h5tlOwrNzSQmVuPLaNvhoYT70nyFwSrnTMrRss3oJwAHlg+sSxbnZAFRFUF"
    onReady={() => initializeUttak(uttakAppID, uttaksperioder, uuid)}
  />
);
