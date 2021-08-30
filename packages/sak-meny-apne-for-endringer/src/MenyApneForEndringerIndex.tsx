import React, { useCallback } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { OkAvbrytModal } from '@fpsak-frontend/shared-components';

import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

export const getMenytekst = () => intl.formatMessage({ id: 'MenyApneForEndringerIndex.ReopenBehandling' });

interface OwnProps {
  behandlingId?: number;
  behandlingVersjon?: number;
  apneBehandlingForEndringer: (params: { behandlingId: number; behandlingVersjon: number }) => void;
  lukkModal: () => void;
}

const MenyApneForEndringerIndex = ({
  behandlingId,
  behandlingVersjon,
  apneBehandlingForEndringer,
  lukkModal,
}: OwnProps) => {
  const submit = useCallback(() => {
    const params = {
      behandlingId,
      behandlingVersjon,
    };
    apneBehandlingForEndringer(params);

    lukkModal();
  }, [behandlingId, behandlingVersjon]);

  return (
    <RawIntlProvider value={intl}>
      <OkAvbrytModal
        text={intl.formatMessage({ id: 'MenyApneForEndringerIndex.OpenBehandling' })}
        showModal
        submit={submit}
        cancel={lukkModal}
      />
    </RawIntlProvider>
  );
};

export default MenyApneForEndringerIndex;
