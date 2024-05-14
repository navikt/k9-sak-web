import { Tidslinje, TidslinjeZoom } from '@fpsak-frontend/shared-components';
import HorisontalNavigering from '@fpsak-frontend/shared-components/src/tidslinje/HorisontalNavigering';
import { useSenesteDato } from '@fpsak-frontend/shared-components/src/tidslinje/useTidslinjerader';
import { Period, dateStringSorter } from '@fpsak-frontend/utils';
import BehandlingPerioderårsakMedVilkår, {
  DokumenterTilBehandling,
} from '@k9-sak-web/types/src/behandlingPerioderarsakMedVilkar';
import { PeriodStatus, Tidslinjeskala } from '@k9-sak-web/types/src/tidslinje';
import { BodyShort } from '@navikt/ds-react';
import dayjs, { Dayjs } from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import { KodeverkType } from '@k9-sak-web/lib/types/KodeverkType.js';
import CheckIcon from './icons/CheckIcon';
import RejectedIcon from './icons/RejectedIcon';
import SaksbehandlerIcon from './icons/SaksbehandlerIcon';
import styles from './soknadsperioderComponent.module.css';
import Periode from './types/Periode';

const getPerioderMedÅrsak = (årsak: string, behandlingPerioderårsakMedVilkår: BehandlingPerioderårsakMedVilkår) => {
  const årsakMedPerioder = behandlingPerioderårsakMedVilkår.perioderMedÅrsak.årsakMedPerioder.find(
    årsakPerioder => årsakPerioder.årsak === årsak,
  );
  if (årsakMedPerioder) {
    return årsakMedPerioder.perioder.sort((a, b) => dateStringSorter(a.fom, b.fom)).map(periode => ({ periode }));
  }
  return [];
};
const harPeriodeoverlapp = (relevantePerioder, periodeFraDokument) =>
  relevantePerioder.some(relevantPeriode =>
    new Period(relevantPeriode.periode.fom, relevantPeriode.periode.tom).covers(
      new Period(periodeFraDokument.periode.fom, periodeFraDokument.periode.tom),
    ),
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
  const { kodeverkNavnFraKode } = useKodeverkContext();

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
    const vedtakshistorikkLabel = intl.formatMessage({ id: 'Soknadsperioder.Rad.Vedtakshistorikk' });
    const vedtakshistorikk = {
      radLabel: vedtakshistorikkLabel,
      perioder: behandlingPerioderårsakMedVilkår.forrigeVedtak.map(periode => ({
        periode: periode.periode,
        status: periode.utfall === 'OPPFYLT' ? ('suksess' as PeriodStatus) : 'feil',
        classname: `${periode.utfall === 'OPPFYLT' ? styles.suksess : styles.feil}`,
      })),
      radClassname: styles.vedtakhistorikkRad,
    };

    const perioderTilBehandlingLabel = intl.formatMessage({ id: 'Soknadsperioder.Rad.PerioderTilBehandling' });
    const perioderTilBehandling = {
      radLabel: perioderTilBehandlingLabel,
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
        radLabel: kodeverkNavnFraKode('FØRSTEGANGSVURDERING', KodeverkType.ÅRSAK_TIL_VURDERING),
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
        radLabel: kodeverkNavnFraKode('ENDRING_FRA_BRUKER', KodeverkType.ÅRSAK_TIL_VURDERING),
        perioder: endringerFraSøkerPerioder,
        onClick: hasSøknaderTilhørendeEringerFraSøker
          ? () => setExpandEndringerFraSøker(!expandEndringerFraSøker)
          : undefined,
        radClassname: hasSøknaderTilhørendeEringerFraSøker ? getExpanderbarRadStyles(expandEndringerFraSøker) : '',
      },
      ...søknaderTilhørendeEndringerFraSøker.filter(() => expandEndringerFraSøker),
    ];

    const revurdererEndringerPgaAnnenPart = {
      radLabel: kodeverkNavnFraKode('REVURDERER_ENDRING_FRA_ANNEN_PART', KodeverkType.ÅRSAK_TIL_VURDERING),
      perioder: getPerioderMedÅrsak('REVURDERER_ENDRING_FRA_ANNEN_PART', behandlingPerioderårsakMedVilkår),
    };

    const revurdererEtablertTilsynEndringFraAnnenOmsorgsperson = {
      radLabel: kodeverkNavnFraKode(
        'REVURDERER_ETABLERT_TILSYN_ENDRING_FRA_ANNEN_OMSORGSPERSON',
        KodeverkType.ÅRSAK_TIL_VURDERING,
      ),
      perioder: getPerioderMedÅrsak(
        'REVURDERER_ETABLERT_TILSYN_ENDRING_FRA_ANNEN_OMSORGSPERSON',
        behandlingPerioderårsakMedVilkår,
      ),
    };

    const revurdererSykdomEndringFraAnnenOmsorgsperson = {
      radLabel: kodeverkNavnFraKode(
        'REVURDERER_SYKDOM_ENDRING_FRA_ANNEN_OMSORGSPERSON',
        KodeverkType.ÅRSAK_TIL_VURDERING,
      ),
      perioder: getPerioderMedÅrsak(
        'REVURDERER_SYKDOM_ENDRING_FRA_ANNEN_OMSORGSPERSON',
        behandlingPerioderårsakMedVilkår,
      ),
    };

    const revurdererNattevåkBeredskapEndringFraAnnenOmsorgsperson = {
      radLabel: kodeverkNavnFraKode(
        'REVURDERER_NATTEVÅKBEREDSKAP_ENDRING_FRA_ANNEN_OMSORGSPERSON',
        KodeverkType.ÅRSAK_TIL_VURDERING,
      ),
      perioder: getPerioderMedÅrsak(
        'REVURDERER_NATTEVÅKBEREDSKAP_ENDRING_FRA_ANNEN_OMSORGSPERSON',
        behandlingPerioderårsakMedVilkår,
      ),
    };

    const revurdererNyInntektsmelding = {
      radLabel: kodeverkNavnFraKode('REVURDERER_NY_INNTEKTSMELDING', KodeverkType.ÅRSAK_TIL_VURDERING),
      perioder: getPerioderMedÅrsak('REVURDERER_NY_INNTEKTSMELDING', behandlingPerioderårsakMedVilkår),
    };

    const revurdererBerørtPeriode = {
      radLabel: kodeverkNavnFraKode('REVURDERER_BERØRT_PERIODE', KodeverkType.ÅRSAK_TIL_VURDERING),
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
        radLabel: kodeverkNavnFraKode('TRUKKET_KRAV', KodeverkType.ÅRSAK_TIL_VURDERING),
        perioder: trukketKravPerioder,
        onClick: hasSøknaderTilhørendeTrukketKrav ? () => setExpandTrukketKrav(!expandTrukketKrav) : undefined,
        radClassname: hasSøknaderTilhørendeTrukketKrav ? getExpanderbarRadStyles(expandTrukketKrav) : '',
      },
      ...søknaderTilhørendeTrukketKrav.filter(() => expandTrukketKrav),
    ];

    const gRegulering = {
      radLabel: kodeverkNavnFraKode('G_REGULERING', KodeverkType.ÅRSAK_TIL_VURDERING),
      perioder: getPerioderMedÅrsak('G_REGULERING', behandlingPerioderårsakMedVilkår),
    };
    const revurdererManuellRevurdering = {
      radLabel: kodeverkNavnFraKode('MANUELT_REVURDERER_PERIODE', KodeverkType.ÅRSAK_TIL_VURDERING),
      perioder: getPerioderMedÅrsak('MANUELT_REVURDERER_PERIODE', behandlingPerioderårsakMedVilkår),
    };

    const utsattBehandling = {
      radLabel: kodeverkNavnFraKode('UTSATT_BEHANDLING', KodeverkType.ÅRSAK_TIL_VURDERING),
      perioder: getPerioderMedÅrsak('UTSATT_BEHANDLING', behandlingPerioderårsakMedVilkår),
    };

    const gjenopptarUtsattBehandling = {
      radLabel: kodeverkNavnFraKode('GJENOPPTAR_UTSATT_BEHANDLING', KodeverkType.ÅRSAK_TIL_VURDERING),
      perioder: getPerioderMedÅrsak('GJENOPPTAR_UTSATT_BEHANDLING', behandlingPerioderårsakMedVilkår),
    };

    return [
      vedtakshistorikk,
      perioderTilBehandling,
      ...søknadOmNyPeriode,
      ...endringerFraSøker,
      revurdererEndringerPgaAnnenPart,
      revurdererEtablertTilsynEndringFraAnnenOmsorgsperson,
      revurdererSykdomEndringFraAnnenOmsorgsperson,
      revurdererNattevåkBeredskapEndringFraAnnenOmsorgsperson,
      revurdererNyInntektsmelding,
      revurdererBerørtPeriode,
      ...trukketKrav,
      gRegulering,
      revurdererManuellRevurdering,
      utsattBehandling,
      gjenopptarUtsattBehandling,
    ].filter(radGruppertPåÅrsak => {
      if (
        radGruppertPåÅrsak.radLabel === vedtakshistorikkLabel ||
        radGruppertPåÅrsak.radLabel === perioderTilBehandlingLabel
      ) {
        return true;
      }
      return radGruppertPåÅrsak.perioder.length > 0;
    });
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
  const subtractMonthsFromDate = (dateToSubtractFrom, numberOfMonthsToSubtract) =>
    dayjs(dateToSubtractFrom).subtract(numberOfMonthsToSubtract, 'months').toDate();

  const updateNavigasjonFomDato = (antallMånederFraSluttdato: number) => {
    const senesteTom = getSenesteTom();
    const fomDato = subtractMonthsFromDate(senesteTom, antallMånederFraSluttdato);
    setNavigasjonFomDato(fomDato);
  };

  useEffect(() => {
    if (getRader().length > 0) {
      updateNavigasjonFomDato(6);
    }
  }, [behandlingPerioderårsakMedVilkår]);

  const filtrerteRader = getRader().filter((rad, index) => {
    if ((!expandPerioderTilBehandling && index <= 1) || expandPerioderTilBehandling) {
      return true;
    }
    return false;
  });

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

  const updateHorisontalNavigering = (nyFomDato: Dayjs) => {
    if (nyFomDato.add(tidslinjeSkala, 'months').isSameOrAfter(getSenesteTom())) {
      const senesteTom = getSenesteTom();
      setNavigasjonFomDato(subtractMonthsFromDate(senesteTom, tidslinjeSkala));
    } else {
      setNavigasjonFomDato(nyFomDato.toDate());
    }
  };

  return (
    <div className={styles.soknadsperioder}>
      <div className={styles.flexContainer}>
        <h1 className={styles.heading}>{intl.formatMessage({ id: 'Soknadsperioder.Søknadsperioder' })}</h1>
        <div className={styles.navigasjonContainer}>
          <HorisontalNavigering
            tidslinjeSkala={tidslinjeSkala}
            rader={getRader()}
            navigasjonFomDato={navigasjonFomDato}
            updateHorisontalNavigering={updateHorisontalNavigering}
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
      <Tidslinje rader={filtrerteRader} tidslinjeSkala={tidslinjeSkala} startDato={navigasjonFomDato} />
      <div className={styles.legendContainer}>
        <BodyShort size="small">
          <CheckIcon />
          {intl.formatMessage({ id: 'Soknadsperioder.Status.InnvilgetPeriode' })}
        </BodyShort>
        <BodyShort size="small">
          <RejectedIcon />
          {intl.formatMessage({ id: 'Soknadsperioder.Status.AvslåttPeriode' })}
        </BodyShort>
        <BodyShort size="small">
          <SaksbehandlerIcon />
          {intl.formatMessage({ id: 'Soknadsperioder.Status.TilBehandling' })}
        </BodyShort>
      </div>
    </div>
  );
};
export default SoknadsperioderComponent;
