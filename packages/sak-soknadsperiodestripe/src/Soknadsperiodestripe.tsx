import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { Tidslinje } from '@fpsak-frontend/shared-components';
import HorisontalNavigering from '@fpsak-frontend/shared-components/src/tidslinje/HorisontalNavigering';
import { useSenesteDato } from '@fpsak-frontend/shared-components/src/tidslinje/useTidslinjerader';
import BehandlingPerioderårsakMedVilkår from '@k9-sak-web/types/src/behandlingPerioderarsakMedVilkar';
import { PeriodStatus, Tidslinjeskala } from '@k9-sak-web/types/src/tidslinje';
import { Period } from '@navikt/k9-period-utils';
import dayjs from 'dayjs';
import 'dayjs/locale/nb';
import { Normaltekst } from 'nav-frontend-typografi';
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

export const formaterPerioder = (behandlingPerioderMedVilkår: BehandlingPerioderårsakMedVilkår) => {
  const overlappendePerioder: Period[] = [];
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
        overlappendePerioder.push(vedtaksperiode);
        nyPeriode.status =
          utfall.kode === vilkarUtfallType.OPPFYLT ? ('suksessRevurder' as PeriodStatus) : 'feilRevurder';
        nyPeriode.className = styles.advarsel;
      }
      return nyPeriode;
    }) || [];

  const perioderTilVurdering: RadPeriode[] =
    behandlingPerioderMedVilkår?.perioderMedÅrsak?.perioderTilVurdering
      .map(({ fom, tom }) => {
        const periodeTilVurdering = new Period(fom, tom);
        const vedtaksperiodeMedOverlapp = overlappendePerioder.find(overlappendePeriode =>
          periodeTilVurdering.covers(overlappendePeriode),
        );
        const identiskPeriodeMedUtfall = behandlingPerioderMedVilkår.periodeMedUtfall.find(
          periodeMedUtfall => periodeMedUtfall.periode.fom === fom && periodeMedUtfall.periode.tom === tom,
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
        if (identiskPeriodeMedUtfall) {
          let utfall = nyPeriode.status;
          if (identiskPeriodeMedUtfall.utfall.kode === vilkarUtfallType.OPPFYLT) {
            utfall = 'suksess';
          } else if (identiskPeriodeMedUtfall.utfall.kode === vilkarUtfallType.IKKE_OPPFYLT) {
            utfall = 'feil';
          }
          nyPeriode.status = utfall;
          nyPeriode.className = `${styles[utfall]} ${styles.aktivPeriode}`;
          return nyPeriode;
        }
        if (vedtaksperiodeMedOverlapp) {
          if (dayjs(vedtaksperiodeMedOverlapp.tom).isSame(periodeTilVurdering.tom)) {
            return undefined;
          }
          const nyFom = dayjs(vedtaksperiodeMedOverlapp.tom).add(1, 'day').toDate();
          nyPeriode.id = `${nyFom.toISOString()}-${tom}`;
          nyPeriode.fom = nyFom;
        }
        if (erDelvisInnvilget) {
          nyPeriode.status = 'suksessDelvis';
          nyPeriode.className = `${styles.suksess} ${styles.aktivPeriode}`;
        }
        return nyPeriode;
      })
      .filter(periodeTilVurdering => periodeTilVurdering) || [];
  return vedtakshistorikk.concat(perioderTilVurdering);
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

  const updateSkala = (value: number) => {
    setTidslinjeSkala(value);
    updateNavigasjonFomDato(value);
  };

  const getSkalaRadio = (label: string, value: Tidslinjeskala) => {
    const id = `soknadsperiodestripe_${label}`;
    return (
      <>
        <input
          className={styles.skalaRadioInput}
          id={id}
          onChange={() => updateSkala(value)}
          type="radio"
          name="soknadsperiodestripe_skala"
          value={value}
        />
        <label
          htmlFor={id}
          className={`${styles.skalaRadioLabel} ${tidslinjeSkala === value ? styles['skalaRadioLabel--selected'] : ''}`}
        >
          <Normaltekst>{label}</Normaltekst>
        </label>
      </>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.skalavelgerContainer}>
        <fieldset>
          <legend>{intl.formatMessage({ id: 'Soknadsperioder.Skala.SkalaForVisning' })}</legend>
          {getSkalaRadio(intl.formatMessage({ id: 'Soknadsperioder.Skala.6mnd' }), 6)}
          {getSkalaRadio(intl.formatMessage({ id: 'Soknadsperioder.Skala.1år' }), 12)}
          {getSkalaRadio(intl.formatMessage({ id: 'Soknadsperioder.Skala.2år' }), 24)}
        </fieldset>
      </div>
      <Tidslinje rader={rader} tidslinjeSkala={tidslinjeSkala} startDato={navigasjonFomDato} />
      <HorisontalNavigering
        tidslinjeSkala={tidslinjeSkala}
        rader={rader}
        navigasjonFomDato={navigasjonFomDato}
        updateHorisontalNavigering={setNavigasjonFomDato}
      />
    </div>
  );
};

export default Soknadsperiodestripe;
