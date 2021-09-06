import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Undertittel, Undertekst, Normaltekst } from 'nav-frontend-typografi';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { getKodeverknavnFn } from '@fpsak-frontend/utils';
import { Kodeverk, KodeverkMedNavn } from '@k9-sak-web/types';

import TilbakekrevingVedtakPeriodeTabell from './TilbakekrevingVedtakPeriodeTabell';
import TilbakekrevingVedtakForm from './TilbakekrevingVedtakForm';
import VedtaksbrevAvsnitt from '../types/vedtaksbrevAvsnittTsType';
import { BeregningResultatPeriode } from '../types/beregningsresultatTilbakekrevingTsType';

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
      <Undertittel>
        <FormattedMessage id="TilbakekrevingVedtak.Vedtak" />
      </Undertittel>
      <VerticalSpacer twentyPx />
      <Undertekst>
        <FormattedMessage id="TilbakekrevingVedtak.Resultat" />
      </Undertekst>
      <Normaltekst>{getKodeverknavn(resultat)}</Normaltekst>
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
