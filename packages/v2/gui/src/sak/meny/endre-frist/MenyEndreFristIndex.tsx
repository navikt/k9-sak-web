import { ung_kodeverk_varsel_EtterlysningStatus } from '@k9-sak-web/backend/ungsak/generated/types.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { MenyEndreFrist } from './MenyEndreFrist';
import type { MenyEndreFristApi } from './MenyEndreFristApi';

interface MenyEndreFristIndexProps {
  lukkModal: () => void;
  behandlingUuid: string;
  behandlingId: number;
  behandlingVersjon: number;
  api: MenyEndreFristApi;
}

export const MenyEndreFristIndex = ({
  lukkModal,
  behandlingUuid,
  behandlingId,
  behandlingVersjon,
  api,
}: MenyEndreFristIndexProps) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);
  const { data: etterlysninger = [], isLoading } = useQuery({
    queryKey: ['etterlysninger', behandlingUuid],
    queryFn: () => api.hentEtterlysninger(behandlingUuid),
    select: etterlysninger =>
      etterlysninger.filter(etterlysning => etterlysning.status === ung_kodeverk_varsel_EtterlysningStatus.VENTER),
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
      return api.endreFrist(behandlingId, behandlingVersjon, endreteFrister);
    },
    onSuccess: () => {
      setShowSuccess(true);
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        setSubmitError(error.message);
      } else {
        setSubmitError('Noe gikk galt, vennligst prøv igjen senere.');
      }
    },
  });

  const handleSubmit = async (formValues: { begrunnelse: string; oppgave: string; fristDato: string }) => {
    await mutation.mutateAsync(formValues);
  };

  return (
    <MenyEndreFrist
      lukkModal={lukkModal}
      etterlysninger={etterlysninger}
      endreFrister={handleSubmit}
      showSuccess={showSuccess}
      isLoading={isLoading || mutation.isPending}
      submitError={submitError}
    />
  );
};
