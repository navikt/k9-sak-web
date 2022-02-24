import { Tidslinje } from '@fpsak-frontend/shared-components';
import { useTidligsteDato } from '@fpsak-frontend/shared-components/src/tidslinje/useTidslinjerader';
import { dateStringSorter } from '@navikt/k9-date-utils';
import dayjs from 'dayjs';
import { Normaltekst } from 'nav-frontend-typografi';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import CheckIcon from './components/tidslinje/CheckIcon';
import RejectedIcon from './components/tidslinje/RejectedIcon';
import SaksbehandlerIcon from './components/tidslinje/SaksbehandlerIcon';
import styles from './soknadsperioderComponent.less';
import BehandlingPerioderårsakMedVilkår, { DokumenterTilBehandling } from './types/BehandlingPerioderårsakMedVilkår';
import Periode from './types/Periode';
import { PeriodStatus, Tidslinjeskala } from './types/types.internal';

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
  const intl = useIntl();
  const sortertePerioderPåFomDato = () =>
    [...behandlingPerioderårsakMedVilkår.perioderMedÅrsak.perioderMedÅrsak].sort((a, b) =>
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

    const førstegangsvurderingsperioder = getPerioderMedÅrsak('FØRSTEGANGSVURDERING');
    const søknaderTilhørendeFørstegangsvurderinger = finnRelevantePerioderFraDokumenter(
      behandlingPerioderårsakMedVilkår.perioderMedÅrsak.dokumenterTilBehandling,
      førstegangsvurderingsperioder,
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

    const endringerFraSøkerPerioder = getPerioderMedÅrsak('ENDRING_FRA_BRUKER');
    const søknaderTilhørendeEndringerFraSøker = finnRelevantePerioderFraDokumenter(
      behandlingPerioderårsakMedVilkår.perioderMedÅrsak.dokumenterTilBehandling,
      endringerFraSøkerPerioder,
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
      perioder: getPerioderMedÅrsak('REVURDERER_ENDRING_FRA_ANNEN_PART'),
    };

    const revurdererNyInntektsmelding = {
      radLabel: intl.formatMessage({ id: 'Soknadsperioder.Rad.NyInntektsmelding' }),
      perioder: getPerioderMedÅrsak('REVURDERER_NY_INNTEKTSMELDING'),
    };

    const revurdererBerørtPeriode = {
      radLabel: intl.formatMessage({ id: 'Soknadsperioder.Rad.BerørtPeriode' }),
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
        radLabel: intl.formatMessage({ id: 'Soknadsperioder.Rad.TrukketKrav' }),
        perioder: trukketKravPerioder,
        onClick: hasSøknaderTilhørendeTrukketKrav ? () => setExpandTrukketKrav(!expandTrukketKrav) : undefined,
        radClassname: hasSøknaderTilhørendeTrukketKrav ? getExpanderbarRadStyles(expandTrukketKrav) : '',
      },
      ...søknaderTilhørendeTrukketKrav.filter(() => expandTrukketKrav),
    ];

    const gRegulering = {
      radLabel: intl.formatMessage({ id: 'Soknadsperioder.Rad.GRegulering' }),
      perioder: getPerioderMedÅrsak('G_REGULERING'),
    };
    const revurdererManuellRevurdering = {
      radLabel: intl.formatMessage({ id: 'Soknadsperioder.Rad.ManuellRevurdering' }),
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

  const startDato = useTidligsteDato({ startDato: undefined, rader: getRader() }).startOf('month').toDate();
  const filtrerteRader = getRader().filter((rad, index) => {
    if ((!expandPerioderTilBehandling && index <= 1) || expandPerioderTilBehandling) {
      return true;
    }
    return false;
  });

  return (
    <div className={styles.soknadsperioder}>
      <div className={styles.flexContainer}>
        <h1 className={styles.heading}>{intl.formatMessage({ id: 'Soknadsperioder.Søknadsperioder' })}</h1>
        <div className={styles.skalavelgerContainer}>
          <fieldset>
            <legend>{intl.formatMessage({ id: 'Soknadsperioder.Skala.SkalaForVisning' })}</legend>
            {getSkalaRadio(intl.formatMessage({ id: 'Soknadsperioder.Skala.6mnd' }), 6)}
            {getSkalaRadio(intl.formatMessage({ id: 'Soknadsperioder.Skala.1år' }), 12)}
            {getSkalaRadio(intl.formatMessage({ id: 'Soknadsperioder.Skala.3år' }), 36)}
          </fieldset>
        </div>
      </div>
      <Tidslinje rader={filtrerteRader} tidslinjeSkala={tidslinjeSkala} startDato={startDato} />
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
