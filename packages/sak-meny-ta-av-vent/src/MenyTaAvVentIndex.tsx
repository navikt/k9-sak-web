import React, { useCallback } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { OkAvbrytModal } from '@k9-sak-web/shared-components';

import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

export const getMenytekst = (): string => intl.formatMessage({ id: 'MenyTaAvVentIndex.ResumeBehandling' });

interface OwnProps {
  behandlingId?: number;
  behandlingVersjon?: number;
  taBehandlingAvVent: (params: { behandlingId: number; behandlingVersjon: number }) => void;
  lukkModal: () => void;
}

const MenyTaAvVentIndex = ({ behandlingId, behandlingVersjon, taBehandlingAvVent, lukkModal }: OwnProps) => {
  const submit = useCallback(() => {
    taBehandlingAvVent({
      behandlingId,
      behandlingVersjon,
    });

    lukkModal();
  }, [behandlingId, behandlingVersjon]);

  return (
    <RawIntlProvider value={intl}>
      <OkAvbrytModal
        text={intl.formatMessage({ id: 'MenyTaAvVentIndex.TaAvVent' })}
        showModal
        submit={submit}
        cancel={lukkModal}
      />
    </RawIntlProvider>
  );
};

export default MenyTaAvVentIndex;
