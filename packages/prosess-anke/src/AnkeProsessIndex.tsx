import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { Aksjonspunkt, AnkeVurdering, Behandling } from '@k9-sak-web/types';
import messages from '../i18n/nb_NO.json';
import BehandleAnkeForm from './components/BehandleAnkeForm';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface AnkeProsessIndexProps {
  behandling: Behandling;
  ankeVurdering: AnkeVurdering;
  aksjonspunkter: Aksjonspunkt[];
  submitCallback(...args: unknown[]): unknown;
  isReadOnly: boolean;
  readOnlySubmitButton: boolean;
  saveAnke(...args: unknown[]): unknown;
  previewCallback(...args: unknown[]): unknown;
  previewVedtakCallback(...args: unknown[]): unknown;
  behandlinger: {
    id?: number;
    opprettet?: string;
    type?: {
      kode?: string;
    };
    status?: {
      kode?: string;
    };
  }[];
}

const AnkeProsessIndex = ({
  behandling,
  ankeVurdering,
  behandlinger,
  aksjonspunkter,
  submitCallback,
  isReadOnly,
  readOnlySubmitButton,
  saveAnke,
  previewCallback,
  previewVedtakCallback,
}: AnkeProsessIndexProps) => (
  <RawIntlProvider value={intl}>
    <BehandleAnkeForm
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      sprakkode={behandling.sprakkode}
      ankeVurderingResultat={ankeVurdering ? ankeVurdering.ankeVurderingResultat : {}}
      behandlinger={behandlinger}
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

export default AnkeProsessIndex;
