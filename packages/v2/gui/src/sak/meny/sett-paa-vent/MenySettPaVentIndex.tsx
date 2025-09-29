import SettPåVentModal, { type FormState } from '@k9-sak-web/gui/shared/settPåVentModal/SettPåVentModal.js';
import { useCallback } from 'react';

interface OwnProps {
  behandlingId: number;
  behandlingVersjon: number;
  behandlingUuid?: string;
  settBehandlingPaVent: (params: {
    behandlingVersjon: number;
    behandlingId: number;
    behandlingUuid?: string;
    frist: string;
    ventearsak: string;
  }) => Promise<any>;
  lukkModal: () => void;
  erTilbakekreving: boolean;
  erKlage: boolean;
  navigerEtterSattPåVent: () => void;
}

export const MenySettPaVentIndexV2 = ({
  behandlingId,
  behandlingVersjon,
  settBehandlingPaVent,
  lukkModal,
  erTilbakekreving,
  erKlage,
  behandlingUuid,
  navigerEtterSattPåVent,
}: OwnProps) => {
  const submit = useCallback(
    async (formValues: FormState) => {
      const values = {
        behandlingVersjon,
        behandlingId,
        behandlingUuid,
        frist: formValues.frist,
        ventearsak: formValues.ventearsak,
        ventearsakVariant: formValues.ventearsakVariant,
      };
      await settBehandlingPaVent(values);
      navigerEtterSattPåVent();
    },
    [behandlingId, behandlingVersjon],
  );

  return (
    <SettPåVentModal
      showModal
      submitCallback={submit}
      cancelEvent={lukkModal}
      erTilbakekreving={erTilbakekreving}
      erKlage={erKlage}
      hasManualPaVent
    />
  );
};

export default MenySettPaVentIndexV2;
