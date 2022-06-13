/* eslint-disable arrow-body-style */
import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import messages from '../i18n/nb_NO.json';
import MarkerBehandlingModal from './components/MarkerBehandlingModal';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

export const getMenytekst = (): string => intl.formatMessage({ id: 'MenyMarkerBehandling.MarkerBehandling' });

interface OwnProps {
  lukkModal: () => void;
  brukHastekøMarkering?: boolean;
  brukVanskeligKøMarkering?: boolean;
}

const MenyMarkerBehandling = ({ lukkModal, brukHastekøMarkering, brukVanskeligKøMarkering }: OwnProps) => {
  return (
    <RawIntlProvider value={intl}>
      <MarkerBehandlingModal
        lukkModal={lukkModal}
        brukHastekøMarkering={brukHastekøMarkering}
        brukVanskeligKøMarkering={brukVanskeligKøMarkering}
      />
    </RawIntlProvider>
  );
};

export default MenyMarkerBehandling;
