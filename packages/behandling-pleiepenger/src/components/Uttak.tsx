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
    jsSrc="/k9/microfrontend/psb-uttak/1.0.6/app.js"
    jsIntegrity="sha384-LVjLseXSdo5ryoU4FFUF0zOHT8Gaueu7+tMve9ZNMiQzMtGF8gnPNkFUTtPQEktk"
    stylesheetSrc="/k9/microfrontend/psb-uttak/1.0.6/styles.css"
    stylesheetIntegrity="sha384-pdcPo7aeCj5wwEelJYjadnKTw6lMKax5vq1KsHHA/P9imdE/HH0APFT/+rFhOmFy"
    onReady={() => initializeUttak(uttakAppID, uttaksperioder, uuid)}
  />
);
