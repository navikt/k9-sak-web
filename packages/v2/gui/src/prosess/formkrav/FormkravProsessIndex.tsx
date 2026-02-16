import type { AksjonspunktDto } from '@k9-sak-web/backend/combined/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { ArbeidsgiverOversiktDto } from '@k9-sak-web/backend/combined/kontrakt/arbeidsgiver/ArbeidsgiverOversiktDto.js';
import type { FagsakDto } from '@k9-sak-web/backend/combined/kontrakt/fagsak/FagsakDto.js';
import type { KlagebehandlingDto } from '@k9-sak-web/backend/combined/kontrakt/klage/KlagebehandlingDto.js';
import type { PartDto } from '@k9-sak-web/backend/combined/kontrakt/klage/PartDto.js';
import type { BehandlingDto as K9KlageBehandlingDto } from '@k9-sak-web/backend/k9klage/kontrakt/behandling/BehandlingDto.js';
import type { BehandlingDto as UngSakBehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import { erTilbakekreving } from '@k9-sak-web/gui/utils/behandlingUtils.js';
import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';
import AksjonspunktCodes from '@k9-sak-web/lib/kodeverk/types/AksjonspunktCodes.js';
import type { KodeverkObject } from '@k9-sak-web/lib/kodeverk/types.js';
import { FormkravKlageFormKa } from './components/FormkravKlageFormKa';
import { FormkravKlageFormNfp } from './components/FormkravKlageFormNfp';

interface OwnProps {
  behandling: K9KlageBehandlingDto | UngSakBehandlingDto;
  klageVurdering: KlagebehandlingDto;
  avsluttedeBehandlinger: K9KlageBehandlingDto[] | UngSakBehandlingDto[];
  aksjonspunkter: AksjonspunktDto[];
  submitCallback: (data: any) => Promise<void>;
  isReadOnly: boolean;
  readOnlySubmitButton: boolean;
  parterMedKlagerett?: PartDto[];
  valgtPartMedKlagerett?: PartDto;
  fagsak: FagsakDto;
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOversiktDto['arbeidsgivere'];
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

interface BehandlingMedKodeverkType {
  type: KodeverkObject;
}

const FormkravProsessIndexPropsTransformer = (
  props: Omit<OwnProps, 'avsluttedeBehandlinger'> & {
    avsluttedeBehandlinger: BehandlingMedKodeverkType[];
  },
) => {
  const deepCopyProps = JSON.parse(JSON.stringify(props));
  konverterKodeverkTilKode(deepCopyProps, false);
  const avsluttedeBehandlingerCopy: BehandlingMedKodeverkType[] = JSON.parse(
    JSON.stringify(props.avsluttedeBehandlinger),
  );
  avsluttedeBehandlingerCopy.forEach(behandling => {
    const erTilbakekrevingType = erTilbakekreving(behandling.type.kode);
    konverterKodeverkTilKode(behandling, erTilbakekrevingType);
  });
  return <FormkravProsessIndex {...props} {...deepCopyProps} avsluttedeBehandlinger={avsluttedeBehandlingerCopy} />;
};

export default FormkravProsessIndexPropsTransformer;
