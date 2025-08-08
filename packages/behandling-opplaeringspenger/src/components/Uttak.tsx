import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { Uttak } from '@k9-sak-web/prosess-uttak';
import { Aksjonspunkt, AlleKodeverk, ArbeidsgiverOpplysningerPerId, Behandling } from '@k9-sak-web/types';

interface UttakProps {
  behandling: Pick<Behandling, 'versjon' | 'uuid' | 'status'>;
  uttaksperioder: any;
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
        oppdaterBehandling,
      }}
    />
  );
};
