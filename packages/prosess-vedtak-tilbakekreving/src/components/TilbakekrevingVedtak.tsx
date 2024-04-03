import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { getKodeverknavnFn } from '@fpsak-frontend/utils';
import { Kodeverk, KodeverkMedNavn } from '@k9-sak-web/types';
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
  resultat: Kodeverk;
  perioder: BeregningResultatPeriode[];
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
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
  alleKodeverk,
  behandlingId,
  behandlingUuid,
  behandlingVersjon,
  avsnittsliste,
  fetchPreviewVedtaksbrev,
  aksjonspunktKodeForeslaVedtak,
  erRevurderingTilbakekrevingKlage,
  erRevurderingTilbakekrevingFeilBeløpBortfalt,
}: OwnProps) => {
  const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);
  return (
    <>
      <Heading size="small" level="2">
        <FormattedMessage id="TilbakekrevingVedtak.Vedtak" />
      </Heading>
      <VerticalSpacer twentyPx />
      <Detail>
        <FormattedMessage id="TilbakekrevingVedtak.Resultat" />
      </Detail>
      <BodyShort size="small">{getKodeverknavn(resultat)}</BodyShort>
      <VerticalSpacer sixteenPx />
      <TilbakekrevingVedtakPeriodeTabell perioder={perioder} getKodeverknavn={getKodeverknavn} />
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
