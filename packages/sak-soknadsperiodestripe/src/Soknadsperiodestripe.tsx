import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { Tidslinje } from '@fpsak-frontend/shared-components';
import BehandlingPerioderårsakMedVilkår from '@k9-sak-web/types/src/behandlingPerioderårsakMedVilkår';
import { PeriodStatus, Tidslinjeskala } from '@k9-sak-web/types/src/tidslinje';
import { dateStringSorter } from '@navikt/k9-date-utils';
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
          const utfall = identiskPeriodeMedUtfall.utfall.kode === vilkarUtfallType.OPPFYLT ? 'suksess' : 'feil';
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

  const getSenesteTom = () => {
    const perioderSortertPåTom = [...rader[0].perioder].sort((a, b) =>
      dateStringSorter(a.tom.toISOString(), b.tom.toISOString()),
    );
    return perioderSortertPåTom[perioderSortertPåTom.length - 1].tom;
  };

  const [tidslinjeSkala, setTidslinjeSkala] = useState<Tidslinjeskala>(6);
  const [navigasjonFomDato, setNavigasjonFomDato] = useState(undefined);

  useEffect(() => {
    if (formatertePerioder.length > 0) {
      const senesteTom = getSenesteTom();
      // Tidslinjen skal initielt slutte på første dag i månenden etter den seneste perioden
      const fomDato = dayjs(senesteTom).endOf('month').add(1, 'day').subtract(6, 'months').toDate();
      setNavigasjonFomDato(fomDato);
    }
  }, [behandlingPerioderMedVilkår]);

  if (formatertePerioder.length === 0) {
    return null;
  }

  const getSkalaRadio = (label: string, value: Tidslinjeskala) => {
    const id = `soknadsperiodestripe_${label}`;
    return (
      <>
        <input
          className={styles.skalaRadioInput}
          id={id}
          onChange={() => setTidslinjeSkala(value)}
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

  const updateNavigasjon = (subtract?: boolean) => {
    if (subtract) {
      if (tidslinjeSkala === 6) {
        setNavigasjonFomDato(dayjs(navigasjonFomDato).subtract(1, 'month'));
      } else {
        setNavigasjonFomDato(dayjs(navigasjonFomDato).subtract(6, 'month'));
      }
    } else if (tidslinjeSkala === 6) {
      setNavigasjonFomDato(dayjs(navigasjonFomDato).add(1, 'month'));
    } else {
      setNavigasjonFomDato(dayjs(navigasjonFomDato).add(6, 'month'));
    }
  };

  const formatNavigasjonsdato = () => {
    const fom = dayjs(navigasjonFomDato).format('DD. MMMM YYYY');
    const tom = dayjs(navigasjonFomDato).add(tidslinjeSkala, 'months').format('DD. MMMM YYYY');
    return `${fom} - ${tom}`;
  };

  const disableNavigasjonTomButton = () => {
    const senesteTom = getSenesteTom();
    if (tidslinjeSkala === 24) {
      return dayjs(senesteTom).isSameOrBefore(dayjs(navigasjonFomDato).add(12, 'month'));
    }
    return dayjs(senesteTom).isSameOrBefore(dayjs(navigasjonFomDato).add(6, 'month'));
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
      <div className={styles.navigasjonContainer}>
        <button
          onClick={() => updateNavigasjon(true)}
          className={styles.navigasjonButtonLeft}
          aria-label={intl.formatMessage({ id: 'Soknadsperioder.Navigasjonsknapp.Bakover' })}
          type="button"
        />
        <button
          onClick={() => updateNavigasjon()}
          className={styles.navigasjonButtonRight}
          aria-label={intl.formatMessage({ id: 'Soknadsperioder.Navigasjonsknapp.Fremover' })}
          type="button"
          disabled={disableNavigasjonTomButton()}
        />
        <Normaltekst className={styles.navigasjonDatoContainer}>{formatNavigasjonsdato()}</Normaltekst>
      </div>
    </div>
  );
};

export default Soknadsperiodestripe;
