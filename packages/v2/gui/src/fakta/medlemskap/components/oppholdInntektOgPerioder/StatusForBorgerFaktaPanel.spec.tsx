import { AksjonspunktDtoDefinisjon } from '@k9-sak-web/backend/k9sak/generated';
import { aksjonspunktCodes } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktCodes.js';
import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import type { Aksjonspunkt } from '../../types/Aksjonspunkt';
import type { Periode } from '../../types/Periode';
import StatusForBorgerFaktaPanel, { buildInitialValuesStatusForBorgerFaktaPanel } from './StatusForBorgerFaktaPanel';

describe('<StatusForBorgerFaktaPanel>', () => {
  const Wrapper = (props: {
    apKode: string;
    erEosBorger: boolean;
    isBorgerAksjonspunktClosed: boolean;
    children: React.ReactNode;
  }) => {
    const formMethods = useForm({
      defaultValues: {
        oppholdInntektOgPeriodeForm: {
          apKode: props.apKode,
          erEosBorger: props.erEosBorger,
          isBorgerAksjonspunktClosed: props.isBorgerAksjonspunktClosed,
        },
      },
    });

    return <FormProvider {...formMethods}>{props.children}</FormProvider>;
  };
  it('skal vise radioknapper for vurdering av oppholdsrett', () => {
    render(
      <Wrapper apKode={aksjonspunktCodes.AVKLAR_OPPHOLDSRETT} erEosBorger isBorgerAksjonspunktClosed={false}>
        <StatusForBorgerFaktaPanel
          readOnly={false}
          alleMerknaderFraBeslutter={{ [AksjonspunktDtoDefinisjon.AVKLAR_OM_ER_BOSATT]: { notAccepted: false } }}
        />
      </Wrapper>,
    );

    expect(screen.getAllByRole('radio').length).toBe(4);
    expect(screen.getByRole('radio', { name: 'EØS borger' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Utenlandsk borger utenfor EØS' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Søker har oppholdsrett' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Søker har ikke oppholdsrett' })).toBeInTheDocument();
  });

  it('skal vise radioknapper for vurdering av lovlig opphold', () => {
    render(
      <Wrapper apKode={aksjonspunktCodes.AVKLAR_LOVLIG_OPPHOLD} erEosBorger={false} isBorgerAksjonspunktClosed={false}>
        <StatusForBorgerFaktaPanel
          readOnly={false}
          alleMerknaderFraBeslutter={{ [AksjonspunktDtoDefinisjon.AVKLAR_OM_ER_BOSATT]: { notAccepted: false } }}
        />
      </Wrapper>,
    );

    expect(screen.getAllByRole('radio').length).toBe(4);
    expect(screen.getByRole('radio', { name: 'EØS borger' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Utenlandsk borger utenfor EØS' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Søker har lovlig opphold' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Søker har ikke lovlig opphold' })).toBeInTheDocument();
  });

  it('skal sette initielle verdi når det er EØS borger og ingen vurdering er lagret', () => {
    const periode: Periode = {
      aksjonspunkter: [aksjonspunktCodes.AVKLAR_OPPHOLDSRETT],
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
      medlemskapManuellVurderingType: '',
      oppholdsrettVurdering: undefined,
      erEosBorger: true,
    };
    const aksjonspunkter: Aksjonspunkt[] = [
      {
        definisjon: aksjonspunktCodes.AVKLAR_OPPHOLDSRETT,
        status: 'UTFO',
        erAktivt: false,
      },
    ];
    const initialValues = buildInitialValuesStatusForBorgerFaktaPanel(periode, aksjonspunkter);

    expect(initialValues).toStrictEqual({
      apKode: aksjonspunktCodes.AVKLAR_OPPHOLDSRETT,
      erEosBorger: true,
      oppholdsrettVurdering: undefined,
      lovligOppholdVurdering: undefined,
      isBorgerAksjonspunktClosed: true,
    });
  });

  it('skal sette initielle verdi når det er EØS borger og vurdering er lagret', () => {
    const periode: Periode = {
      aksjonspunkter: [],
      erEosBorger: true,
      oppholdsrettVurdering: true,
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
      medlemskapManuellVurderingType: '',
    };

    const aksjonspunkter: Aksjonspunkt[] = [];

    const initialValues = buildInitialValuesStatusForBorgerFaktaPanel(periode, aksjonspunkter);

    expect(initialValues).toStrictEqual({
      apKode: '',
      erEosBorger: true,
      oppholdsrettVurdering: true,
      lovligOppholdVurdering: undefined,
      isBorgerAksjonspunktClosed: false,
    });
  });

  it('skal sette initielle verdi når regionkode ikke finnes men en har oppholdsrett-aksjonspunkt', () => {
    const periode: Periode = {
      aksjonspunkter: [aksjonspunktCodes.AVKLAR_OPPHOLDSRETT],
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
      erEosBorger: true,
      medlemskapManuellVurderingType: '',
      oppholdsrettVurdering: false,
    };
    const aksjonspunkter: Aksjonspunkt[] = [
      {
        definisjon: aksjonspunktCodes.AVKLAR_OPPHOLDSRETT,
        status: 'UTFO',
        erAktivt: false,
      },
    ];

    const initialValues = buildInitialValuesStatusForBorgerFaktaPanel(periode, aksjonspunkter);

    expect(initialValues).toStrictEqual({
      apKode: aksjonspunktCodes.AVKLAR_OPPHOLDSRETT,
      erEosBorger: true,
      oppholdsrettVurdering: false,
      lovligOppholdVurdering: undefined,
      isBorgerAksjonspunktClosed: true,
    });
  });

  it('skal sette initielle verdi når det ikke er EØS borger', () => {
    const periode: Periode = {
      aksjonspunkter: [aksjonspunktCodes.AVKLAR_OPPHOLDSRETT],
      erEosBorger: false,
      lovligOppholdVurdering: false,
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

      medlemskapManuellVurderingType: '',
      oppholdsrettVurdering: undefined,
    };
    const aksjonspunkter: Aksjonspunkt[] = [];

    const initialValues = buildInitialValuesStatusForBorgerFaktaPanel(periode, aksjonspunkter);

    expect(initialValues).toStrictEqual({
      apKode: '',
      erEosBorger: false,
      oppholdsrettVurdering: undefined,
      lovligOppholdVurdering: false,
      isBorgerAksjonspunktClosed: false,
    });
  });
});
