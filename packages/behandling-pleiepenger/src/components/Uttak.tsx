import React from 'react';

import { useFeatureToggles } from '@fpsak-frontend/shared-components';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { Aksjonspunkt, AlleKodeverk, ArbeidsgiverOpplysningerPerId, Behandling } from '@k9-sak-web/types';
import { Uttak } from '@k9-sak-web/prosess-uttak';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import { findEndpointsForMicrofrontend, httpErrorHandler } from '@fpsak-frontend/utils';
import { VilkarResultPicker } from '@k9-sak-web/prosess-felles';

interface UttakProps {
  uuid: string;
  behandling: Behandling;
  uttaksperioder: any;
  utsattePerioder: string[];
  virkningsdatoUttakNyeRegler?: string;
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  aksjonspunkter: Aksjonspunkt[];
  alleKodeverk: AlleKodeverk;
  submitCallback: (data: { kode: string; begrunnelse: string; virkningsdato: string }[]) => void;
  lagreOverstyringUttak: (values: any) => void;
  relevanteAksjonspunkter: string[];
}
export default ({
  uuid,
  behandling,
  uttaksperioder,
  utsattePerioder,
  arbeidsgiverOpplysningerPerId,
  aksjonspunkter,
  alleKodeverk,
  submitCallback,
  virkningsdatoUttakNyeRegler,
  lagreOverstyringUttak,
  relevanteAksjonspunkter,
}: UttakProps) => {
  const [featureToggles] = useFeatureToggles();
  const { versjon, links } = behandling;
  const { addErrorMessage } = useRestApiErrorDispatcher();
  const httpErrorHandlerCaller = (status: number, locationHeader?: string) =>
    httpErrorHandler(status, addErrorMessage, locationHeader);

  const funnedeRelevanteAksjonspunkter = aksjonspunkter.filter(aksjonspunkt =>
    relevanteAksjonspunkter.some(relevantAksjonspunkt => relevantAksjonspunkt === aksjonspunkt.definisjon.kode),
  );
  const funnedeRelevanteAksjonspunktkoder = funnedeRelevanteAksjonspunkter
    .filter(aksjonspunkt => aksjonspunkt.status.kode === aksjonspunktStatus.OPPRETTET)
    .map(aksjonspunkt => aksjonspunkt.definisjon.kode);

  const løsAksjonspunktVurderDatoNyRegelUttak = ({ begrunnelse, virkningsdato }) =>
    submitCallback([{ kode: aksjonspunktCodes.VURDER_DATO_NY_REGEL_UTTAK, begrunnelse, virkningsdato }]);

  const handleOverstyringAksjonspunkt = async values => {
    lagreOverstyringUttak({
      // erVilkarOk: false, // TODO: WIP
      '@type': aksjonspunktCodes.OVERSTYRING_AV_UTTAK_KODE, // overstyringApKode,
      ...VilkarResultPicker.transformValues(values),
      ...values,
    });
  };

  return (
    <Uttak
      containerData={{
        httpErrorHandlerCaller,
        endpoints: findEndpointsForMicrofrontend(links, [
          { rel: 'pleiepenger-overstyrtbare-aktiviteter', desiredName: 'behandlingUttakOverstyrbareAktiviteter' },
          { rel: 'pleiepenger-overstyrt-uttak', desiredName: 'behandlingUttakOverstyrt' },
        ]),
        uttaksperioder,
        utsattePerioder,
        aktivBehandlingUuid: uuid,
        arbeidsforhold: arbeidsgiverOpplysningerPerId,
        aksjonspunktkoder: funnedeRelevanteAksjonspunktkoder,
        erFagytelsetypeLivetsSluttfase: false,
        kodeverkUtenlandsoppholdÅrsak: alleKodeverk?.UtenlandsoppholdÅrsak,
        løsAksjonspunktVurderDatoNyRegelUttak,
        virkningsdatoUttakNyeRegler,
        aksjonspunkter: funnedeRelevanteAksjonspunkter,
        handleOverstyringAksjonspunkt,
        versjon,
        featureToggles,
      }}
    />
  );
};
