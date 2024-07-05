import React from 'react';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { Aksjonspunkt, AlleKodeverk, ArbeidsgiverOpplysningerPerId } from '@k9-sak-web/types';
import { Uttak } from '@k9-sak-web/prosess-uttak';
import { useFeatureToggles } from '@fpsak-frontend/shared-components';

interface UttakProps {
  uuid: string;
  uttaksperioder: any;
  perioderTilVurdering?: string[];
  utsattePerioder: string[];
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  aksjonspunkter: Aksjonspunkt[];
  alleKodeverk: AlleKodeverk;
  erFagytelsetypeLivetsSluttfase: boolean;
  submitCallback: (data: { kode: string; begrunnelse: string; virkningsdato: string }[]) => void;
  virkningsdatoUttakNyeRegler?: string;
}

export default ({
  uuid,
  uttaksperioder,
  utsattePerioder,
  perioderTilVurdering = [],
  arbeidsgiverOpplysningerPerId,
  aksjonspunkter,
  alleKodeverk,
  erFagytelsetypeLivetsSluttfase,
  submitCallback,
  virkningsdatoUttakNyeRegler,
}: UttakProps) => {
  const [featureToggles] = useFeatureToggles();
  const relevanteAksjonspunkter = [aksjonspunktCodes.VENT_ANNEN_PSB_SAK, aksjonspunktCodes.VURDER_DATO_NY_REGEL_UTTAK];
  const funnedeRelevanteAksjonspunkter = aksjonspunkter.filter(aksjonspunkt =>
    relevanteAksjonspunkter.some(relevantAksjonspunkt => relevantAksjonspunkt === aksjonspunkt.definisjon),
  );
  const funnedeRelevanteAksjonspunktkoder = funnedeRelevanteAksjonspunkter
    .filter(aksjonspunkt => aksjonspunkt.status === aksjonspunktStatus.OPPRETTET)
    .map(aksjonspunkt => aksjonspunkt.definisjon);

  const løsAksjonspunktVurderDatoNyRegelUttak = ({ begrunnelse, virkningsdato }) =>
    submitCallback([{ kode: aksjonspunktCodes.VURDER_DATO_NY_REGEL_UTTAK, begrunnelse, virkningsdato }]);

  return (
    <Uttak
      containerData={{
        uttaksperioder,
        utsattePerioder,
        perioderTilVurdering,
        aktivBehandlingUuid: uuid,
        arbeidsforhold: arbeidsgiverOpplysningerPerId,
        aksjonspunktkoder: funnedeRelevanteAksjonspunktkoder,
        erFagytelsetypeLivetsSluttfase,
        kodeverkUtenlandsoppholdÅrsak: alleKodeverk?.UtenlandsoppholdÅrsak,
        løsAksjonspunktVurderDatoNyRegelUttak,
        virkningsdatoUttakNyeRegler,
        aksjonspunkter: funnedeRelevanteAksjonspunkter,
        featureToggles,
        erOverstyrer: false, // Overstyring er ikke implementert for PILS
      }}
    />
  );
};
