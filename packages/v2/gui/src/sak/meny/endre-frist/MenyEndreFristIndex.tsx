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
  const [nyFrist, setNyFrist] = useState<string | undefined>(undefined);
  const { data: etterlysninger = [], isLoading } = useQuery({
    queryKey: ['etterlysninger', behandlingUuid],
    queryFn: () => api.hentEtterlysninger(behandlingUuid),
    select: etterlysninger =>
      etterlysninger.filter(etterlysning => etterlysning.status === ung_kodeverk_varsel_EtterlysningStatus.VENTER),
  });

  const mutation = useMutation({
    mutationFn: async (formValues: { begrunnelse: string; oppgave: string; fristDato: string }) => {
      const endretFrister = [
        {
          etterlysningEksternReferanse: formValues.oppgave,
          frist: formValues.fristDato,
          begrunnelse: formValues.begrunnelse,
        },
      ];
      setNyFrist(formValues.fristDato);
      return api.endreFrist(behandlingId, behandlingVersjon, endretFrister).catch(() => {
        setNyFrist(undefined);
        throw new Error('Noe gikk galt ved endring av frist. Vennligst prøv igjen senere.');
      });
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
      showSuccess={mutation.isSuccess}
      isLoading={isLoading || mutation.isPending}
      submitError={mutation.isError ? (mutation.error as Error).message : undefined}
      nyFrist={nyFrist}
    />
  );
};
