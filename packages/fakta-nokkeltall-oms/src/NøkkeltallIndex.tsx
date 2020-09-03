import React, { FunctionComponent } from 'react';
import { createIntlCache, createIntl, RawIntlProvider } from 'react-intl';
import ÅrskvantumForbrukteDager from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/ÅrskvantumForbrukteDager';
import messages from '../i18n/nb_NO.json';
import NøkkeltallContainer from './components/NøkkeltallContainer';

const cache = createIntlCache();

export const årskvantumIntl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

const NøkkeltallIndex: FunctionComponent<ÅrskvantumForbrukteDager> = ({
  totaltAntallDager,
  antallKoronadager,
  restdager,
  restTid,
  forbrukteDager,
  forbruktTid,
  smitteverndager,
  antallDagerArbeidsgiverDekker,
  antallDagerInfotrygd = 0,
  sisteUttaksplan,
}) => {
  return (
    <RawIntlProvider value={årskvantumIntl}>
      <NøkkeltallContainer
        totaltAntallDager={totaltAntallDager}
        antallKoronadager={antallKoronadager}
        restdager={restdager}
        restTid={restTid}
        forbrukteDager={forbrukteDager}
        forbruktTid={forbruktTid}
        smitteverndager={smitteverndager}
        antallDagerArbeidsgiverDekker={antallDagerArbeidsgiverDekker}
        antallDagerInfotrygd={antallDagerInfotrygd}
        benyttetRammemelding={sisteUttaksplan.benyttetRammemelding}
        uttaksperioder={sisteUttaksplan.aktiviteter.flatMap(({ uttaksperioder }) => uttaksperioder)}
      />
    </RawIntlProvider>
  );
};

export default NøkkeltallIndex;
