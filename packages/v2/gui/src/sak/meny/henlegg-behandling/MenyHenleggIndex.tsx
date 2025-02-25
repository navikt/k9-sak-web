import type { ArbeidsgiverOversiktDto } from '@k9-sak-web/backend/k9sak/generated';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import HenlagtBehandlingModal from './components/HenlagtBehandlingModal';
import HenleggBehandlingModal, { type HenleggBehandlingFormvalues } from './components/HenleggBehandlingModal';
import type { Klagepart } from './types/Klagepart';
import type { Personopplysninger } from './types/Personopplysninger';

interface OwnProps {
  behandlingId: number;
  behandlingVersjon: number;
  henleggBehandling: (params: {
    behandlingVersjon: number;
    behandlingId: number;
    årsakKode: string;
    begrunnelse: string;
  }) => Promise<any>;
  forhandsvisHenleggBehandling: (erHenleggelse: boolean, data: any) => void;
  ytelseType: string;
  behandlingType: string;
  behandlingResultatTyper: string[];
  gaaTilSokeside: () => void;
  lukkModal: () => void;
  personopplysninger?: Personopplysninger;
  arbeidsgiverOpplysningerPerId?: ArbeidsgiverOversiktDto['arbeidsgivere'];
  hentMottakere: () => Promise<Klagepart[]>;
}

const MenyHenleggIndexV2 = ({
  behandlingId,
  behandlingVersjon,
  henleggBehandling,
  forhandsvisHenleggBehandling,
  ytelseType,
  behandlingType,
  behandlingResultatTyper,
  gaaTilSokeside,
  lukkModal,
  personopplysninger,
  arbeidsgiverOpplysningerPerId,
  hentMottakere,
}: OwnProps) => {
  const [erHenlagt, setHenlagt] = useState(false);

  const { data: brevmottakere } = useQuery<Klagepart[]>({
    queryKey: ['brevmottakere', behandlingId],
    queryFn: hentMottakere,
  });

  const submit = useCallback(
    (formValues: HenleggBehandlingFormvalues) => {
      const valgtMottakerObjekt = brevmottakere?.find(
        mottaker => mottaker.identifikasjon.id === formValues.valgtMottaker,
      );
      const henleggBehandlingDto = {
        behandlingVersjon,
        behandlingId,
        årsakKode: formValues.årsakKode,
        begrunnelse: formValues.begrunnelse,
        fritekst: formValues.fritekst || null,
        valgtMottaker: valgtMottakerObjekt ?? null,
      };
      henleggBehandling(henleggBehandlingDto).then(() => {
        setHenlagt(true);
      });
    },
    [behandlingId, behandlingVersjon, brevmottakere, henleggBehandling],
  );

  return (
    <>
      {!erHenlagt && (
        <HenleggBehandlingModal
          handleSubmit={submit}
          cancelEvent={lukkModal}
          previewHenleggBehandling={forhandsvisHenleggBehandling}
          behandlingId={behandlingId}
          ytelseType={ytelseType}
          behandlingType={behandlingType}
          behandlingResultatTyper={behandlingResultatTyper}
          personopplysninger={personopplysninger}
          arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
          brevmottakere={brevmottakere}
        />
      )}
      {erHenlagt && <HenlagtBehandlingModal showModal closeEvent={gaaTilSokeside} />}
    </>
  );
};

export default MenyHenleggIndexV2;
