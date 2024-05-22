import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { Aksjonspunkt, AnkeVurdering, Behandling } from '@k9-sak-web/types';
import messages from '../i18n/nb_NO.json';
import BehandleResultatForm from './components/BehandleResultatForm';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface AnkeResultatProsessIndexProps {
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

const AnkeResultatProsessIndex = ({
  behandling,
  ankeVurdering,
  aksjonspunkter,
  submitCallback,
  isReadOnly,
  readOnlySubmitButton,
  saveAnke,
  previewCallback,
  previewVedtakCallback,
}: AnkeResultatProsessIndexProps) => (
  <RawIntlProvider value={intl}>
    <BehandleResultatForm
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

export default AnkeResultatProsessIndex;
