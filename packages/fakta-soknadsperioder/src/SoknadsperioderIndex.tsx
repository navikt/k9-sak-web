import { dateStringSorter } from '@navikt/k9-date-utils';
import dayjs from 'dayjs';
import { Normaltekst } from 'nav-frontend-typografi';
import React, { useState } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import messages from '../i18n/nb_NO.json';
import CheckIcon from './components/tidslinje/CheckIcon';
import RejectedIcon from './components/tidslinje/RejectedIcon';
import SaksbehandlerIcon from './components/tidslinje/SakdsbehandlerIcon';
import { Tidslinje } from './components/tidslinje/Tidslinje';
import { useTidligsteDato } from './components/tidslinje/useTidslinjerader';
import styles from './soknadsperioderIndex.less';
import BehandlingPerioderårsakMedVilkår, { DokumenterTilBehandling } from './types/BehandlingPerioderårsakMedVilkår';
import { PeriodStatus, Tidslinjeskala } from './types/types.internal';
import Periode from './types/Periode';

const cache = createIntlCache();

const intlConfig = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface SoknadsperioderIndexProps {
  behandlingPerioderårsakMedVilkår: BehandlingPerioderårsakMedVilkår;
}

const SoknadsperioderIndex = (props: SoknadsperioderIndexProps) => {
  const { behandlingPerioderårsakMedVilkår } = props;
  const [tidslinjeSkala, setTidslinjeSkala] = useState<Tidslinjeskala>(6);
  const [expandPerioderTilBehandling, setExpandPerioderTilBehandling] = useState(true);
  const [expandSøknaderOmNyPeriode, setExpandSøknaderOmNyPeriode] = useState(false);
  const [expandEndringerFraSøker, setExpandEndringerFraSøker] = useState(false);
  const [expandTrukketKrav, setExpandTrukketKrav] = useState(false);
  const sortertePerioderPåFomDato = () =>
    behandlingPerioderårsakMedVilkår.perioderMedÅrsak.perioderMedÅrsak.sort((a, b) =>
      dateStringSorter(a.periode.fom, b.periode.fom),
    );

  const getPerioderMedÅrsak = (årsak: string) =>
    sortertePerioderPåFomDato()
      .filter(periode => periode.årsaker.includes(årsak))
      .map(periode => ({ periode: periode.periode }));

  const finnRelevantePerioderFraDokumenter = (
    dokumenterTilBehandling: DokumenterTilBehandling[],
    førstegangsvurderingsperioder: {
      periode: Periode;
    }[],
  ) =>
    dokumenterTilBehandling
      .filter(({ søktePerioder }) =>
        søktePerioder.some(søktPeriode =>
          førstegangsvurderingsperioder.some(
            førstegangsvurderingsperiode =>
              førstegangsvurderingsperiode.periode.fom === søktPeriode.periode.fom &&
              førstegangsvurderingsperiode.periode.tom === søktPeriode.periode.tom,
          ),
        ),
      )
      .map(({ innsendingsTidspunkt, søktePerioder }) => ({
        perioder: søktePerioder.map(søktPeriode => ({
          periode: { fom: søktPeriode.periode.fom, tom: søktPeriode.periode.tom },
        })),
        radLabel: `Søknad ${dayjs(innsendingsTidspunkt).format('DD.MM.YYYY').toString()}`,
        radClassname: styles.dokumentrad,
        emptyRowClassname: styles.grayRow,
      }));

  const getPerioderGruppertPåÅrsak = (): {
    radLabel: string;
    perioder: {
      periode: Periode;
      status?: PeriodStatus;
      classname?: string;
    }[];
    radClassname?: string;
    emptyRowClassname?: string;
    onClick?: () => void;
  }[] => {
    const vedtakshistorikk = {
      radLabel: 'Vedtakshistorikk',
      perioder: behandlingPerioderårsakMedVilkår.forrigeVedtak.map(periode => ({
        periode: periode.periode,
        status: periode.utfall.kode === 'OPPFYLT' ? ('suksess' as PeriodStatus) : 'feil',
        classname: `${periode.utfall.kode === 'OPPFYLT' ? styles.suksess : styles.feil}`,
      })),
      radClassname: styles.vedtakhistorikkRad,
    };

    const perioderTilBehandling = {
      radLabel: 'Perioder til behandling',
      perioder: behandlingPerioderårsakMedVilkår.perioderMedÅrsak.perioderTilVurdering.map(periode => ({ periode })),
      radClassname: `${styles.perdioderTilBehandlingRad} ${styles.ekspanderbarRad} ${
        expandPerioderTilBehandling ? styles['ekspanderbarRad--active'] : ''
      }`,
      onClick: () => setExpandPerioderTilBehandling(!expandPerioderTilBehandling),
    };

    const førstegangsvurderingsperioder = getPerioderMedÅrsak('FØRSTEGANGSVURDERING');
    const søknaderTilhørendeFørstegangsvurderinger = finnRelevantePerioderFraDokumenter(
      behandlingPerioderårsakMedVilkår.perioderMedÅrsak.dokumenterTilBehandling,
      førstegangsvurderingsperioder,
    );
    const hasSøknaderTilhørendeFørstegangsvurderinger = søknaderTilhørendeFørstegangsvurderinger.length > 0;
    const søknadOmNyPeriode = [
      {
        radLabel: 'Søknad om ny periode',
        perioder: førstegangsvurderingsperioder,
        onClick: hasSøknaderTilhørendeFørstegangsvurderinger
          ? () => setExpandSøknaderOmNyPeriode(!expandSøknaderOmNyPeriode)
          : undefined,
        radClassname: hasSøknaderTilhørendeFørstegangsvurderinger
          ? `${styles.ekspanderbarRad} ${expandSøknaderOmNyPeriode ? styles['ekspanderbarRad--active'] : ''}`
          : '',
      },
      ...søknaderTilhørendeFørstegangsvurderinger.filter(() => expandSøknaderOmNyPeriode),
    ];

    const endringerFraSøkerPerioder = getPerioderMedÅrsak('ENDRING_FRA_BRUKER');
    const søknaderTilhørendeEringerFraSøker = finnRelevantePerioderFraDokumenter(
      behandlingPerioderårsakMedVilkår.perioderMedÅrsak.dokumenterTilBehandling,
      endringerFraSøkerPerioder,
    );
    const hasSøknaderTilhørendeEringerFraSøker = søknaderTilhørendeEringerFraSøker.length > 0;

    const endringerFraSøker = [
      {
        radLabel: 'Endringer fra søker',
        perioder: endringerFraSøkerPerioder,
        onClick: hasSøknaderTilhørendeEringerFraSøker
          ? () => setExpandEndringerFraSøker(!expandEndringerFraSøker)
          : undefined,
        radClassname: hasSøknaderTilhørendeEringerFraSøker
          ? `${styles.ekspanderbarRad} ${expandEndringerFraSøker ? styles['ekspanderbarRad--active'] : ''}`
          : '',
      },
      ...søknaderTilhørendeEringerFraSøker.filter(() => expandEndringerFraSøker),
    ];

    const endringerPgaAnnenPart = {
      radLabel: 'Endringer pga. annen part',
      perioder: getPerioderMedÅrsak('REVURDERER_ENDRING_FRA_ANNEN_PART'),
    };

    const revurdererNyInntektsmelding = {
      radLabel: 'Ny inntektsmelding',
      perioder: getPerioderMedÅrsak('REVURDERER_NY_INNTEKTSMELDING'),
    };

    const revurdererBerørtPeriode = {
      radLabel: 'Berørt periode',
      perioder: getPerioderMedÅrsak('REVURDERER_BERØRT_PERIODE'),
    };

    const trukketKravPerioder = getPerioderMedÅrsak('TRUKKET_KRAV');
    const søknaderTilhørendeTrukketKrav = finnRelevantePerioderFraDokumenter(
      behandlingPerioderårsakMedVilkår.perioderMedÅrsak.dokumenterTilBehandling,
      trukketKravPerioder,
    );
    const hasSøknaderTilhørendeTrukketKrav = søknaderTilhørendeTrukketKrav.length > 0;

    const trukketKrav = [
      {
        radLabel: 'Trukket krav',
        perioder: trukketKravPerioder,
        onClick: hasSøknaderTilhørendeTrukketKrav ? () => setExpandTrukketKrav(!expandTrukketKrav) : undefined,
        radClassname: hasSøknaderTilhørendeTrukketKrav
          ? `${styles.ekspanderbarRad} ${expandTrukketKrav ? styles['ekspanderbarRad--active'] : ''}`
          : '',
      },
      ...søknaderTilhørendeTrukketKrav.filter(() => expandTrukketKrav),
    ];

    const gRegulering = {
      radLabel: 'G-regulering',
      perioder: getPerioderMedÅrsak('G_REGULERING'),
    };
    const revurdererManuellRevurdering = {
      radLabel: 'Manuell revurdering',
      perioder: getPerioderMedÅrsak('MANUELT_REVURDERER_PERIODE'),
    };

    return [
      vedtakshistorikk,
      perioderTilBehandling,
      ...søknadOmNyPeriode,
      ...endringerFraSøker,
      endringerPgaAnnenPart,
      revurdererNyInntektsmelding,
      revurdererBerørtPeriode,
      ...trukketKrav,
      gRegulering,
      revurdererManuellRevurdering,
    ];
  };
  const getRader = () =>
    getPerioderGruppertPåÅrsak().map(rad => ({
      onClick: rad.onClick,
      radLabel: rad.radLabel,
      radClassname: rad.radClassname,
      emptyRowClassname: rad.emptyRowClassname,
      perioder: rad.perioder.map(({ periode, classname, status }) => ({
        id: `${periode.fom}-${periode.tom}`,
        fom: new Date(periode.fom),
        tom: new Date(periode.tom),
        status: status || ('advarsel' as PeriodStatus),
        className: classname || styles.advarsel,
      })),
    }));

  const getSkalaRadio = (label: string, value: Tidslinjeskala) => (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label className={`${styles.skalaRadio} ${tidslinjeSkala === value ? styles['skalaRadio--selected'] : ''}`}>
      <Normaltekst>{label}</Normaltekst>
      <input onChange={() => setTidslinjeSkala(value)} type="radio" name="skala" value={value} />
    </label>
  );

  const startDato = useTidligsteDato({ startDato: undefined, rader: getRader() }).startOf('month').toDate();
  const filtrerteRader = getRader().filter((rad, index) => {
    if ((!expandPerioderTilBehandling && index <= 1) || expandPerioderTilBehandling) {
      return true;
    }
    return false;
  });

  return (
    <RawIntlProvider value={intlConfig}>
      <div className={styles.soknadsperioder}>
        <div className={styles.flexContainer}>
          <h1 className={styles.heading}>Søknadsperioder</h1>
          <div className={styles.skalavelgerContainer}>
            <fieldset>
              <legend>Velg skala for visning</legend>
              {getSkalaRadio('6 mnd', 6)}
              {getSkalaRadio('1 år', 12)}
              {getSkalaRadio('3 år', 36)}
            </fieldset>
          </div>
        </div>
        <Tidslinje rader={filtrerteRader} tidslinjeSkala={tidslinjeSkala} startDato={startDato} />
        <div className={styles.legendContainer}>
          <p>
            <CheckIcon />
            Innvilget periode
          </p>
          <p>
            <RejectedIcon />
            Avslått periode
          </p>
          <p>
            <SaksbehandlerIcon />
            Til behandling
          </p>
        </div>
      </div>
    </RawIntlProvider>
  );
};
export default SoknadsperioderIndex;
