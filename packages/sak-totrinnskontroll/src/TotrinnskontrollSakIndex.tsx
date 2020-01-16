import {
  BehandlingKlageVurdering,
  BehandlingStatusType,
  SkjermlenkeTyper,
  TotrinnskontrollAksjonspunkter,
  Kodeverk,
} from '@fpsak-frontend/types';
import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import messages from '../i18n/nb_NO.json';
import ApprovalPanel from './components/ApprovalPanel';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

const TotrinnskontrollSakIndex = ({
  behandlingId,
  behandlingVersjon,
  totrinnskontrollSkjermlenkeContext,
  behandlingStatus,
  location,
  readOnly,
  onSubmit,
  forhandsvisVedtaksbrev,
  toTrinnsBehandling,
  skjemalenkeTyper,
  isForeldrepengerFagsak,
  behandlingKlageVurdering,
  alleKodeverk,
  erBehandlingEtterKlage,
  disableGodkjennKnapp,
}: TotrinnskontrollSakIndexProps) => (
  <RawIntlProvider value={intl}>
    <ApprovalPanel
      behandlingId={behandlingId}
      behandlingVersjon={behandlingVersjon}
      totrinnskontrollSkjermlenkeContext={totrinnskontrollSkjermlenkeContext}
      behandlingStatus={behandlingStatus}
      location={location}
      readOnly={readOnly}
      onSubmit={onSubmit}
      forhandsvisVedtaksbrev={forhandsvisVedtaksbrev}
      toTrinnsBehandling={toTrinnsBehandling}
      skjemalenkeTyper={skjemalenkeTyper}
      isForeldrepengerFagsak={isForeldrepengerFagsak}
      behandlingKlageVurdering={behandlingKlageVurdering}
      alleKodeverk={alleKodeverk}
      erBehandlingEtterKlage={erBehandlingEtterKlage}
      disableGodkjennKnapp={disableGodkjennKnapp}
    />
  </RawIntlProvider>
);

interface TotrinnskontrollSakIndexProps {
  behandlingId: number;
  behandlingVersjon: number;
  totrinnskontrollSkjermlenkeContext: TotrinnskontrollAksjonspunkter[];
  totrinnskontrollReadOnlySkjermlenkeContext: TotrinnskontrollAksjonspunkter[];
  behandlingStatus: BehandlingStatusType;
  toTrinnsBehandling: boolean;
  location: Location;
  skjemalenkeTyper: SkjermlenkeTyper[];
  isForeldrepengerFagsak: boolean;
  behandlingKlageVurdering?: BehandlingKlageVurdering;
  alleKodeverk: Kodeverk;
  erBehandlingEtterKlage: boolean;
  readOnly: boolean;
  onSubmit: () => void;
  forhandsvisVedtaksbrev: () => void;
  disableGodkjennKnapp: boolean;
}

export default TotrinnskontrollSakIndex;
