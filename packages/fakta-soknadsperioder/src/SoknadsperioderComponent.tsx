import { Tidslinje } from '@fpsak-frontend/shared-components';
import HorisontalNavigering from '@fpsak-frontend/shared-components/src/tidslinje/HorisontalNavigering';
import { useSenesteDato } from '@fpsak-frontend/shared-components/src/tidslinje/useTidslinjerader';
import BehandlingPerioderårsakMedVilkår, {
  DokumenterTilBehandling,
} from '@k9-sak-web/types/src/behandlingPerioderarsakMedVilkar';
import { PeriodStatus, Tidslinjeskala } from '@k9-sak-web/types/src/tidslinje';
import { dateStringSorter } from '@navikt/k9-date-utils';
import dayjs, { Dayjs } from 'dayjs';
import { Normaltekst } from 'nav-frontend-typografi';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import CheckIcon from './icons/CheckIcon';
import RejectedIcon from './icons/RejectedIcon';
import SaksbehandlerIcon from './icons/SaksbehandlerIcon';
import ZoomInIcon from './icons/ZoomInIcon';
import ZoomOutIcon from './icons/ZoomOutIcon';
import styles from './soknadsperioderComponent.less';
import Periode from './types/Periode';

const sortertePerioderPåFomDato = (behandlingPerioderårsakMedVilkår: BehandlingPerioderårsakMedVilkår) =>
  [...behandlingPerioderårsakMedVilkår.perioderMedÅrsak.perioderMedÅrsak].sort((a, b) =>
    dateStringSorter(a.periode.fom, b.periode.fom),
  );

const getPerioderMedÅrsak = (årsak: string, behandlingPerioderårsakMedVilkår: BehandlingPerioderårsakMedVilkår) =>
  sortertePerioderPåFomDato(behandlingPerioderårsakMedVilkår)
    .filter(periode => periode.årsaker.includes(årsak))
    .map(periode => ({ periode: periode.periode }));

const harPeriodeoverlapp = (relevantePerioder, periodeFraDokument) =>
  relevantePerioder.some(
    relevantePeriode =>
      relevantePeriode.periode.fom === periodeFraDokument.periode.fom &&
      relevantePeriode.periode.tom === periodeFraDokument.periode.tom,
  );

const lagPerioderFraDokumenter = (
  dokumenterTilBehandling: DokumenterTilBehandling[],
  relevantePerioder: {
    periode: Periode;
  }[],
  intl,
) =>
  dokumenterTilBehandling
    .filter(({ søktePerioder }) =>
      søktePerioder.some(periodeFraDokument => harPeriodeoverlapp(relevantePerioder, periodeFraDokument)),
    )
    .map(({ innsendingsTidspunkt, søktePerioder }) => ({
      perioder: søktePerioder
        .filter(periodeFraDokument => harPeriodeoverlapp(relevantePerioder, periodeFraDokument))
        .map(søktPeriode => ({
          periode: { fom: søktPeriode.periode.fom, tom: søktPeriode.periode.tom },
        })),
      radLabel: intl.formatMessage(
        {
          id: 'Soknadsperioder.SøknadMedDato',
        },
        {
          dato: dayjs(innsendingsTidspunkt).format('DD.MM.YYYY').toString(),
        },
      ),
      radClassname: styles.dokumentrad,
      emptyRowClassname: styles.grayRow,
    }));

const getExpanderbarRadStyles = (flag: boolean) =>
  `${styles.ekspanderbarRad} ${flag ? styles['ekspanderbarRad--active'] : ''}`;

interface SoknadsperioderComponentProps {
  behandlingPerioderårsakMedVilkår: BehandlingPerioderårsakMedVilkår;
}

