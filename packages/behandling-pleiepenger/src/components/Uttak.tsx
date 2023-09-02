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
  løsAksjonspunktVurderDatoNyRegelUttak: ({
    begrunnelse,
    virkningsdato,
  }: {
    begrunnelse: string;
    virkningsdato: string;
  }) => void,
  virkningsdatoUttakNyeRegler?: string,
) => {
  (window as any).renderUttakApp(elementId, {
    uttaksperioder,
    utsattePerioder,
    aktivBehandlingUuid: behandlingUuid,
    arbeidsforhold,
    aksjonspunktkoder,
    erFagytelsetypeLivetsSluttfase: false,
    kodeverkUtenlandsoppholdÅrsak,
    løsAksjonspunktVurderDatoNyRegelUttak,
    virkningsdatoUttakNyeRegler,
  });
};

interface UttakProps {
  uuid: string;
  uttaksperioder: any;
  utsattePerioder: string[];
  virkningsdatoUttakNyeRegler?: string;
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  aksjonspunkter: Aksjonspunkt[];
  alleKodeverk: AlleKodeverk;
  submitCallback: (data: { kode: string; begrunnelse: string; virkningsdato: string }[]) => void;
}
const uttakAppID = 'uttakApp';
export default ({
  uuid,
  uttaksperioder,
  utsattePerioder,
  arbeidsgiverOpplysningerPerId,
  aksjonspunkter,
  alleKodeverk,
  submitCallback,
  virkningsdatoUttakNyeRegler,
}: UttakProps) => {
  const relevanteAksjonspunkter = [aksjonspunktCodes.VENT_ANNEN_PSB_SAK, aksjonspunktCodes.VURDER_DATO_NY_REGEL_UTTAK];
  const funnedeRelevanteAksjonspunkter = aksjonspunkter.filter(aksjonspunkt =>
    relevanteAksjonspunkter.some(relevantAksjonspunkt => relevantAksjonspunkt === aksjonspunkt.definisjon.kode),
  );
  const funnedeRelevanteAksjonspunktkoder = funnedeRelevanteAksjonspunkter
    .filter(aksjonspunkt => aksjonspunkt.status.kode === aksjonspunktStatus.OPPRETTET)
    .map(aksjonspunkt => aksjonspunkt.definisjon.kode);

  const løsAksjonspunktVurderDatoNyRegelUttak = ({ begrunnelse, virkningsdato }) =>
    submitCallback([{ kode: aksjonspunktCodes.VURDER_DATO_NY_REGEL_UTTAK, begrunnelse, virkningsdato }]);
  return (
    <MicroFrontend
      id={uttakAppID}
      jsSrc="http://localhost:8081/main.js"
      stylesheetSrc="http://localhost:8081/styles.css"
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
          løsAksjonspunktVurderDatoNyRegelUttak,
          virkningsdatoUttakNyeRegler,
        )
      }
    />
  );
};
