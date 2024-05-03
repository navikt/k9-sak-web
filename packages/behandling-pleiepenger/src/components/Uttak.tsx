import React from 'react';

import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@k9-sak-web/kodeverk/src/aksjonspunktStatus';
import { VilkarResultPicker } from '@k9-sak-web/prosess-felles';
import { Uttak } from '@k9-sak-web/prosess-uttak';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import { useFeatureToggles } from '@k9-sak-web/shared-components';
import { Aksjonspunkt, AlleKodeverk, ArbeidsgiverOpplysningerPerId, Behandling } from '@k9-sak-web/types';
import { findEndpointsForMicrofrontend, httpErrorHandler } from '@k9-sak-web/utils';
import { OverstyringUttakRequest } from '../types';

interface UttakProps {
  uuid: string;
  behandling: Behandling;
  uttaksperioder: any;
  perioderTilVurdering?: string[];
  utsattePerioder: string[];
  virkningsdatoUttakNyeRegler?: string;
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  aksjonspunkter: Aksjonspunkt[];
  alleKodeverk: AlleKodeverk;
  submitCallback: (data: { kode: string; begrunnelse: string; virkningsdato: string }[]) => void;
  lagreOverstyringUttak: (values: any) => void;
  relevanteAksjonspunkter: string[];
  erOverstyrer: boolean;
}

export default ({
  uuid,
  behandling,
  uttaksperioder,
  perioderTilVurdering = [],
  utsattePerioder,
  arbeidsgiverOpplysningerPerId,
  aksjonspunkter,
  alleKodeverk,
  submitCallback,
  virkningsdatoUttakNyeRegler,
  lagreOverstyringUttak,
  relevanteAksjonspunkter,
  erOverstyrer,
}: UttakProps) => {
  const [featureToggles] = useFeatureToggles();
  const { versjon, links, status: behandlingStatus } = behandling;
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

  const handleOverstyringAksjonspunkt = async (values: OverstyringUttakRequest) => {
    lagreOverstyringUttak({
      '@type': aksjonspunktCodes.OVERSTYRING_AV_UTTAK_KODE,
      ...VilkarResultPicker.transformValues(values),
      ...values,
    });
  };

  return (
    <Uttak
      containerData={{
        httpErrorHandler: httpErrorHandlerCaller,
        endpoints: findEndpointsForMicrofrontend(links, [
          { rel: 'pleiepenger-overstyrtbare-aktiviteter', desiredName: 'behandlingUttakOverstyrbareAktiviteter' },
          { rel: 'pleiepenger-overstyrt-uttak', desiredName: 'behandlingUttakOverstyrt' },
        ]),
        uttaksperioder,
        perioderTilVurdering,
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
        erOverstyrer,
        status: behandlingStatus.kode,
      }}
    />
  );
};
