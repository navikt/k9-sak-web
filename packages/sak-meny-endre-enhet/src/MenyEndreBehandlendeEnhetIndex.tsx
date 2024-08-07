import React, { useCallback, useMemo } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import EndreBehandlendeEnhetModal from './components/EndreBehandlendeEnhetModal';

import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

export const getMenytekst = (): string =>
  intl.formatMessage({ id: 'MenyEndreBehandlendeEnhetIndex.ByttBehandlendeEnhet' });

interface OwnProps {
  behandlingId?: number;
  behandlingVersjon?: number;
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

const MenyEndreBehandlendeEnhetIndex = ({
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
    formValues => {
      const nyEnhet = filtrerteBehandlendeEnheter[parseInt(formValues.nyEnhet, 10)];
      const values = {
        behandlingVersjon,
        behandlingId,
        enhetNavn: nyEnhet.enhetNavn,
        enhetId: nyEnhet.enhetId,
        begrunnelse: formValues.begrunnelse,
      };
      nyBehandlendeEnhet(values);

      lukkModal();
    },
    [behandlingId, behandlingVersjon, nyBehandlendeEnhet],
  );
  return (
    <RawIntlProvider value={intl}>
      <EndreBehandlendeEnhetModal
        // @ts-expect-error Migrert frå ts-ignore, uvisst kvifor denne trengs
        lukkModal={lukkModal}
        behandlendeEnheter={filtrerteBehandlendeEnheter}
        gjeldendeBehandlendeEnhetId={behandlendeEnhetId}
        gjeldendeBehandlendeEnhetNavn={behandlendeEnhetNavn}
        onSubmit={submit}
      />
    </RawIntlProvider>
  );
};

export default MenyEndreBehandlendeEnhetIndex;
