import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { Tidslinje, TidslinjeZoom } from '@fpsak-frontend/shared-components';
import HorisontalNavigering from '@fpsak-frontend/shared-components/src/tidslinje/HorisontalNavigering';
import { useSenesteDato } from '@fpsak-frontend/shared-components/src/tidslinje/useTidslinjerader';
import BehandlingPerioderårsakMedVilkår, {
  Periode,
  PeriodeMedUtfall,
} from '@k9-sak-web/types/src/behandlingPerioderarsakMedVilkar';
import { PeriodStatus, Tidslinjeskala } from '@k9-sak-web/types/src/tidslinje';
import { getPeriodDifference, Period } from '@navikt/k9-period-utils';
import dayjs from 'dayjs';
import 'dayjs/locale/nb';
import React, { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import styles from './soknadsperiodestripe.less';

dayjs.locale('nb');

interface SoknadsperiodestripeProps {
  behandlingPerioderMedVilkår: BehandlingPerioderårsakMedVilkår;
}

interface RadPeriode {
  id: string;
  fom: Date;
  tom: Date;
  status: PeriodStatus;
  className: string;
}

const harAllePerioderUtfall = (perioderTilVurdering: Periode[], perioderMedUtfall: PeriodeMedUtfall[]) => {
  if (perioderTilVurdering?.length && perioderMedUtfall?.length) {
    return perioderTilVurdering.every(periodeTilVurdering =>
      perioderMedUtfall.some(
        periodeMedUtfall =>
          new Period(periodeMedUtfall.periode.fom, periodeMedUtfall.periode.tom).covers(
            new Period(periodeTilVurdering.fom, periodeTilVurdering.tom),
          ) && periodeMedUtfall.utfall.kode !== vilkarUtfallType.IKKE_VURDERT,
      ),
    );
  }
  return false;
};
export const formaterPerioder = (behandlingPerioderMedVilkår: BehandlingPerioderårsakMedVilkår) => {
  const vedtakshistorikk: RadPeriode[] =
    behandlingPerioderMedVilkår?.forrigeVedtak?.map(({ periode, utfall }) => {
      const vedtaksperiode = new Period(periode.fom, periode.tom);
      const harOverlappMedPeriodeTilVurdering =
        behandlingPerioderMedVilkår?.perioderMedÅrsak?.perioderTilVurdering.some(({ fom, tom }) => {
          const periodeTilVurdering = new Period(fom, tom);
          return periodeTilVurdering.covers(vedtaksperiode);
        });
      const nyPeriode = {
        id: `${periode.fom}-${periode.tom}`,
        fom: new Date(periode.fom),
        tom: new Date(periode.tom),
        className: utfall.kode === vilkarUtfallType.OPPFYLT ? styles.suksess : styles.feil,
        status: utfall.kode === vilkarUtfallType.OPPFYLT ? ('suksess' as PeriodStatus) : 'feil',
      };
      if (harOverlappMedPeriodeTilVurdering) {
        nyPeriode.status =
          utfall.kode === vilkarUtfallType.OPPFYLT ? ('suksessRevurder' as PeriodStatus) : 'feilRevurder';
        nyPeriode.className = `${styles.advarsel} ${styles.aktivPeriode}`;
      }
      return nyPeriode;
    }) || [];

  const perioderTilVurderingPeriodType =
    behandlingPerioderMedVilkår?.perioderMedÅrsak?.perioderTilVurdering.map(
      periode => new Period(periode.fom, periode.tom),
    ) || [];
  const vedtaksperioder =
    behandlingPerioderMedVilkår?.forrigeVedtak?.map(({ periode }) => new Period(periode.fom, periode.tom)) || [];
  const erBehandlingFullført = harAllePerioderUtfall(
    behandlingPerioderMedVilkår?.perioderMedÅrsak?.perioderTilVurdering,
    behandlingPerioderMedVilkår?.periodeMedUtfall,
  );
  const perioderTilVurdering = erBehandlingFullført
    ? perioderTilVurderingPeriodType
    : getPeriodDifference(perioderTilVurderingPeriodType, vedtaksperioder);

  const formatertePerioderTilVurdering: RadPeriode[] =
    perioderTilVurdering.map(periodeTilVurdering => {
      const { fom, tom } = periodeTilVurdering;
      const overlappendePeriodeMedUtfall = behandlingPerioderMedVilkår.periodeMedUtfall.find(
        periodeMedUtfall =>
          new Period(periodeMedUtfall.periode.fom, periodeMedUtfall.periode.tom).covers(new Period(fom, tom)) &&
          periodeMedUtfall.utfall.kode !== vilkarUtfallType.IKKE_VURDERT,
      );
      const erDelvisInnvilget = behandlingPerioderMedVilkår.periodeMedUtfall.some(
        periodeMedUtfall =>
          periodeTilVurdering.covers(new Period(periodeMedUtfall.periode.fom, periodeMedUtfall.periode.tom)) &&
          periodeMedUtfall.utfall.kode === vilkarUtfallType.OPPFYLT,
      );
      const nyPeriode = {
        id: `${fom}-${tom}`,
        fom: new Date(fom),
        tom: new Date(tom),
        status: 'advarsel' as PeriodStatus,
        className: `${styles.advarsel} ${styles.aktivPeriode}`,
      };
      if (overlappendePeriodeMedUtfall) {
        let utfall = nyPeriode.status;
        if (overlappendePeriodeMedUtfall.utfall.kode === vilkarUtfallType.OPPFYLT) {
          utfall = 'suksess';
        } else if (overlappendePeriodeMedUtfall.utfall.kode === vilkarUtfallType.IKKE_OPPFYLT) {
          utfall = 'feil';
        }
        nyPeriode.status = utfall;
        nyPeriode.className = `${styles[utfall]} ${styles.aktivPeriode}`;
        return nyPeriode;
      }
      if (erDelvisInnvilget) {
        nyPeriode.status = 'suksessDelvis';
        nyPeriode.className = `${styles.suksess} ${styles.aktivPeriode}`;
      }
      return nyPeriode;
    }) || [];
  return vedtakshistorikk.concat(formatertePerioderTilVurdering);
};

const Soknadsperiodestripe: React.FC<SoknadsperiodestripeProps> = ({ behandlingPerioderMedVilkår }) => {
  const intl = useIntl();

  const formatertePerioder = useMemo(
    () => formaterPerioder(behandlingPerioderMedVilkår),
    [behandlingPerioderMedVilkår],
  );

  const rader = [
    {
      perioder: formatertePerioder,
      radLabel: intl.formatMessage({ id: 'Soknadsperioder.Søknadsperioder' }),
      radClassname: styles.rad,
    },
  ];

  const getSenesteTom = () => useSenesteDato({ sluttDato: undefined, rader });

  const [tidslinjeSkala, setTidslinjeSkala] = useState<Tidslinjeskala>(6);
  const [navigasjonFomDato, setNavigasjonFomDato] = useState(undefined);

  const updateNavigasjonFomDato = (antallMånederFraSluttdato: number) => {
    const senesteTom = getSenesteTom();
    const fomDato = dayjs(senesteTom).subtract(antallMånederFraSluttdato, 'months').toDate();
    setNavigasjonFomDato(fomDato);
  };

  useEffect(() => {
    if (formatertePerioder.length > 0) {
      updateNavigasjonFomDato(6);
    }
  }, [behandlingPerioderMedVilkår]);

  if (formatertePerioder.length === 0) {
    return null;
  }

  const subtractMonthsFromDate = (dateToSubtractFrom, numberOfMonthsToSubtract) =>
    dayjs(dateToSubtractFrom).subtract(numberOfMonthsToSubtract, 'months').toDate();

  const updateZoom = (zoomValue: number, zoomIn?: boolean) => {
    if (zoomIn) {
      const senesteTom = getSenesteTom();
      const nyTom = dayjs(navigasjonFomDato).add(zoomValue + 1, 'months');
      if (nyTom.isSameOrAfter(senesteTom)) {
        setNavigasjonFomDato(subtractMonthsFromDate(senesteTom, zoomValue)); // For å forhindre at horisontal navigasjon viser forbi seneste dato fra periodene
      } else {
        setNavigasjonFomDato(dayjs(navigasjonFomDato).add(1, 'months'));
      }
    } else {
      setNavigasjonFomDato(dayjs(navigasjonFomDato).subtract(1, 'months'));
    }
    setTidslinjeSkala(zoomValue);
  };

  return (
    <div className={styles.container}>
      <Tidslinje rader={rader} tidslinjeSkala={tidslinjeSkala} startDato={navigasjonFomDato} />
      <div className={styles.navigasjonContainer}>
        <HorisontalNavigering
          tidslinjeSkala={tidslinjeSkala}
          rader={rader}
          navigasjonFomDato={navigasjonFomDato}
          updateHorisontalNavigering={setNavigasjonFomDato}
        />
        <TidslinjeZoom
          disabledZoomIn={tidslinjeSkala === 1}
          disabledZoomOut={tidslinjeSkala === 36}
          handleZoomIn={() => {
            if (tidslinjeSkala > 1) {
              updateZoom(tidslinjeSkala - 1, true);
            }
          }}
          handleZoomOut={() => {
            if (tidslinjeSkala < 36) {
              updateZoom(tidslinjeSkala + 1);
            }
          }}
        />
      </div>
    </div>
  );
};

export default Soknadsperiodestripe;
