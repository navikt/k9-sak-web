import type { k9_klage_kontrakt_klage_KlageVurderingResultatDto } from '@k9-sak-web/backend/k9klage/generated/types.js';
import { BoxNew, Button, HGrid } from '@navikt/ds-react';

interface OwnProps {
  klageResultat: k9_klage_kontrakt_klage_KlageVurderingResultatDto;
  readOnly: boolean;
  behandlingPåVent: boolean;
  submitCallback: () => void;
  isSubmitting: boolean;
}
/**
 *
 * Håndterer aksjonspunktet for vedtak når klagen er vurdert av NKK
 * VKI oppgave oppretter et aksjonspunkt som en huskelapp for saksbehandlere
 * som da må trykke på "Fatt Vedtak" for å gå videre/fullføre aksjonspunktet.
 *
 * Dette gjelder aksjonspunkt 5034, VURDERE_DOKUMENT, med klagevurdertav NKK
 *
 */
const VedtakKlageNkkSubmitPanel = ({
  klageResultat,
  readOnly,
  behandlingPåVent,
  submitCallback,
  isSubmitting,
}: OwnProps) => (
  <HGrid gap="space-4" columns={{ xs: '8fr 4fr' }}>
    <div>
      {!readOnly && (
        <BoxNew marginBlock="space-12" marginInline="0 space-16">
          <Button
            variant="primary"
            size="small"
            disabled={behandlingPåVent || klageResultat.godkjentAvMedunderskriver}
            type="submit"
            onClick={submitCallback}
            loading={isSubmitting}
          >
            Fatt Vedtak
          </Button>
        </BoxNew>
      )}
    </div>
  </HGrid>
);

export default VedtakKlageNkkSubmitPanel;
