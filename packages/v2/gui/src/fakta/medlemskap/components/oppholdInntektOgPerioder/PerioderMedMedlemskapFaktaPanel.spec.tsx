import {
  AksjonspunktDtoDefinisjon,
  BehandlingAksjonspunktDtoBehandlingType,
} from '@k9-sak-web/backend/k9sak/generated';
import { aksjonspunktCodes } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktCodes.js';
import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import alleKodeverkV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';
import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { KodeverkProvider } from '../../../../kodeverk';
import type { Aksjonspunkt } from '../../types/Aksjonspunkt';
import type { PerioderMedMedlemskapFaktaPanelFormState } from '../../types/FormState';
import type { MedlemskapPeriode } from '../../types/Medlemskap';
import type { Periode } from '../../types/Periode';
import type { Søknad } from '../../types/Søknad';
import PerioderMedMedlemskapFaktaPanel, {
  buildInitialValuesPerioderMedMedlemskapFaktaPanel,
} from './PerioderMedMedlemskapFaktaPanel';

describe('<PerioderMedMedlemskapFaktaPanel>', () => {
  const Wrapper = (props: {
    children: React.ReactNode;
    perioder?: PerioderMedMedlemskapFaktaPanelFormState['fixedMedlemskapPerioder'];
  }) => {
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
        behandlingType={BehandlingAksjonspunktDtoBehandlingType.FØRSTEGANGSSØKNAD}
        kodeverk={alleKodeverkV2}
        klageKodeverk={{}}
        tilbakeKodeverk={{}}
      >
        <FormProvider {...formMethods}>{props.children}</FormProvider>
      </KodeverkProvider>
    );
  };

  it('skal vise periode og manuelle-vurderingstyper i form', () => {
    const perioder: PerioderMedMedlemskapFaktaPanelFormState['fixedMedlemskapPerioder'] = [
      {
        fom: '2016-01-15',
        tom: '2016-10-15',
        dekning: 'testdekning',
        status: 'testStatus',
        beslutningsdato: '2016-10-16',
      },
    ];

    render(
      <Wrapper perioder={perioder}>
        <PerioderMedMedlemskapFaktaPanel
          readOnly={false}
          alleMerknaderFraBeslutter={{ [AksjonspunktDtoDefinisjon.AVKLAR_OM_ER_BOSATT]: { notAccepted: false } }}
        />
      </Wrapper>,
    );

    expect(screen.getByText('15.01.2016 - 15.10.2016')).toBeInTheDocument();
    expect(screen.getAllByRole('radio').length).toBe(3);
  });

  it('skal vise fødselsdato når en har dette', () => {
    const perioder: PerioderMedMedlemskapFaktaPanelFormState['fixedMedlemskapPerioder'] = [
      {
        fom: '2016-01-15',
        tom: '2016-10-15',
        dekning: 'testdekning',
        status: 'testStatus',
        beslutningsdato: '2016-10-16',
      },
    ];

    render(
      <Wrapper perioder={perioder}>
        <PerioderMedMedlemskapFaktaPanel
          readOnly={false}
          fodselsdato="2016-10-16"
          alleMerknaderFraBeslutter={{ [AksjonspunktDtoDefinisjon.AVKLAR_OM_ER_BOSATT]: { notAccepted: false } }}
        />
      </Wrapper>,
    );

    expect(screen.getByText('Fødselsdato: 16.10.2016')).toBeInTheDocument();
  });

  it('skal vise tabell med medlemskapsperioder', () => {
    const perioder: PerioderMedMedlemskapFaktaPanelFormState['fixedMedlemskapPerioder'] = [
      {
        fom: '2017-08-01',
        tom: '2017-08-31',
        dekning: 'testDekning',
        status: 'testStatus',
        beslutningsdato: '2017-06-01',
      },
    ];

    render(
      <Wrapper perioder={perioder}>
        <PerioderMedMedlemskapFaktaPanel
          readOnly={false}
          alleMerknaderFraBeslutter={{ [AksjonspunktDtoDefinisjon.AVKLAR_OM_ER_BOSATT]: { notAccepted: false } }}
        />
      </Wrapper>,
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('skal ikke vise tabell når det ikke finnes medlemskapsperioder', () => {
    render(
      <Wrapper>
        <PerioderMedMedlemskapFaktaPanel
          readOnly={false}
          alleMerknaderFraBeslutter={{ [AksjonspunktDtoDefinisjon.AVKLAR_OM_ER_BOSATT]: { notAccepted: false } }}
        />
      </Wrapper>,
    );

    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('skal sette opp initielle verdier og sorterte perioder etter periodestart', () => {
    const periode: Periode = {
      aksjonspunkter: [aksjonspunktCodes.AVKLAR_GYLDIG_MEDLEMSKAPSPERIODE],
      medlemskapManuellVurderingType: 'manuellType',
      id: '',
      vurderingsdato: '',
      årsaker: [],
      begrunnelse: '',
      personopplysninger: {},
      bosattVurdering: false,
      vurdertAv: '',
      vurdertTidspunkt: '',
      isBosattAksjonspunktClosed: false,
      isPeriodAksjonspunktClosed: false,
      erEosBorger: false,
    };
    const medlemskapPerioder: MedlemskapPeriode[] = [
      {
        fom: '2016-01-15',
        tom: '2016-10-15',
        dekningType: 'DEK_TYPE',
        medlemskapType: 'M_STATUS',
        beslutningsdato: '2016-10-16',
        kildeType: '',
      },
      {
        fom: '2017-01-15',
        tom: '2017-10-15',
        dekningType: 'DEK_TYPE2',
        medlemskapType: 'M_STATUS2',
        beslutningsdato: '2017-10-16',
        kildeType: '',
      },
    ];

    const soknad: Søknad = {
      fodselsdatoer: ['2017-10-15'],
      oppgittTilknytning: {
        utlandsopphold: [],
      },
    };

    const aksjonspunkter: Aksjonspunkt[] = [
      {
        definisjon: aksjonspunktCodes.AVKLAR_GYLDIG_MEDLEMSKAPSPERIODE,
        status: aksjonspunktStatus.OPPRETTET,
        erAktivt: false,
      },
    ];

    const initialValues = buildInitialValuesPerioderMedMedlemskapFaktaPanel(
      medlemskapPerioder,
      soknad,
      aksjonspunkter,
      periode,
    );

    expect(initialValues).toStrictEqual({
      fixedMedlemskapPerioder: [
        {
          fom: '2016-01-15',
          tom: '2016-10-15',
          dekning: 'DEK_TYPE',
          status: 'M_STATUS',
          beslutningsdato: '2016-10-16',
        },
        {
          fom: '2017-01-15',
          tom: '2017-10-15',
          dekning: 'DEK_TYPE2',
          status: 'M_STATUS2',
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
