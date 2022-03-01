import { Tidslinje } from '@fpsak-frontend/shared-components';
import { useTidligsteDato } from '@fpsak-frontend/shared-components/src/tidslinje/useTidslinjerader';
import BehandlingPerioderårsakMedVilkår from '@k9-sak-web/types/src/behandlingPerioderårsakMedVilkår';
import { PeriodStatus, Tidslinjeskala } from '@k9-sak-web/types/src/tidslinje';
import { Period } from '@navikt/k9-period-utils';
import dayjs from 'dayjs';
import 'dayjs/locale/nb';
import { Normaltekst } from 'nav-frontend-typografi';
import React, { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { dateStringSorter } from '@navikt/k9-date-utils';
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

const Soknadsperiodestripe: React.FC<SoknadsperiodestripeProps> = ({ behandlingPerioderMedVilkår }) => {
  const intl = useIntl();

  const formaterPerioder = () => {
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
          className: utfall.kode === 'OPPFYLT' ? styles.suksess : styles.feil,
          status: utfall.kode === 'OPPFYLT' ? ('suksess' as PeriodStatus) : 'feil',
        };
        if (harOverlappMedPeriodeTilVurdering) {
          overlappendePerioder.push(vedtaksperiode);
          nyPeriode.status = utfall.kode === 'OPPFYLT' ? ('suksessRevurder' as PeriodStatus) : 'feilRevurder';
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
          const nyPeriode = {
            id: `${fom}-${tom}`,
            fom: new Date(fom),
            tom: new Date(tom),
            status: 'advarsel' as PeriodStatus,
            className: `${styles.advarsel} ${styles.aktivPeriode}`,
          };
          const identiskPeriodeMedUtfall = behandlingPerioderMedVilkår.periodeMedUtfall.find(
            periodeMedUtfall => periodeMedUtfall.periode.fom === fom && periodeMedUtfall.periode.tom === tom,
          );
          if (identiskPeriodeMedUtfall) {
            const utfall = identiskPeriodeMedUtfall.utfall.kode === 'OPPFYLT' ? 'suksess' : 'feil';
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
          return nyPeriode;
        })
        .filter(periodeTilVurdering => periodeTilVurdering) || [];
    return vedtakshistorikk.concat(perioderTilVurdering);
  };

  const formatertePerioder = useMemo(() => formaterPerioder(), [behandlingPerioderMedVilkår]);

  const rader = [
    {
      perioder: formatertePerioder,
      radLabel: 'Søknadsperioder',
      radClassname: styles.rad,
    },
  ];

  const [tidslinjeSkala, setTidslinjeSkala] = useState<Tidslinjeskala>(6);
  const [navigasjonFomDato, setNavigasjonFomDato] = useState(undefined);

  useEffect(() => {
    if (formatertePerioder.length > 0) {
      const dato = useTidligsteDato({ startDato: undefined, rader }).startOf('month').toDate();
      setNavigasjonFomDato(dato);
    }
  }, [behandlingPerioderMedVilkår]);

  if (formatertePerioder.length === 0) {
    return null;
  }

  const getSkalaRadio = (label: string, value: Tidslinjeskala) => (
    <>
      <input
        className={styles.skalaRadioInput}
        id={label}
        onChange={() => setTidslinjeSkala(value)}
        type="radio"
        name="skala"
        value={value}
      />
      <label
        htmlFor={label}
        className={`${styles.skalaRadioLabel} ${tidslinjeSkala === value ? styles['skalaRadioLabel--selected'] : ''}`}
      >
        <Normaltekst>{label}</Normaltekst>
      </label>
    </>
  );

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
    const perioderSortertPåTom = [...rader[0].perioder].sort((a, b) =>
      dateStringSorter(a.tom.toISOString(), b.tom.toISOString()),
    );
    const senesteTom = perioderSortertPåTom[perioderSortertPåTom.length - 1].tom;
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
          aria-label="Naviger tidslinje bakover i tid"
          type="button"
        />
        <button
          onClick={() => updateNavigasjon()}
          className={styles.navigasjonButtonRight}
          aria-label="Naviger tidslinje fremover i tid"
          type="button"
          disabled={disableNavigasjonTomButton()}
        />
        <Normaltekst className={styles.navigasjonDatoContainer}>{formatNavigasjonsdato()}</Normaltekst>
      </div>
    </div>
  );
};

export default Soknadsperiodestripe;
