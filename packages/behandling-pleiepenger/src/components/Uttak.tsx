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
    jsSrc="/k9/microfrontend/psb-uttak/1.0.7/app.js"
    jsIntegrity="sha384-gFrPjxJvpki3sC+sMCesTXUB5KCi28j7RdmaQJn7WlgjNohIJ0XpMbnUnIpDvPFY"
    stylesheetSrc="/k9/microfrontend/psb-uttak/1.0.7/styles.css"
    stylesheetIntegrity="sha384-swIF7lzCWHWd+i8uFRiEeuBvScZUV4ze6R32bzl6S+L8Gy25SW8zpmaF2CuRbTIG"
    onReady={() => initializeUttak(uttakAppID, uttaksperioder, uuid)}
  />
);
