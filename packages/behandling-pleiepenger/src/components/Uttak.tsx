import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { findEndpointsFromRels, httpErrorHandler } from '@fpsak-frontend/utils';
import { VilkarResultPicker } from '@k9-sak-web/prosess-felles';
import { Inntektsgradering, Uttak } from '@k9-sak-web/prosess-uttak';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import { Aksjonspunkt, AlleKodeverk, ArbeidsgiverOpplysningerPerId, Behandling } from '@k9-sak-web/types';
import VurderOverlappendeSakIndex from '@k9-sak-web/gui/prosess/uttak/vurder-overlappende-sak/VurderOverlappendeSakIndex.js';
import { OverstyringUttakRequest } from '../types';
import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';
import { VStack } from '@navikt/ds-react';
import { useFeatureToggles } from '@fpsak-frontend/shared-components';

interface UttakProps {
  uuid: string;
  behandling: Behandling;
  uttaksperioder: any;
  inntektsgraderinger: Inntektsgradering[];
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
  readOnly: boolean;
}

export default ({
  uuid,
  behandling,
  uttaksperioder,
  inntektsgraderinger,
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
  readOnly,
}: UttakProps) => {
  const { featureToggles } = useFeatureToggles();
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

  const VurderOverlappendeSakComponent = () => {
    const deepCopyProps = JSON.parse(
      JSON.stringify({
        behandling: behandling,
        aksjonspunkt: aksjonspunkter.find(
          aksjonspunkt => aksjonspunktCodes.VURDER_OVERLAPPENDE_SØSKENSAK_KODE === aksjonspunkt.definisjon.kode,
        ),
      }),
    );
    konverterKodeverkTilKode(deepCopyProps, false);

    return (
      <VStack>
        <VurderOverlappendeSakIndex behandling={deepCopyProps.behandling} aksjonspunkt={deepCopyProps.aksjonspunkt} />
      </VStack>
    );
  };

  return (
    <Uttak
      containerData={{
        httpErrorHandler: httpErrorHandlerCaller,
        endpoints: findEndpointsFromRels(links, [
          { rel: 'pleiepenger-overstyrtbare-aktiviteter', desiredName: 'behandlingUttakOverstyrbareAktiviteter' },
          { rel: 'pleiepenger-overstyrt-uttak', desiredName: 'behandlingUttakOverstyrt' },
        ]),
        uttaksperioder,
        inntektsgraderinger,
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
        erOverstyrer,
        status: behandlingStatus.kode,
        readOnly,
        vurderOverlappendeSakComponent: VurderOverlappendeSakComponent(),
      }}
    />
  );
};
