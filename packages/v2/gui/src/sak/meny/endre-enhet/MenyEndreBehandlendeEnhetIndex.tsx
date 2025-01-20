import { useCallback, useMemo } from 'react';

import EndreBehandlendeEnhetModal, { type FormValues } from './components/EndreBehandlendeEnhetModal';

interface OwnProps {
  behandlingId: number;
  behandlingVersjon: number;
  behandlendeEnhetId: string;
  behandlendeEnhetNavn: string;
  nyBehandlendeEnhet: (params: {
    behandlingVersjon: number;
    behandlingId: number;
    enhetNavn: string;
    enhetId: string;
    begrunnelse: string;
  }) => void;
  behandlendeEnheter: {
    enhetId: string;
    enhetNavn: string;
  }[];
  lukkModal: () => void;
}

const MenyEndreBehandlendeEnhetIndexV2 = ({
  behandlingId,
  behandlingVersjon,
  behandlendeEnhetId,
  behandlendeEnhetNavn,
  nyBehandlendeEnhet,
  behandlendeEnheter,
  lukkModal,
}: OwnProps) => {
  const filtrerteBehandlendeEnheter = useMemo(
    () => behandlendeEnheter.filter(enhet => enhet.enhetId !== behandlendeEnhetId),
    [behandlendeEnheter],
  );

  const submit = useCallback(
    (formValues: FormValues) => {
      const nyEnhet = filtrerteBehandlendeEnheter[parseInt(formValues.nyEnhet, 10)];
      const values = {
        behandlingVersjon,
        behandlingId,
        enhetNavn: nyEnhet?.enhetNavn ?? '',
        enhetId: nyEnhet?.enhetId ?? '',
        begrunnelse: formValues.begrunnelse,
      };
      nyBehandlendeEnhet(values);
      lukkModal();
    },
    [behandlingId, behandlingVersjon, nyBehandlendeEnhet],
  );
  return (
    <EndreBehandlendeEnhetModal
      lukkModal={lukkModal}
      behandlendeEnheter={filtrerteBehandlendeEnheter}
      gjeldendeBehandlendeEnhetId={behandlendeEnhetId}
      gjeldendeBehandlendeEnhetNavn={behandlendeEnhetNavn}
      onSubmit={submit}
    />
  );
};

export default MenyEndreBehandlendeEnhetIndexV2;
