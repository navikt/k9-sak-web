import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import { KodeverkType } from '@k9-sak-web/lib/types/KodeverkType.js';
import { BodyShort, Detail, Heading } from '@navikt/ds-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { BeregningResultatPeriode } from '../types/beregningsresultatTilbakekrevingTsType';
import VedtaksbrevAvsnitt from '../types/vedtaksbrevAvsnittTsType';
import TilbakekrevingVedtakForm from './TilbakekrevingVedtakForm';
import TilbakekrevingVedtakPeriodeTabell from './TilbakekrevingVedtakPeriodeTabell';

interface OwnProps {
  submitCallback: (aksjonspunktData: { kode: string }[]) => Promise<any>;
  readOnly: boolean;
  resultat: string;
  perioder: BeregningResultatPeriode[];
  behandlingId: number;
  behandlingUuid: string;
  behandlingVersjon: number;
  avsnittsliste: VedtaksbrevAvsnitt[];
  fetchPreviewVedtaksbrev: (data: any) => Promise<any>;
  aksjonspunktKodeForeslaVedtak: string;
  erRevurderingTilbakekrevingKlage?: boolean;
  erRevurderingTilbakekrevingFeilBeløpBortfalt?: boolean;
}

const TilbakekrevingVedtak = ({
  submitCallback,
  readOnly,
  resultat,
  perioder,
  behandlingId,
  behandlingUuid,
  behandlingVersjon,
  avsnittsliste,
  fetchPreviewVedtaksbrev,
  aksjonspunktKodeForeslaVedtak,
  erRevurderingTilbakekrevingKlage,
  erRevurderingTilbakekrevingFeilBeløpBortfalt,
}: OwnProps) => {
  const { kodeverkNavnFraKode } = useKodeverkContext();
  return (
    <>
      <Heading size="small" level="2">
        <FormattedMessage id="TilbakekrevingVedtak.Vedtak" />
      </Heading>
      <VerticalSpacer twentyPx />
      <Detail>
        <FormattedMessage id="TilbakekrevingVedtak.Resultat" />
      </Detail>
      <BodyShort size="small">{kodeverkNavnFraKode(resultat, KodeverkType.VEDTAK_RESULTAT_TYPE)}</BodyShort>
      <VerticalSpacer sixteenPx />
      <TilbakekrevingVedtakPeriodeTabell perioder={perioder} />
      <VerticalSpacer sixteenPx />
      <TilbakekrevingVedtakForm
        submitCallback={submitCallback}
        readOnly={readOnly}
        behandlingId={behandlingId}
        behandlingUuid={behandlingUuid}
        behandlingVersjon={behandlingVersjon}
        avsnittsliste={avsnittsliste}
        fetchPreviewVedtaksbrev={fetchPreviewVedtaksbrev}
        aksjonspunktKodeForeslaVedtak={aksjonspunktKodeForeslaVedtak}
        erRevurderingTilbakekrevingKlage={erRevurderingTilbakekrevingKlage}
        erRevurderingTilbakekrevingFeilBeløpBortfalt={erRevurderingTilbakekrevingFeilBeløpBortfalt}
      />
    </>
  );
};

export default TilbakekrevingVedtak;
