import type {
  k9_klage_kontrakt_aksjonspunkt_AksjonspunktDto,
  k9_klage_kontrakt_behandling_BehandlingDto,
  k9_klage_kontrakt_behandling_part_PartDto,
  k9_klage_kontrakt_klage_KlagebehandlingDto,
} from '@k9-sak-web/backend/k9klage/generated/types.js';
import type {
  ung_sak_kontrakt_arbeidsforhold_ArbeidsgiverOversiktDto,
  ung_sak_kontrakt_fagsak_FagsakDto,
} from '@k9-sak-web/backend/ungsak/generated/types.js';
import AksjonspunktCodes from '@k9-sak-web/lib/kodeverk/types/AksjonspunktCodes.js';
import { FormkravKlageFormKa } from './components/FormkravKlageFormKa';
import { FormkravKlageFormNfp } from './components/FormkravKlageFormNfp';

interface OwnProps {
  behandling: k9_klage_kontrakt_behandling_BehandlingDto;
  klageVurdering: k9_klage_kontrakt_klage_KlagebehandlingDto;
  avsluttedeBehandlinger: k9_klage_kontrakt_behandling_BehandlingDto[];
  aksjonspunkter: k9_klage_kontrakt_aksjonspunkt_AksjonspunktDto[];
  submitCallback: (data: any) => Promise<void>;
  isReadOnly: boolean;
  readOnlySubmitButton: boolean;
  parterMedKlagerett?: k9_klage_kontrakt_behandling_part_PartDto[];
  valgtPartMedKlagerett?: k9_klage_kontrakt_behandling_part_PartDto;
  fagsak: ung_sak_kontrakt_fagsak_FagsakDto;
  arbeidsgiverOpplysningerPerId: ung_sak_kontrakt_arbeidsforhold_ArbeidsgiverOversiktDto['arbeidsgivere'];
}

export const FormkravProsessIndex = ({
  klageVurdering = {},
  avsluttedeBehandlinger,
  aksjonspunkter,
  submitCallback,
  isReadOnly,
  readOnlySubmitButton,
  parterMedKlagerett,
  valgtPartMedKlagerett,
  fagsak,
  arbeidsgiverOpplysningerPerId,
}: OwnProps) => (
  <>
    {Array.isArray(aksjonspunkter) &&
      aksjonspunkter.some(a => a.definisjon === AksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_NFP) && (
        <FormkravKlageFormNfp
          klageVurdering={klageVurdering}
          submitCallback={submitCallback}
          readOnly={isReadOnly}
          readOnlySubmitButton={readOnlySubmitButton}
          avsluttedeBehandlinger={avsluttedeBehandlinger}
          parterMedKlagerett={parterMedKlagerett}
          valgtPartMedKlagerett={valgtPartMedKlagerett}
          fagsakPerson={fagsak.person}
          arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        />
      )}
    {Array.isArray(aksjonspunkter) &&
      aksjonspunkter.some(a => a.definisjon === AksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_KA) && (
        <FormkravKlageFormKa
          klageVurdering={klageVurdering}
          submitCallback={submitCallback}
          readOnly={isReadOnly}
          readOnlySubmitButton={readOnlySubmitButton}
          avsluttedeBehandlinger={avsluttedeBehandlinger}
          parterMedKlagerett={parterMedKlagerett}
          valgtPartMedKlagerett={valgtPartMedKlagerett}
          fagsakPerson={fagsak.person}
          arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        />
      )}
  </>
);
