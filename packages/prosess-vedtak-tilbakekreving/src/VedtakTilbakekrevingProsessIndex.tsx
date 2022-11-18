import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { Behandling, KodeverkMedNavn } from '@k9-sak-web/types';
import behandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import TilbakekrevingVedtak from './components/TilbakekrevingVedtak';
import BeregningsresultatTilbakekreving from './types/beregningsresultatTilbakekrevingTsType';
import Vedtaksbrev from './types/vedtaksbrevTsType';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

const tilbakekrevingÅrsakTyperKlage = [behandlingArsakType.RE_KLAGE_KA, behandlingArsakType.RE_KLAGE_NFP];

const erTilbakekrevingÅrsakKlage = (årsak: any) => årsak && tilbakekrevingÅrsakTyperKlage.includes(årsak.kode);

interface OwnProps {
  behandling: Behandling;
  beregningsresultat: BeregningsresultatTilbakekreving;
  vedtaksbrev: Vedtaksbrev;
  submitCallback: (aksjonspunktData: { kode: string }[]) => Promise<any>;
  isReadOnly: boolean;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  fetchPreviewVedtaksbrev: (data: any) => Promise<any>;
  aksjonspunktKodeForeslaVedtak: string;
}

const VedtakTilbakekrevingProsessIndex = ({
  behandling,
  beregningsresultat,
  vedtaksbrev,
  submitCallback,
  isReadOnly,
  alleKodeverk,
  fetchPreviewVedtaksbrev,
  aksjonspunktKodeForeslaVedtak,
}: OwnProps) => {
  const erRevurderingTilbakekrevingKlage =
    behandling.førsteÅrsak && erTilbakekrevingÅrsakKlage(behandling.førsteÅrsak.behandlingArsakType);
  const erRevurderingTilbakekrevingFeilBeløpBortfalt =
    behandling.førsteÅrsak &&
    behandlingArsakType.RE_FEILUTBETALT_BELØP_REDUSERT === behandling.førsteÅrsak?.behandlingArsakType;
  return (
    <RawIntlProvider value={intl}>
      <TilbakekrevingVedtak
        behandlingId={behandling.id}
        behandlingUuid={behandling.uuid}
        behandlingVersjon={behandling.versjon}
        perioder={beregningsresultat.beregningResultatPerioder}
        resultat={beregningsresultat.vedtakResultatType}
        avsnittsliste={vedtaksbrev?.avsnittsliste}
        submitCallback={submitCallback}
        readOnly={isReadOnly}
        alleKodeverk={alleKodeverk}
        fetchPreviewVedtaksbrev={fetchPreviewVedtaksbrev}
        aksjonspunktKodeForeslaVedtak={aksjonspunktKodeForeslaVedtak}
        erRevurderingTilbakekrevingKlage={erRevurderingTilbakekrevingKlage}
        erRevurderingTilbakekrevingFeilBeløpBortfalt={erRevurderingTilbakekrevingFeilBeløpBortfalt}
      />
    </RawIntlProvider>
  );
};

export default VedtakTilbakekrevingProsessIndex;
