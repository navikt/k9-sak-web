import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { Aksjonspunkt, AnkeVurdering, Behandling } from '@k9-sak-web/types';
import messages from '../i18n/nb_NO.json';
import BehandleMerknaderForm from './components/BehandleMerknaderForm';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface AnkeMerknaderProsessIndexProps {
  behandling: Behandling;
  ankeVurdering: AnkeVurdering;
  aksjonspunkter: Aksjonspunkt[];
  submitCallback(...args: unknown[]): unknown;
  isReadOnly: boolean;
  readOnlySubmitButton: boolean;
  saveAnke(...args: unknown[]): unknown;
  previewCallback(...args: unknown[]): unknown;
  previewVedtakCallback(...args: unknown[]): unknown;
}

const AnkeMerknaderProsessIndex = ({
  behandling,
  ankeVurdering,
  aksjonspunkter,
  submitCallback,
  isReadOnly,
  readOnlySubmitButton,
  saveAnke,
  previewCallback,
  previewVedtakCallback,
}: AnkeMerknaderProsessIndexProps) => (
  <RawIntlProvider value={intl}>
    <BehandleMerknaderForm
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      ankeVurderingResultat={ankeVurdering.ankeVurderingResultat}
      aksjonspunkter={aksjonspunkter}
      submitCallback={submitCallback}
      readOnly={isReadOnly}
      readOnlySubmitButton={readOnlySubmitButton}
      saveAnke={saveAnke}
      previewCallback={previewCallback}
      previewVedtakCallback={previewVedtakCallback}
    />
  </RawIntlProvider>
);

export default AnkeMerknaderProsessIndex;
