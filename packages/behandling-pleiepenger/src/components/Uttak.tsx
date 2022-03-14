import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { MicroFrontend } from '@fpsak-frontend/utils';
import { Aksjonspunkt, ArbeidsgiverOpplysningerPerId } from '@k9-sak-web/types';
import React from 'react';

const initializeUttak = (
  elementId,
  uttaksperioder,
  behandlingUuid: string,
  arbeidsforhold: ArbeidsgiverOpplysningerPerId,
  aksjonspunktkoder: string[],
) => {
  (window as any).renderUttakApp(elementId, {
    uttaksperioder,
    aktivBehandlingUuid: behandlingUuid,
    arbeidsforhold,
    aksjonspunktkoder,
  });
};

interface UttakProps {
  uuid: string;
  uttaksperioder: any;
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  aksjonspunkter: Aksjonspunkt[];
}

const uttakAppID = 'uttakApp';
export default ({ uuid, uttaksperioder, arbeidsgiverOpplysningerPerId, aksjonspunkter }: UttakProps) => {
  const relevanteAksjonspunkter = [aksjonspunktCodes.VENT_ANNEN_PSB_SAK];
  const funnedeRelevanteAksjonspunkter = aksjonspunkter.filter(aksjonspunkt =>
    relevanteAksjonspunkter.some(relevantAksjonspunkt => relevantAksjonspunkt === aksjonspunkt.definisjon),
  );
  const funnedeRelevanteAksjonspunktkoder = funnedeRelevanteAksjonspunkter
    .filter(aksjonspunkt => aksjonspunkt.status === aksjonspunktStatus.OPPRETTET)
    .map(aksjonspunkt => aksjonspunkt.definisjon);
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
          uuid,
          arbeidsgiverOpplysningerPerId,
          funnedeRelevanteAksjonspunktkoder,
        )
      }
    />
  );
};
