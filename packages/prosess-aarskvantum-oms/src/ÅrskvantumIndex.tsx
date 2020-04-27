import React, { FunctionComponent } from 'react';
import { createIntlCache, createIntl, RawIntlProvider } from 'react-intl';
import { VerticalSpacer } from '@fpsak-frontend/shared-components/index';
import { KodeverkMedNavn } from '@k9-sak-web/types';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import messages from '../i18n/nb_NO.json';
import ÅrskvantumForbrukteDager from './dto/ÅrskvantumForbrukteDager';
import Årskvantum from './components/Årskvantum';
import Uttaksplan from './components/Uttaksplan';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface ÅrsakvantumIndexProps {
  årskvantum: ÅrskvantumForbrukteDager;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
}

const ÅrskvantumIndex: FunctionComponent<ÅrsakvantumIndexProps> = ({ årskvantum, alleKodeverk }) => {
  const { totaltAntallDager, restdager, forbrukteDager, antallDagerArbeidsgiverDekker, sisteUttaksplan } = årskvantum;
  const aktivitetsstatuser = alleKodeverk[kodeverkTyper.AKTIVITET_STATUS];

  return (
    <RawIntlProvider value={intl}>
      <Årskvantum
        totaltAntallDager={totaltAntallDager}
        restdager={restdager}
        forbrukteDager={forbrukteDager}
        antallDagerArbeidsgiverDekker={antallDagerArbeidsgiverDekker}
      />
      <VerticalSpacer sixteenPx />
      <Uttaksplan aktiviteter={sisteUttaksplan.aktiviteter} aktivitetsstatuser={aktivitetsstatuser} />
    </RawIntlProvider>
  );
};

export default ÅrskvantumIndex;
