import ÅrskvantumForbrukteDager from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/ÅrskvantumForbrukteDager';
import { Uttaksperiode } from '@k9-sak-web/types';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { periodeErIKoronaperioden } from '../utils';
import DagerNavKanUtbetale from './DagerNavKanUtbetale';
import DagerSokerHarRettPa from './DagerSokerHarRettPa';
import { beregnDagerTimer, DagerTimer, konverterDesimalTilDagerOgTimer, sumTid } from './durationUtils';
import ForbrukteDager from './ForbrukteDager';
import styles from './nokkeltall.less';
import Restdager from './Restdager';

export enum Nokkeltalltype {
  DAGER_SOKER_HAR_RETT_PA,
  DAGER_NAV_KAN_UTBETALE,
  FORBRUKTE_DAGER,
  RESTDAGER,
}

export type NokkeltallContainerProps = Pick<
  ÅrskvantumForbrukteDager,
  | 'totaltAntallDager'
  | 'antallKoronadager'
  | 'antallDagerArbeidsgiverDekker'
  | 'forbrukteDager'
  | 'forbruktTid'
  | 'restdager'
  | 'restTid'
  | 'antallDagerInfotrygd'
  | 'smitteverndager'
> & {
  uttaksperioder: Uttaksperiode[];
  benyttetRammemelding: boolean;
  apneNokkeltall?: Nokkeltalltype[];
  visEllerSkjulNokkeltalldetaljer: (nokkeltalltype: Nokkeltalltype) => void;
  migrertData: boolean;
  ar: string;
};

const absoluttverdiDagerTimer = ({ dager, timer }: DagerTimer): DagerTimer => ({
  dager: Math.abs(dager),
  timer: Math.abs(timer),
});

const NokkeltallContainer = ({
  uttaksperioder,
  restTid,
  restdager,
  forbrukteDager,
  forbruktTid,
  antallDagerArbeidsgiverDekker,
  antallDagerInfotrygd,
  antallKoronadager,
  smitteverndager,
  benyttetRammemelding,
  totaltAntallDager: grunnrettsdager,
  apneNokkeltall,
  visEllerSkjulNokkeltalldetaljer,
  migrertData,
  ar,
}: NokkeltallContainerProps) => {
  const erIKoronaperioden = React.useMemo(
    () => uttaksperioder.some(({ periode }) => periodeErIKoronaperioden(periode)),
    [uttaksperioder],
  );

  const smittevernDagerTimer = smitteverndager ? beregnDagerTimer(smitteverndager) : null;
  const harSmitteverndager = smittevernDagerTimer?.timer > 0 || smittevernDagerTimer?.dager > 0;
  const rest = restTid ? beregnDagerTimer(restTid) : konverterDesimalTilDagerOgTimer(restdager);
  const restTidErNegativt = rest.dager < 0 || rest.timer < 0;
  const utbetaltFlereDagerEnnRett = !harSmitteverndager && restTidErNegativt;

  const totaltForbruktDagerTimer = forbruktTid
    ? beregnDagerTimer(forbruktTid)
    : konverterDesimalTilDagerOgTimer(forbrukteDager);
  const tidFraInfotrygd = konverterDesimalTilDagerOgTimer(antallDagerInfotrygd);
  const navHarUtbetaltDagerTimer = sumTid(totaltForbruktDagerTimer, tidFraInfotrygd);
  const dagerRettPå = grunnrettsdager + antallKoronadager;
  const dagerNavKanUtbetale = Math.max(dagerRettPå - antallDagerArbeidsgiverDekker, 0);
  const alleDagerErForbrukt = !!harSmitteverndager || utbetaltFlereDagerEnnRett;

  return (
    <section className={styles.nokkeltall}>
      {migrertData && (
        <AlertStripeAdvarsel className={styles.varselOmMigrertData}>
          <FormattedMessage id="Nøkkeltall.ErMigrert" />
        </AlertStripeAdvarsel>
      )}
      <DagerSokerHarRettPa
        dagerRettPå={dagerRettPå}
        antallOmsorgsdager={grunnrettsdager}
        antallKoronadager={antallKoronadager}
        erIKoronaperioden={erIKoronaperioden}
        benyttetRammemelding={benyttetRammemelding}
        viserDetaljer={apneNokkeltall?.includes(Nokkeltalltype.DAGER_SOKER_HAR_RETT_PA)}
        visDetaljer={() => visEllerSkjulNokkeltalldetaljer(Nokkeltalltype.DAGER_SOKER_HAR_RETT_PA)}
        ar={ar}
      />
      <DagerNavKanUtbetale
        dagerNavKanUtbetale={dagerNavKanUtbetale}
        dagerRettPå={dagerRettPå}
        antallDagerArbeidsgiverDekker={antallDagerArbeidsgiverDekker}
        visDetaljer={() => visEllerSkjulNokkeltalldetaljer(Nokkeltalltype.DAGER_NAV_KAN_UTBETALE)}
        viserDetaljer={apneNokkeltall?.includes(Nokkeltalltype.DAGER_NAV_KAN_UTBETALE)}
      />
      <ForbrukteDager
        navHarUtbetaltDagerTimer={navHarUtbetaltDagerTimer}
        infotrygdDagerTimer={tidFraInfotrygd}
        forbrukteDagerTimer={totaltForbruktDagerTimer}
        smittevernDagerTimer={smittevernDagerTimer}
        utbetaltForMangeDagerTimer={utbetaltFlereDagerEnnRett ? absoluttverdiDagerTimer(rest) : null}
        viserDetaljer={apneNokkeltall?.includes(Nokkeltalltype.FORBRUKTE_DAGER)}
        visDetaljer={() => visEllerSkjulNokkeltalldetaljer(Nokkeltalltype.FORBRUKTE_DAGER)}
        ar={ar}
      />
      <Restdager
        tilgodeDagertimer={{
          dager: alleDagerErForbrukt ? 0 : rest.dager,
          timer: alleDagerErForbrukt ? null : rest.timer,
        }}
        dagerNavKanUtbetale={dagerNavKanUtbetale}
        navHarUtbetaltDagerTimer={navHarUtbetaltDagerTimer}
        viserDetaljer={apneNokkeltall?.includes(Nokkeltalltype.RESTDAGER)}
        visDetaljer={() => visEllerSkjulNokkeltalldetaljer(Nokkeltalltype.RESTDAGER)}
      />
    </section>
  );
};

export default NokkeltallContainer;
