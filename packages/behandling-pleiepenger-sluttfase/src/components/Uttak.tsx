import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { MicroFrontend } from '@fpsak-frontend/utils';
import { Aksjonspunkt, ArbeidsgiverOpplysningerPerId } from '@k9-sak-web/types';
import React from 'react';

const initializeUttak = (
  elementId,
  uttaksperioder,
  utsattePerioder,
  behandlingUuid: string,
  arbeidsforhold: ArbeidsgiverOpplysningerPerId,
  aksjonspunktkoder: string[],
  erFagytelsetypeLivetsSluttfase: boolean,
) => {
  (window as any).renderUttakApp(elementId, {
    uttaksperioder,
    utsattePerioder,
    aktivBehandlingUuid: behandlingUuid,
    arbeidsforhold,
    aksjonspunktkoder,
    erFagytelsetypeLivetsSluttfase,
  });
};

interface UttakProps {
  uuid: string;
  uttaksperioder: any;
  utsattePerioder: string[];
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  aksjonspunkter: Aksjonspunkt[];
  erFagytelsetypeLivetsSluttfase: boolean;
}

const uttakAppID = 'uttakApp';
export default ({
  uuid,
  uttaksperioder,
  utsattePerioder,
  arbeidsgiverOpplysningerPerId,
  aksjonspunkter,
  erFagytelsetypeLivetsSluttfase,
}: UttakProps) => {
  const relevanteAksjonspunkter = [aksjonspunktCodes.VENT_ANNEN_PSB_SAK];
  const funnedeRelevanteAksjonspunkter = aksjonspunkter.filter(aksjonspunkt =>
    relevanteAksjonspunkter.some(relevantAksjonspunkt => relevantAksjonspunkt === aksjonspunkt.definisjon.kode),
  );
  const funnedeRelevanteAksjonspunktkoder = funnedeRelevanteAksjonspunkter
    .filter(aksjonspunkt => aksjonspunkt.status.kode === aksjonspunktStatus.OPPRETTET)
    .map(aksjonspunkt => aksjonspunkt.definisjon.kode);
  return (
    <MicroFrontend
      id={uttakAppID}
      jsSrc="/k9/microfrontend/psb-uttak/1/app.js"
      stylesheetSrc="/k9/microfrontend/psb-uttak/1/styles.css"
      noCache
      onReady={() =>
        initializeUttak(
          uttakAppID,
          uttaksperioder,
          utsattePerioder,
          uuid,
          arbeidsgiverOpplysningerPerId,
          funnedeRelevanteAksjonspunktkoder,
          erFagytelsetypeLivetsSluttfase,
        )
      }
    />
  );
};
