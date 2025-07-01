import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { Uttak } from '@k9-sak-web/prosess-uttak';
import { Aksjonspunkt, AlleKodeverk, ArbeidsgiverOpplysningerPerId } from '@k9-sak-web/types';
import { BehandlingDto } from '@navikt/k9-sak-typescript-client';

interface UttakProps {
  behandling: Pick<BehandlingDto, 'versjon' | 'uuid'>;
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

  return (
    <Uttak
      containerData={{
        behandling,
        uttaksperioder,
        utsattePerioder,
        perioderTilVurdering,
        aktivBehandlingUuid: behandling.uuid,
        arbeidsforhold: arbeidsgiverOpplysningerPerId,
        aksjonspunktkoder: funnedeRelevanteAksjonspunktkoder,
        ytelsetype: fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE,
        kodeverkUtenlandsoppholdÅrsak: alleKodeverk?.UtenlandsoppholdÅrsak,
        løsAksjonspunktVurderDatoNyRegelUttak,
        virkningsdatoUttakNyeRegler,
        aksjonspunkter: funnedeRelevanteAksjonspunkter,
        erOverstyrer: false, // Overstyring er ikke implementert for PILS
        readOnly,
      }}
    />
  );
};