const SoknadsperioderComponent = (props: SoknadsperioderComponentProps) => {
  const { behandlingPerioderårsakMedVilkår } = props;
  const [tidslinjeSkala, setTidslinjeSkala] = useState<Tidslinjeskala>(6);
  const [expandPerioderTilBehandling, setExpandPerioderTilBehandling] = useState(true);
  const [expandSøknaderOmNyPeriode, setExpandSøknaderOmNyPeriode] = useState(false);
  const [expandEndringerFraSøker, setExpandEndringerFraSøker] = useState(false);
  const [expandTrukketKrav, setExpandTrukketKrav] = useState(false);
  const [navigasjonFomDato, setNavigasjonFomDato] = useState(undefined);
  const intl = useIntl();

  /** TODO: Hallvard: Denne bør refaktoreres */
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
      radLabel: intl.formatMessage({ id: 'Soknadsperioder.Rad.Vedtakshistorikk' }),
      perioder: behandlingPerioderårsakMedVilkår.forrigeVedtak.map(periode => ({
        periode: periode.periode,
        status: periode.utfall.kode === 'OPPFYLT' ? ('suksess' as PeriodStatus) : 'feil',
        classname: `${periode.utfall.kode === 'OPPFYLT' ? styles.suksess : styles.feil}`,
      })),
      radClassname: styles.vedtakhistorikkRad,
    };

    const perioderTilBehandling = {
      radLabel: intl.formatMessage({ id: 'Soknadsperioder.Rad.PerioderTilBehandling' }),
      perioder: behandlingPerioderårsakMedVilkår.perioderMedÅrsak.perioderTilVurdering.map(periode => ({ periode })),
      radClassname: `${styles.perdioderTilBehandlingRad} ${getExpanderbarRadStyles(expandPerioderTilBehandling)}`,
      onClick: () => setExpandPerioderTilBehandling(!expandPerioderTilBehandling),
    };

    const førstegangsvurderingsperioder = getPerioderMedÅrsak('FØRSTEGANGSVURDERING', behandlingPerioderårsakMedVilkår);
    const søknaderTilhørendeFørstegangsvurderinger = lagPerioderFraDokumenter(
      behandlingPerioderårsakMedVilkår.perioderMedÅrsak.dokumenterTilBehandling,
      førstegangsvurderingsperioder,
      intl,
    );
    const hasSøknaderTilhørendeFørstegangsvurderinger = søknaderTilhørendeFørstegangsvurderinger.length > 0;
    const søknadOmNyPeriode = [
      {
        radLabel: intl.formatMessage({ id: 'Soknadsperioder.Rad.SøknadOmNyPeriode' }),
        perioder: førstegangsvurderingsperioder,
        onClick: hasSøknaderTilhørendeFørstegangsvurderinger
          ? () => setExpandSøknaderOmNyPeriode(!expandSøknaderOmNyPeriode)
          : undefined,
        radClassname: hasSøknaderTilhørendeFørstegangsvurderinger
          ? getExpanderbarRadStyles(expandSøknaderOmNyPeriode)
          : '',
      },
      ...søknaderTilhørendeFørstegangsvurderinger.filter(() => expandSøknaderOmNyPeriode),
    ];

    const endringerFraSøkerPerioder = getPerioderMedÅrsak('ENDRING_FRA_BRUKER', behandlingPerioderårsakMedVilkår);
    const søknaderTilhørendeEndringerFraSøker = lagPerioderFraDokumenter(
      behandlingPerioderårsakMedVilkår.perioderMedÅrsak.dokumenterTilBehandling,
      endringerFraSøkerPerioder,
      intl,
    );
    const hasSøknaderTilhørendeEringerFraSøker = søknaderTilhørendeEndringerFraSøker.length > 0;

    const endringerFraSøker = [
      {
        radLabel: intl.formatMessage({ id: 'Soknadsperioder.Rad.EndringerFraSøker' }),
        perioder: endringerFraSøkerPerioder,
        onClick: hasSøknaderTilhørendeEringerFraSøker
          ? () => setExpandEndringerFraSøker(!expandEndringerFraSøker)
          : undefined,
        radClassname: hasSøknaderTilhørendeEringerFraSøker ? getExpanderbarRadStyles(expandEndringerFraSøker) : '',
      },
      ...søknaderTilhørendeEndringerFraSøker.filter(() => expandEndringerFraSøker),
    ];

    const endringerPgaAnnenPart = {
      radLabel: intl.formatMessage({ id: 'Soknadsperioder.Rad.EndringerPgaAnnenPart' }),
      perioder: getPerioderMedÅrsak('REVURDERER_ENDRING_FRA_ANNEN_PART', behandlingPerioderårsakMedVilkår),
    };

    const revurdererNyInntektsmelding = {
      radLabel: intl.formatMessage({ id: 'Soknadsperioder.Rad.NyInntektsmelding' }),
      perioder: getPerioderMedÅrsak('REVURDERER_NY_INNTEKTSMELDING', behandlingPerioderårsakMedVilkår),
    };

    const revurdererBerørtPeriode = {
      radLabel: intl.formatMessage({ id: 'Soknadsperioder.Rad.BerørtPeriode' }),
      perioder: getPerioderMedÅrsak('REVURDERER_BERØRT_PERIODE', behandlingPerioderårsakMedVilkår),
    };

    const trukketKravPerioder = getPerioderMedÅrsak('TRUKKET_KRAV', behandlingPerioderårsakMedVilkår);
    const søknaderTilhørendeTrukketKrav = lagPerioderFraDokumenter(
      behandlingPerioderårsakMedVilkår.perioderMedÅrsak.dokumenterTilBehandling,
      trukketKravPerioder,
      intl,
    );
    const hasSøknaderTilhørendeTrukketKrav = søknaderTilhørendeTrukketKrav.length > 0;

    const trukketKrav = [
      {
        radLabel: intl.formatMessage({ id: 'Soknadsperioder.Rad.TrukketKrav' }),
        perioder: trukketKravPerioder,
        onClick: hasSøknaderTilhørendeTrukketKrav ? () => setExpandTrukketKrav(!expandTrukketKrav) : undefined,
        radClassname: hasSøknaderTilhørendeTrukketKrav ? getExpanderbarRadStyles(expandTrukketKrav) : '',
      },
      ...søknaderTilhørendeTrukketKrav.filter(() => expandTrukketKrav),
    ];

    const gRegulering = {
      radLabel: intl.formatMessage({ id: 'Soknadsperioder.Rad.GRegulering' }),
      perioder: getPerioderMedÅrsak('G_REGULERING', behandlingPerioderårsakMedVilkår),
    };
    const revurdererManuellRevurdering = {
      radLabel: intl.formatMessage({ id: 'Soknadsperioder.Rad.ManuellRevurdering' }),
      perioder: getPerioderMedÅrsak('MANUELT_REVURDERER_PERIODE', behandlingPerioderårsakMedVilkår),
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

  const getSenesteTom = () => useSenesteDato({ sluttDato: undefined, rader: getRader() });

  const updateNavigasjonFomDato = (antallMånederFraSluttdato: number) => {
    const senesteTom = getSenesteTom();
    const fomDato = dayjs(senesteTom).subtract(antallMånederFraSluttdato, 'months').toDate();
    setNavigasjonFomDato(fomDato);
  };

  useEffect(() => {
    if (getRader().length > 0) {
      // Tidslinjen skal initielt slutte på første dag i månenden etter den seneste perioden
      updateNavigasjonFomDato(6);
    }
  }, [behandlingPerioderårsakMedVilkår]);

  const filtrerteRader = getRader().filter((rad, index) => {
    if ((!expandPerioderTilBehandling && index <= 1) || expandPerioderTilBehandling) {
      return true;
    }
    return false;
  });

  const updateZoom = (zoomValue: number) => {
    const senesteTom = getSenesteTom();
    if (dayjs(navigasjonFomDato).add(zoomValue, 'months').isSameOrAfter(senesteTom)) {
      setNavigasjonFomDato(senesteTom.subtract(zoomValue, 'months'));
    }
    setTidslinjeSkala(zoomValue);
  };

  const updateHorisontalNavigering = (nyFomDato: Dayjs) => {
    if (nyFomDato.isAfter(getSenesteTom())) {
      setNavigasjonFomDato(getSenesteTom().subtract(tidslinjeSkala).toDate());
    } else {
      setNavigasjonFomDato(nyFomDato.toDate());
    }
  };

  return (
    <div className={styles.soknadsperioder}>
      <div className={styles.flexContainer}>
        <h1 className={styles.heading}>{intl.formatMessage({ id: 'Soknadsperioder.Søknadsperioder' })}</h1>
        <div style={{ display: 'flex' }}>
          <HorisontalNavigering
            tidslinjeSkala={tidslinjeSkala}
            rader={getRader()}
            navigasjonFomDato={navigasjonFomDato}
            updateHorisontalNavigering={updateHorisontalNavigering}
          />
          <div className={styles.skalavelgerContainer}>
            <button
              onClick={() => {
                if (tidslinjeSkala < 4) {
                  updateZoom(1);
                } else {
                  updateZoom(tidslinjeSkala - 3);
                }
              }}
              type="button"
              className={styles.zoomButton}
            >
              <ZoomInIcon />
              <Normaltekst>Forstørre</Normaltekst>
            </button>
            <button
              onClick={() => {
                if (tidslinjeSkala > 33) {
                  updateZoom(36);
                } else {
                  updateZoom(tidslinjeSkala + 3);
                }
              }}
              type="button"
              className={styles.zoomButton}
            >
              <ZoomOutIcon />
              <Normaltekst>Forminske</Normaltekst>
            </button>
          </div>
        </div>
      </div>
      <Tidslinje rader={filtrerteRader} tidslinjeSkala={tidslinjeSkala} startDato={navigasjonFomDato} />
      <div className={styles.legendContainer}>
        <Normaltekst>
          <CheckIcon />
          {intl.formatMessage({ id: 'Soknadsperioder.Status.InnvilgetPeriode' })}
        </Normaltekst>
        <Normaltekst>
          <RejectedIcon />
          {intl.formatMessage({ id: 'Soknadsperioder.Status.AvslåttPeriode' })}
        </Normaltekst>
        <Normaltekst>
          <SaksbehandlerIcon />
          {intl.formatMessage({ id: 'Soknadsperioder.Status.TilBehandling' })}
        </Normaltekst>
      </div>
    </div>
  );
};
export default SoknadsperioderComponent;
