/* eslint-disable arrow-body-style */
import { MerknadFraLos } from '@k9-sak-web/types';
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
  markerBehandling: (values: any) => Promise<any>;
  behandlingUuid: string;
  merknaderFraLos: MerknadFraLos;
}

const MenyMarkerBehandling = ({
  lukkModal,
  brukHastekøMarkering,
  brukVanskeligKøMarkering,
  markerBehandling,
  behandlingUuid,
  merknaderFraLos,
}: OwnProps) => {
  return (
    <RawIntlProvider value={intl}>
      <MarkerBehandlingModal
        lukkModal={lukkModal}
        brukHastekøMarkering={brukHastekøMarkering}
        brukVanskeligKøMarkering={brukVanskeligKøMarkering}
        markerBehandling={markerBehandling}
        behandlingUuid={behandlingUuid}
        merknaderFraLos={merknaderFraLos}
      />
    </RawIntlProvider>
  );
};

export default MenyMarkerBehandling;
