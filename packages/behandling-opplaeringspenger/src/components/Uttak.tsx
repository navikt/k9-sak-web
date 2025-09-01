import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { Inntektsgradering, Uttak } from '@k9-sak-web/prosess-uttak';
import { Aksjonspunkt, AlleKodeverk, ArbeidsgiverOpplysningerPerId, Behandling } from '@k9-sak-web/types';
import { VStack } from '@navikt/ds-react';
import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';
import VurderOverlappendeSakIndex from '@k9-sak-web/gui/prosess/uttak/vurder-overlappende-sak/VurderOverlappendeSakIndex.js';

interface UttakProps {
  behandling: Pick<Behandling, 'versjon' | 'uuid' | 'status'>;
  uttaksperioder: any;
  inntektsgraderinger?: Inntektsgradering[];
  perioderTilVurdering?: string[];
  utsattePerioder: string[];
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  aksjonspunkter: Aksjonspunkt[];
  alleKodeverk: AlleKodeverk;
  submitCallback: (data: { kode: string; begrunnelse: string; virkningsdato: string }[]) => void;
  virkningsdatoUttakNyeRegler?: string;
  readOnly: boolean;
}

export default ({
  behandling,
  uttaksperioder,
  inntektsgraderinger,
  utsattePerioder,
  perioderTilVurdering = [],
  arbeidsgiverOpplysningerPerId,
  aksjonspunkter,
  alleKodeverk,
  submitCallback,
  virkningsdatoUttakNyeRegler,
  readOnly,
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

  const VurderOverlappendeSakComponent = () => {
    const aksjonspunkt = aksjonspunkter.find(
      aksjonspunkt => aksjonspunktCodes.VURDER_OVERLAPPENDE_SØSKENSAK_KODE === aksjonspunkt.definisjon.kode,
    );

    if (aksjonspunkt) {
      const deepCopyProps = JSON.parse(
        JSON.stringify({
          behandling: behandling,
          aksjonspunkt: aksjonspunkt,
        }),
      );
      konverterKodeverkTilKode(deepCopyProps, false);

      return (
        <VStack>
          <VurderOverlappendeSakIndex
            behandling={deepCopyProps.behandling}
            aksjonspunkt={deepCopyProps.aksjonspunkt}
            readOnly={readOnly}
            oppdaterBehandling={oppdaterBehandling}
          />
        </VStack>
      );
    }

    return <></>;
  };

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
        behandling,
        uttaksperioder,
        inntektsgraderinger,
        utsattePerioder,
        aktivBehandlingUuid: behandling.uuid,
        perioderTilVurdering,
        arbeidsforhold: arbeidsgiverOpplysningerPerId,
        aksjonspunktkoder: funnedeRelevanteAksjonspunktkoder,
        ytelsetype: fagsakYtelsesType.OPPLÆRINGSPENGER,
        kodeverkUtenlandsoppholdÅrsak: alleKodeverk?.UtenlandsoppholdÅrsak,
        løsAksjonspunktVurderDatoNyRegelUttak,
        virkningsdatoUttakNyeRegler,
        erOverstyrer: false, // Overstyring er ikke implementert for Pleiepenger
        readOnly,
        vurderOverlappendeSakComponent: VurderOverlappendeSakComponent(),
        oppdaterBehandling,
      }}
    />
  );
};
