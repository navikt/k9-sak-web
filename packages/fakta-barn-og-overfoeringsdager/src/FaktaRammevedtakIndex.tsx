import * as React from 'react';
import { FunctionComponent } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import { Behandling } from '@k9-sak-web/types';
import messages from '../i18n/nb_NO.json';
import RammevedtakFaktaForm from './components/RammevedtakFaktaForm';
import OmsorgsdagerGrunnlagDto from './dto/OmsorgsdagerGrunnlagDto';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface FaktaRammevedtakIndexProps {
  omsorgsdagerGrunnlagDto: OmsorgsdagerGrunnlagDto;
  behandling: Behandling;
  submitCallback: VoidFunction;
  readOnly?: boolean;
}

const FaktaRammevedtakIndex: FunctionComponent<FaktaRammevedtakIndexProps> = ({
  behandling,
  submitCallback,
  readOnly,
  omsorgsdagerGrunnlagDto,
}) => (
  <RawIntlProvider value={intl}>
    <RammevedtakFaktaForm
      omsorgsdagerGrunnlag={omsorgsdagerGrunnlagDto}
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      submitCallback={submitCallback}
      readOnly={readOnly}
    />
  </RawIntlProvider>
);

export default FaktaRammevedtakIndex;
