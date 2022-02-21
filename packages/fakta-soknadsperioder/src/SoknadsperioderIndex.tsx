import { dateStringSorter } from '@navikt/k9-date-utils';
import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import messages from '../i18n/nb_NO.json';
import { Tidslinje } from './components/tidslinje/Tidslinje';
import { PeriodStatus } from './types/types.internal';
import styles from './soknadsperioderIndex.less';

const cache = createIntlCache();

const intlConfig = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

const mockData = {
  perioderMedÅrsak: {
    perioderTilVurdering: [],
    perioderMedÅrsak: [
      {
        periode: {
          fom: '2021-12-15',
          tom: '2021-12-31',
        },
        årsaker: ['TRUKKET_KRAV'],
      },
      {
        periode: {
          fom: '2022-02-14',
          tom: '2022-02-20',
        },
        årsaker: ['TRUKKET_KRAV'],
      },
    ],
    dokumenterTilBehandling: [
      {
        journalpostId: '524975756',
        innsendingsTidspunkt: '2022-02-17T16:01:00',
        type: 'SØKNAD',
        søktePerioder: [],
      },
      {
        journalpostId: '524975753',
        innsendingsTidspunkt: '2022-02-15T15:54:00',
        type: 'SØKNAD',
        søktePerioder: [
          {
            periode: {
              fom: '2021-12-01',
              tom: '2021-12-03',
            },
            type: null,
            arbeidsgiver: null,
            arbeidsforholdRef: null,
          },
          {
            periode: {
              fom: '2021-12-07',
              tom: '2021-12-09',
            },
            type: null,
            arbeidsgiver: null,
            arbeidsforholdRef: null,
          },
        ],
      },
    ],
  },
  periodeMedUtfall: [],
  forrigeVedtak: [],
};

interface SoknadsperioderIndexProps {
  readOnly: boolean;
}

const SoknadsperioderIndex = (props: SoknadsperioderIndexProps) => {
  const { readOnly } = props;
  const sortertePerioderPåFomDato = () =>
    mockData.perioderMedÅrsak.perioderMedÅrsak.sort((a, b) => dateStringSorter(a.periode.fom, b.periode.fom));

  const getPerioderMedÅrsak = (årsak: string) =>
    sortertePerioderPåFomDato()
      .filter(periode => periode.årsaker.includes(årsak))
      .map(periode => ({ periode: periode.periode }));

  const getPerioderGruppertPåÅrsak = (): {
    radLabel: string;
    perioder: {
      periode: {
        fom: string;
        tom: string;
      };
      status?: PeriodStatus;
      classname?: string;
    }[];
  }[] => {
    const vedtakshistorikk = {
      radLabel: 'Vedtakshistorikk',
      perioder: mockData.forrigeVedtak.map(periode => ({
        periode: periode.periode,
        status: periode.utfall.kode === 'OPPFYLT' ? 'suksess' : 'feil',
        classname: `${periode.utfall.kode === 'OPPFYLT' ? styles.suksess : styles.feil}`,
      })),
    };
    const perioderTilBehandling = {
      radLabel: 'Perioder til behandling',
      perioder: mockData.perioderMedÅrsak.perioderTilVurdering.map(periode => ({ periode })),
    };
    const søknadOmNyPeriode = {
      radLabel: 'Søknad om ny periode',
      perioder: getPerioderMedÅrsak('FØRSTEGANGSVURDERING'),
    };
    const endringerFraSøker = {
      radLabel: 'Endringer fra søker',
      perioder: getPerioderMedÅrsak('ENDRING_FRA_BRUKER'),
    };
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
    const trukketKrav = {
      radLabel: 'Trukket krav',
      perioder: getPerioderMedÅrsak('TRUKKET_KRAV'),
    };
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
      søknadOmNyPeriode,
      endringerFraSøker,
      endringerPgaAnnenPart,
      revurdererNyInntektsmelding,
      revurdererBerørtPeriode,
      trukketKrav,
      gRegulering,
      revurdererManuellRevurdering,
    ];
  };
  const rader = getPerioderGruppertPåÅrsak().map((rad, index) => {
    let radClassname = '';
    if (index === 0) {
      radClassname = styles.vedtakhistorikkRad;
    } else if (index === 1) {
      radClassname = styles.perdioderTilBehandlingRad;
    }
    return {
      radLabel: rad.radLabel,
      radClassname,
      perioder: rad.perioder.map(({ periode, classname, status }) => ({
        id: `${periode.fom}-${periode.tom}`,
        fom: new Date(periode.fom),
        tom: new Date(periode.tom),
        status: status || ('advarsel' as PeriodStatus),
        className: classname || styles.advarsel,
      })),
    };
  });

  return (
    <RawIntlProvider value={intlConfig}>
      <div className={styles.soknadsperioder}>
        <Tidslinje
          rader={rader}
          // startDato={new Date(sortertePerioderPåFomDato[0].periode.fom)}
          // sluttDato={new Date(sortertePerioderPåTomDato[sortertePerioderPåTomDato.length - 1].periode.tom)}
        />
      </div>
    </RawIntlProvider>
  );
};
export default SoknadsperioderIndex;
