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
    jsSrc="/k9/microfrontend/psb-uttak/1.0.12/app.js"
    jsIntegrity="sha384-V3rwRk77NzjQYCeTAZPtXtbMd44wtXRHHnSJcC+bIFANz/w9Pi/8Gkgm7VFUa7iS"
    stylesheetSrc="/k9/microfrontend/psb-uttak/1.0.12/styles.css"
    stylesheetIntegrity="sha384-JgdTFIz104vgvdq0kqN0g6mmq8OddswHP/zKhmAyg5DThQCft5X1BZ2Do6xCtkBG"
    onReady={() => initializeUttak(uttakAppID, uttaksperioder, uuid)}
  />
);
