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
    jsSrc="/k9/microfrontend/psb-uttak/1.0.15/app.js"
    jsIntegrity="sha384-cluofH7W6hyb4mayIPJApd16omPLYMZnqYkLl+R8oJJGPE7lNgHCYD1J8bSJeX+w"
    stylesheetSrc="/k9/microfrontend/psb-uttak/1.0.15/styles.css"
    stylesheetIntegrity="sha384-hhKDiE6Kpc5DT489hk2o+rS12mO9j2aMSUcKliD8r8M6p9rtu5FlvT7P6b7wEWUd"
    onReady={() => initializeUttak(uttakAppID, uttaksperioder, uuid)}
  />
);
