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
    jsSrc="/k9/microfrontend/psb-uttak/1.0.5/app.js"
    jsIntegrity="sha384-syxcjehFTwBHiGg7rhNkpJ8GIy4vsY9TTamQYGLAnE9nkaVXWXPbLE99XQoeTKsk"
    stylesheetSrc="/k9/microfrontend/psb-uttak/1.0.5/styles.css"
    stylesheetIntegrity="sha384-pdcPo7aeCj5wwEelJYjadnKTw6lMKax5vq1KsHHA/P9imdE/HH0APFT/+rFhOmFy"
    onReady={() => initializeUttak(uttakAppID, uttaksperioder, uuid)}
  />
);
