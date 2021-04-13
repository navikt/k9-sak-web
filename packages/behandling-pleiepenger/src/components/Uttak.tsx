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
    jsSrc="/k9/microfrontend/psb-uttak/1.0.13/app.js"
    jsIntegrity="sha384-x1MFv/Dz89OCMTV6wgtvbiQdz+KrcKoatPAv9FOfOcyi87ZvWD3X8OPTT2+u6v8M"
    stylesheetSrc="/k9/microfrontend/psb-uttak/1.0.13/styles.css"
    stylesheetIntegrity="sha384-JgdTFIz104vgvdq0kqN0g6mmq8OddswHP/zKhmAyg5DThQCft5X1BZ2Do6xCtkBG"
    onReady={() => initializeUttak(uttakAppID, uttaksperioder, uuid)}
  />
);
