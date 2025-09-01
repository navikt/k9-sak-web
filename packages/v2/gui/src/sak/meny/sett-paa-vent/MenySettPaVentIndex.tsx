import SettPåVentModal, { type FormState } from '@k9-sak-web/gui/shared/settPåVentModal/SettPåVentModal.js';
import { goToLos } from '@k9-sak-web/lib/paths/paths.js';
import { useCallback } from 'react';

interface OwnProps {
  behandlingId: number;
  behandlingVersjon: number;
  settBehandlingPaVent: (params: {
    behandlingVersjon: number;
    behandlingId: number;
    frist: string;
    ventearsak: string;
  }) => Promise<any>;
  lukkModal: () => void;
  erTilbakekreving: boolean;
  erKlage: boolean;
}

export const MenySettPaVentIndexV2 = ({
  behandlingId,
  behandlingVersjon,
  settBehandlingPaVent,
  lukkModal,
  erTilbakekreving,
  erKlage,
}: OwnProps) => {
  const submit = useCallback(
    async (formValues: FormState) => {
      const values = {
        behandlingVersjon,
        behandlingId,
        frist: formValues.frist,
        ventearsak: formValues.ventearsak,
        ventearsakVariant: formValues.ventearsakVariant,
      };
      await settBehandlingPaVent(values);
      goToLos();
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
