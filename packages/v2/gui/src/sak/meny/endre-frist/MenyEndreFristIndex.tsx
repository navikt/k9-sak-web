import { ung_kodeverk_varsel_EtterlysningStatus } from '@k9-sak-web/backend/ungsak/generated/types.js';
import { LoadingPanel } from '@k9-sak-web/gui/shared/loading-panel/LoadingPanel.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { MenyEndreFrist } from './MenyEndreFrist';
import MenyEndreFristBackendClient from './MenyEndreFristBackendClient';

interface MenyEndreFristIndexProps {
  lukkModal: () => void;
  behandlingUuid: string;
  behandlingId: number;
  behandlingVersjon: number;
}

export const MenyEndreFristIndex = ({
  lukkModal,
  behandlingUuid,
  behandlingId,
  behandlingVersjon,
}: MenyEndreFristIndexProps) => {
  const menyEndreFristClient = new MenyEndreFristBackendClient();
  const [showSuccess, setShowSuccess] = useState(false);

  const { data: etterlysninger = [], isLoading } = useQuery({
    queryKey: ['etterlysninger', behandlingUuid],
    queryFn: () => menyEndreFristClient.hentEtterlysninger(behandlingUuid),
    select: etterlysninger =>
      etterlysninger.filter(etterlysning => etterlysning.status !== ung_kodeverk_varsel_EtterlysningStatus.UTLØPT), // TODO: Finne ut hvilke statuser vi skal vise.
  });

  const mutation = useMutation({
    mutationFn: async (formValues: { begrunnelse: string; oppgave: string; fristDato: string }) => {
      const endreteFrister = [
        {
          etterlysningEksternReferanse: formValues.oppgave,
          frist: formValues.fristDato,
          begrunnelse: formValues.begrunnelse,
        },
      ];
      return menyEndreFristClient.endreFrist(behandlingId, behandlingVersjon, endreteFrister);
    },
    onSuccess: () => {
      setShowSuccess(true);
    },
  });

  const handleSubmit = async (formValues: { begrunnelse: string; oppgave: string; fristDato: string }) => {
    await mutation.mutateAsync(formValues);
  };

  if (isLoading) {
    return <LoadingPanel />;
  }

  return (
    <MenyEndreFrist
      lukkModal={lukkModal}
      etterlysninger={etterlysninger}
      endreFrister={handleSubmit}
      showSuccess={showSuccess}
    />
  );
};
