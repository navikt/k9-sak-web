import { MicroFrontend } from '@fpsak-frontend/utils';
import React from 'react';
import { ArbeidsgiverOpplysningerPerId } from '@k9-sak-web/types';

const initializeUttak = (
  elementId,
  uttaksperioder,
  behandlingUuid: string,
  arbeidsforhold: ArbeidsgiverOpplysningerPerId,
) => {
  (window as any).renderUttakApp(elementId, {
    uttaksperioder,
    aktivBehandlingUuid: behandlingUuid,
    arbeidsforhold,
  });
};

interface UttakProps {
  uuid: string;
  uttaksperioder: any;
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
}

const uttakAppID = 'uttakApp';
export default ({ uuid, uttaksperioder, arbeidsgiverOpplysningerPerId }: UttakProps) => (
  <MicroFrontend
    id={uttakAppID}
    jsSrc="/k9/microfrontend/psb-uttak/1/app.js"
    stylesheetSrc="/k9/microfrontend/psb-uttak/1/styles.css"
    noCache
    onReady={() => initializeUttak(uttakAppID, uttaksperioder, uuid, arbeidsgiverOpplysningerPerId)}
  />
);
