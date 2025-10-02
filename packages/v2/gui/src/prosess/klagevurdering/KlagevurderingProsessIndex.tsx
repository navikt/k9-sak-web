import type {
  ung_sak_kontrakt_aksjonspunkt_AksjonspunktDto,
  ung_sak_kontrakt_fagsak_FagsakDto,
  ung_sak_kontrakt_klage_KlagebehandlingDto,
} from '@k9-sak-web/backend/ungsak/generated/types.js';
import AksjonspunktCodes from '@k9-sak-web/lib/kodeverk/types/AksjonspunktCodes.js';
import { BehandleKlageFormKa } from './src/components/ka/BehandleKlageFormKa';
import { BehandleKlageFormNfp } from './src/components/nfp/BehandleKlageFormNfp';

interface KlagevurderingProsessIndexProps {
  fagsak: ung_sak_kontrakt_fagsak_FagsakDto;
  klageVurdering: ung_sak_kontrakt_klage_KlagebehandlingDto;
  saveKlage: () => Promise<void>;
  submitCallback: () => Promise<void>;
  isReadOnly: boolean;
  previewCallback: () => Promise<void>;
  readOnlySubmitButton: boolean;
  aksjonspunkter: ung_sak_kontrakt_aksjonspunkt_AksjonspunktDto[];
}

export const KlagevurderingProsessIndex = ({
  fagsak,
  klageVurdering,
  saveKlage,
  submitCallback,
  isReadOnly,
  previewCallback,
  readOnlySubmitButton,
  aksjonspunkter,
}: KlagevurderingProsessIndexProps) => (
  <>
    {Array.isArray(aksjonspunkter) &&
      aksjonspunkter.some(a => a.definisjon === AksjonspunktCodes.BEHANDLE_KLAGE_NK) && (
        <BehandleKlageFormKa
          klageVurdering={klageVurdering}
          saveKlage={saveKlage}
          submitCallback={submitCallback}
          isReadOnly={isReadOnly}
          previewCallback={previewCallback}
          readOnlySubmitButton={readOnlySubmitButton}
        />
      )}
    {Array.isArray(aksjonspunkter) &&
      aksjonspunkter.some(a => a.definisjon === AksjonspunktCodes.BEHANDLE_KLAGE_NFP) && (
        <BehandleKlageFormNfp
          fagsak={fagsak}
          klageVurdering={klageVurdering}
          saveKlage={saveKlage}
          submitCallback={submitCallback}
          isReadOnly={isReadOnly}
          previewCallback={previewCallback}
          readOnlySubmitButton={readOnlySubmitButton}
        />
      )}
  </>
);
