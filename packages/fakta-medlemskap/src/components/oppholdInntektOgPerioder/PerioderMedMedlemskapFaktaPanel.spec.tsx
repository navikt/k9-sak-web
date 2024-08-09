import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { Aksjonspunkt } from '@k9-sak-web/types';
import { screen } from '@testing-library/react';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import messages from '../../../i18n/nb_NO.json';
import { MedlemskapPeriode } from './Medlemskap';
import { Periode } from './Periode';
import PerioderMedMedlemskapFaktaPanel from './PerioderMedMedlemskapFaktaPanel';
import { Soknad } from './Soknad';

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

    return <FormProvider {...formMethods}>{props.children}</FormProvider>;
  };

  const manuelleVurderingstyper = [
    {
      kode: 'test1',
      kodeverk: '',
      navn: 'navn1',
    },
    {
      kode: 'test2',
      kodeverk: '',
      navn: 'navn2',
    },
  ];

  it('skal vise periode og manuelle-vurderingstyper i form', () => {
    const perioder = [
      {
        fom: '2016-01-15',
        tom: '2016-10-15',
        dekning: 'testdekning',
        status: 'testStatus',
        beslutningsdato: '2016-10-16',
      },
    ];

    renderWithIntl(
      <Wrapper perioder={perioder}>
        <PerioderMedMedlemskapFaktaPanel
          readOnly={false}
          alleKodeverk={{ [kodeverkTyper.MEDLEMSKAP_MANUELL_VURDERING_TYPE]: manuelleVurderingstyper }}
          alleMerknaderFraBeslutter={{ notAccepted: false }}
        />
      </Wrapper>,
      { messages },
    );

    expect(screen.getByText('testdekning')).toBeInTheDocument();
    expect(screen.getByText('testStatus')).toBeInTheDocument();
    expect(screen.getByText('15.01.2016-15.10.2016')).toBeInTheDocument();
    expect(screen.getAllByRole('radio', { name: /navn/i }).length).toBe(2);
  });

  it('skal vise fødselsdato når en har dette', () => {
    const perioder = [
      {
        fom: '2016-01-15',
        tom: '2016-10-15',
        dekning: 'testdekning',
        status: 'testStatus',
        beslutningsdato: '2016-10-16',
      },
    ];

    renderWithIntl(
      <Wrapper perioder={perioder}>
        <PerioderMedMedlemskapFaktaPanel
          readOnly={false}
          fodselsdato="2016-10-16"
          alleKodeverk={{ [kodeverkTyper.MEDLEMSKAP_MANUELL_VURDERING_TYPE]: manuelleVurderingstyper }}
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
        dekning: 'testDekning',
        status: 'testStatus',
        beslutningsdato: '2017-06-01',
      },
    ];

    renderWithIntl(
      <Wrapper perioder={perioder}>
        <PerioderMedMedlemskapFaktaPanel
          readOnly={false}
          alleKodeverk={{ [kodeverkTyper.MEDLEMSKAP_MANUELL_VURDERING_TYPE]: manuelleVurderingstyper }}
          alleMerknaderFraBeslutter={{ notAccepted: false }}
        />
      </Wrapper>,
      { messages },
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('skal ikke vise tabell når det ikke finnes medlemskapsperioder', () => {
    const perioder = [];

    renderWithIntl(
      <Wrapper perioder={perioder}>
        <PerioderMedMedlemskapFaktaPanel
          readOnly={false}
          alleKodeverk={{ [kodeverkTyper.MEDLEMSKAP_MANUELL_VURDERING_TYPE]: manuelleVurderingstyper }}
          alleMerknaderFraBeslutter={{ notAccepted: false }}
        />
      </Wrapper>,
      { messages },
    );

    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('skal sette opp initielle verdier og sorterte perioder etter periodestart', () => {
    const periode: Periode = {
      aksjonspunkter: [aksjonspunktCodes.AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE],
      medlemskapManuellVurderingType: { kode: 'manuellType', kodeverk: '' },
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
        dekningType: {
          kode: 'DEK_TYPE',
          kodeverk: '',
        },
        medlemskapType: {
          kode: 'M_STATUS',
          kodeverk: '',
        },
        beslutningsdato: '2016-10-16',
        kildeType: undefined,
      },
      {
        fom: '2017-01-15',
        tom: '2017-10-15',
        dekningType: {
          kode: 'DEK_TYPE2',
          kodeverk: '',
        },
        medlemskapType: {
          kode: 'M_STATUS2',
          kodeverk: '',
        },
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
        definisjon: {
          kode: aksjonspunktCodes.AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE,
          kodeverk: '',
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
          kodeverk: '',
        },
        kanLoses: false,
        erAktivt: false,
      },
    ];
    const getKodeverknavn = kodeverk => {
      if (kodeverk.kode === 'DEK_TYPE') {
        return 'testdekning';
      }
      if (kodeverk.kode === 'DEK_TYPE2') {
        return 'testdekning2017';
      }
      if (kodeverk.kode === 'M_STATUS') {
        return 'testStatus';
      }
      if (kodeverk.kode === 'M_STATUS2') {
        return 'testStatus2017';
      }
      return '';
    };
    const initialValues = PerioderMedMedlemskapFaktaPanel.buildInitialValues(
      periode,
      medlemskapPerioder,
      soknad,
      aksjonspunkter,
      getKodeverknavn,
    );

    expect(initialValues).toStrictEqual({
      fixedMedlemskapPerioder: [
        {
          fom: '2016-01-15',
          tom: '2016-10-15',
          dekning: 'testdekning',
          status: 'testStatus',
          beslutningsdato: '2016-10-16',
        },
        {
          fom: '2017-01-15',
          tom: '2017-10-15',
          dekning: 'testdekning2017',
          status: 'testStatus2017',
          beslutningsdato: '2017-10-16',
        },
      ],
      isPeriodAksjonspunktClosed: false,
      medlemskapManuellVurderingType: { kode: 'manuellType', kodeverk: '' },
      fodselsdato: '2017-10-15',
      hasPeriodeAksjonspunkt: true,
    });
  });
});
