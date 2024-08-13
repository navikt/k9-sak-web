import React from 'react';
import { screen } from '@testing-library/react';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { Aksjonspunkt } from '@k9-sak-web/types';
import { FormProvider, useForm } from 'react-hook-form';
import { KodeverkProvider } from '@k9-sak-web/gui/kodeverk/index.js';
import alleKodeverkV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';
import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { MedlemskapPeriode } from './Medlemskap';
import { Periode } from './Periode';
import PerioderMedMedlemskapFaktaPanel from './PerioderMedMedlemskapFaktaPanel';
import { Soknad } from './Soknad';

import messages from '../../../i18n/nb_NO.json';

describe('<PerioderMedMedlemskapFaktaPanel>', () => {
  const Wrapper = props => {
    const formMethods = useForm({
      defaultValues: {
        oppholdInntektOgPeriodeForm: {
          fixedMedlemskapPerioder: props.perioder,
          hasPeriodeAksjonspunkt: true,
        },
      },
    });

    return (
      <KodeverkProvider
        behandlingType={behandlingType.FØRSTEGANGSSØKNAD}
        kodeverk={alleKodeverkV2}
        klageKodeverk={alleKodeverkV2}
        tilbakeKodeverk={alleKodeverkV2}
      >
        <FormProvider {...formMethods}>{props.children}</FormProvider>
      </KodeverkProvider>
    );
  };

  it('skal vise periode og manuelle-vurderingstyper i form', () => {
    const perioder = [
      {
        fom: '2016-01-15',
        tom: '2016-10-15',
        dekning: 'FULL',
        status: 'FORELOPIG',
        beslutningsdato: '2016-10-16',
      },
    ];

    renderWithIntl(
      <Wrapper perioder={perioder}>
        <PerioderMedMedlemskapFaktaPanel readOnly={false} alleMerknaderFraBeslutter={{ notAccepted: false }} />
      </Wrapper>,
      { messages },
    );

    expect(screen.getByText('Full')).toBeInTheDocument();
    expect(screen.getByText('Foreløpig')).toBeInTheDocument();
    expect(screen.getByText('15.01.2016-15.10.2016')).toBeInTheDocument();
    expect(screen.getAllByRole('radio', { name: 'Ikke relevant periode' }).length).toBe(1);
    expect(screen.getAllByRole('radio', { name: 'Periode med medlemskap' }).length).toBe(1);
    expect(screen.getAllByRole('radio', { name: 'Periode med unntak fra medlemskap' }).length).toBe(1);
  });

  it('skal vise fødselsdato når en har dette', () => {
    const perioder = [
      {
        fom: '2016-01-15',
        tom: '2016-10-15',
        dekning: 'Full',
        status: 'Foreløpig',
        beslutningsdato: '2016-10-16',
      },
    ];

    renderWithIntl(
      <Wrapper perioder={perioder}>
        <PerioderMedMedlemskapFaktaPanel
          readOnly={false}
          fodselsdato="2016-10-16"
          alleMerknaderFraBeslutter={{ notAccepted: false }}
        />
      </Wrapper>,
      { messages },
    );

    expect(screen.getByText('Fødselsdato: 16.10.2016')).toBeInTheDocument();
  });

  it('skal vise tabell med medlemskapsperioder', () => {
    const perioder = [
      {
        fom: '2017-08-01',
        tom: '2017-08-31',
        dekning: 'Full',
        status: 'Foreløpig',
        beslutningsdato: '2017-06-01',
      },
    ];

    renderWithIntl(
      <Wrapper perioder={perioder}>
        <PerioderMedMedlemskapFaktaPanel readOnly={false} alleMerknaderFraBeslutter={{ notAccepted: false }} />
      </Wrapper>,
      { messages },
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('skal ikke vise tabell når det ikke finnes medlemskapsperioder', () => {
    const perioder = [];

    renderWithIntl(
      <Wrapper perioder={perioder}>
        <PerioderMedMedlemskapFaktaPanel readOnly={false} alleMerknaderFraBeslutter={{ notAccepted: false }} />
      </Wrapper>,
      { messages },
    );

    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('skal sette opp initielle verdier og sorterte perioder etter periodestart', () => {
    const periode: Periode = {
      aksjonspunkter: [aksjonspunktCodes.AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE],
      medlemskapManuellVurderingType: 'manuellType',
      id: '',
      vurderingsdato: '',
      årsaker: [],
      begrunnelse: '',
      personopplysninger: undefined,
      bosattVurdering: false,
      vurdertAv: '',
      vurdertTidspunkt: '',
      isBosattAksjonspunktClosed: false,
      isPeriodAksjonspunktClosed: false,
      dekningType: undefined,
    };
    const medlemskapPerioder: MedlemskapPeriode[] = [
      {
        fom: '2016-01-15',
        tom: '2016-10-15',
        dekningType: 'FTL_2_9_1_b',
        medlemskapType: 'ENDELIG',
        beslutningsdato: '2016-10-16',
        kildeType: undefined,
      },
      {
        fom: '2017-01-15',
        tom: '2017-10-15',
        dekningType: 'FTL_2_6',
        medlemskapType: 'FORELOPIG',
        beslutningsdato: '2017-10-16',
        kildeType: undefined,
      },
    ];

    const soknad: Soknad = {
      fodselsdatoer: ['2017-10-15'],
      oppgittFordeling: {
        startDatoForPermisjon: '',
      },
      oppgittTilknytning: {
        utlandsopphold: [],
      },
    };

    const aksjonspunkter: Aksjonspunkt[] = [
      {
        definisjon: aksjonspunktCodes.AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE,
        status: aksjonspunktStatus.OPPRETTET,
        kanLoses: false,
        erAktivt: false,
      },
    ];

    const initialValues = PerioderMedMedlemskapFaktaPanel.buildInitialValues(
      periode,
      medlemskapPerioder,
      soknad,
      aksjonspunkter,
    );

    expect(initialValues).toStrictEqual({
      fixedMedlemskapPerioder: [
        {
          fom: '2016-01-15',
          tom: '2016-10-15',
          dekning: 'FTL_2_9_1_b',
          status: 'ENDELIG',
          beslutningsdato: '2016-10-16',
        },
        {
          fom: '2017-01-15',
          tom: '2017-10-15',
          dekning: 'FTL_2_6',
          status: 'FORELOPIG',
          beslutningsdato: '2017-10-16',
        },
      ],
      isPeriodAksjonspunktClosed: false,
      medlemskapManuellVurderingType: 'manuellType',
      fodselsdato: '2017-10-15',
      hasPeriodeAksjonspunkt: true,
    });
  });
});
