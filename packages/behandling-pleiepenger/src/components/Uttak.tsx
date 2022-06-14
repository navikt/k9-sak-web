import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { MicroFrontend } from '@fpsak-frontend/utils';
import { Aksjonspunkt, AlleKodeverk, ArbeidsgiverOpplysningerPerId } from '@k9-sak-web/types';
import React from 'react';

const initializeUttak = (
  elementId,
  uttaksperioder,
  utsattePerioder,
  behandlingUuid: string,
  arbeidsforhold: ArbeidsgiverOpplysningerPerId,
  aksjonspunktkoder: string[],
  kodeverkUtenlandsoppholdÅrsak,
) => {
  (window as any).renderUttakApp(elementId, {
    uttaksperioder,
    utsattePerioder,
    aktivBehandlingUuid: behandlingUuid,
    arbeidsforhold,
    aksjonspunktkoder,
    erFagytelsetypeLivetsSluttfase: false,
    kodeverkUtenlandsoppholdÅrsak,
  });
};

interface UttakProps {
  uuid: string;
  uttaksperioder: any;
  utsattePerioder: string[];
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  aksjonspunkter: Aksjonspunkt[];
  alleKodeverk: AlleKodeverk;
}

const uttakAppID = 'uttakApp';
export default ({
  uuid,
  uttaksperioder,
  utsattePerioder,
  arbeidsgiverOpplysningerPerId,
  aksjonspunkter,
  alleKodeverk,
}: UttakProps) => {
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
          utsattePerioder,
          uuid,
          arbeidsgiverOpplysningerPerId,
          funnedeRelevanteAksjonspunktkoder,
          alleKodeverk?.UtenlandsoppholdÅrsak,
        )
      }
    />
  );
};
