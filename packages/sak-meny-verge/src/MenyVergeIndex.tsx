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

export const getMenytekst = (erOpprettVerge: boolean): string =>
  intl.formatMessage({
    id: erOpprettVerge ? 'MenyVergeIndex.OpprettVerge' : 'MenyVergeIndex.FjernVerge',
  });

interface OwnProps {
  fjernVerge?: () => void;
  opprettVerge?: () => void;
  lukkModal: () => void;
}

const MenyVergeIndex = ({ fjernVerge, opprettVerge, lukkModal }: OwnProps) => {
  const submit = useCallback(() => {
    lukkModal();
    const operasjon = opprettVerge || fjernVerge;
    return operasjon();
  }, [opprettVerge, fjernVerge]);

  return (
    <RawIntlProvider value={intl}>
      <OkAvbrytModal
        text={intl.formatMessage({
          id: opprettVerge ? 'MenyVergeIndex.OpprettVergeSporsmal' : 'MenyVergeIndex.FjernVergeSporsmal',
        })}
        showModal
        submit={submit}
        cancel={lukkModal}
      />
    </RawIntlProvider>
  );
};

export default MenyVergeIndex;
