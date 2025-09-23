import { useContext } from 'react';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { findEndpointsFromRels, httpErrorHandler } from '@fpsak-frontend/utils';
import { Inntektsgradering } from '@k9-sak-web/prosess-uttak';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import { Aksjonspunkt, AlleKodeverk, ArbeidsgiverOpplysningerPerId, Behandling } from '@k9-sak-web/types';
import FeatureTogglesContext from '@k9-sak-web/gui/featuretoggles/FeatureTogglesContext.js';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import Uttak from '@k9-sak-web/gui/prosess/uttak/Uttak.js';

interface UttakProps {
  uttak: any; // TODO: Replace with actual type
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
  hentBehandling: (params?: any, keepData?: boolean) => Promise<Behandling>;
  relevanteAksjonspunkter: string[];
  erOverstyrer: boolean;
  readOnly: boolean;
}

export default ({
  uttak,
  behandling,
  uttaksperioder,
  inntektsgraderinger,
  utsattePerioder,
  arbeidsgiverOpplysningerPerId,
  aksjonspunkter,
  alleKodeverk,
  submitCallback,
  virkningsdatoUttakNyeRegler,
  hentBehandling,
  relevanteAksjonspunkter,
  erOverstyrer,
  readOnly,
}: UttakProps) => {
  const featureToggles = useContext(FeatureTogglesContext);
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

  /*
   * Midlertidig fiks for å oppdatere behandling etter å ha fullført aksjonspunkt. Ifm med
   * kodeverk-endringene kommer en context for behandlingsid og -versjon, denne kan nok
   * tilpasses til å kunne trigge oppdatering av behandling "on-demand"
   */
  const oppdaterBehandling = () => {
    // FIXME temp fiks for å håndtere oppdatering av behandling
    window.location.reload();
  };

  return (
    <Uttak
      containerData={{
        uttak,
        behandling,
        httpErrorHandler: httpErrorHandlerCaller,
        endpoints: findEndpointsFromRels(links ?? [], [
          { rel: 'pleiepenger-overstyrtbare-aktiviteter', desiredName: 'behandlingUttakOverstyrbareAktiviteter' },
          { rel: 'pleiepenger-overstyrt-uttak', desiredName: 'behandlingUttakOverstyrt' },
        ]),
        uttaksperioder,
        inntektsgraderinger,
        perioderTilVurdering,
        utsattePerioder,
        ytelsetype: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN,
        aktivBehandlingUuid: behandling.uuid,
        arbeidsforhold: arbeidsgiverOpplysningerPerId,
        aksjonspunktkoder: funnedeRelevanteAksjonspunktkoder,
        kodeverkUtenlandsoppholdÅrsak: alleKodeverk?.UtenlandsoppholdÅrsak,
        løsAksjonspunktVurderDatoNyRegelUttak,
        virkningsdatoUttakNyeRegler,
        aksjonspunkter: funnedeRelevanteAksjonspunkter,
        hentBehandling,
        versjon,
        erOverstyrer,
        status: behandlingStatus.kode,
        readOnly,
        oppdaterBehandling,
      }}
    />
  );
};
