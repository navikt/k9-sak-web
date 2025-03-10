import { goToLos } from '@k9-sak-web/lib/paths/paths.js';
import { useCallback } from 'react';
import SettPaVentModal, { type FormState } from './settPaVentModal/SettPaVentModal';

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
}

export const MenySettPaVentIndexV2 = ({
  behandlingId,
  behandlingVersjon,
  settBehandlingPaVent,
  lukkModal,
  erTilbakekreving,
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
    <SettPaVentModal
      showModal
      submitCallback={submit}
      cancelEvent={lukkModal}
      erTilbakekreving={erTilbakekreving}
      hasManualPaVent
    />
  );
};

export default MenySettPaVentIndexV2;
