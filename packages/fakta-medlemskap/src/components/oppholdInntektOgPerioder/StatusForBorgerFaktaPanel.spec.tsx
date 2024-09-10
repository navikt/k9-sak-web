import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { Aksjonspunkt } from '@k9-sak-web/types';
import { screen } from '@testing-library/react';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Periode } from './Periode';
import StatusForBorgerFaktaPanel from './StatusForBorgerFaktaPanel';

import messages from '../../../i18n/nb_NO.json';

describe('<StatusForBorgerFaktaPanel>', () => {
  const Wrapper = props => {
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
    renderWithIntl(
      <Wrapper apKode={aksjonspunktCodes.AVKLAR_OPPHOLDSRETT} erEosBorger isBorgerAksjonspunktClosed={false}>
        <StatusForBorgerFaktaPanel readOnly={false} alleMerknaderFraBeslutter={{ notAccepted: false }} />
      </Wrapper>,
      { messages },
    );

    expect(screen.getAllByRole('radio').length).toBe(4);
    expect(screen.getByRole('radio', { name: 'EØS borger' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Utenlandsk borger utenfor EØS' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Søker har oppholdsrett' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Søker har ikke oppholdsrett' })).toBeInTheDocument();
  });

  it('skal vise radioknapper for vurdering av lovlig opphold', () => {
    renderWithIntl(
      <Wrapper apKode={aksjonspunktCodes.AVKLAR_LOVLIG_OPPHOLD} erEosBorger={false} isBorgerAksjonspunktClosed={false}>
        <StatusForBorgerFaktaPanel readOnly={false} alleMerknaderFraBeslutter={{ notAccepted: false }} />
      </Wrapper>,
      { messages },
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
      personopplysninger: undefined,
      bosattVurdering: false,
      vurdertAv: '',
      vurdertTidspunkt: '',
      isBosattAksjonspunktClosed: false,
      isPeriodAksjonspunktClosed: false,
      dekningType: undefined,
      medlemskapManuellVurderingType: undefined,
      oppholdsrettVurdering: undefined,
    };
    const aksjonspunkter: Aksjonspunkt[] = [
      {
        definisjon: aksjonspunktCodes.AVKLAR_OPPHOLDSRETT,
        status: 'UTFO',
        kanLoses: false,
        erAktivt: false,
      },
    ];
    const initialValues = StatusForBorgerFaktaPanel.buildInitialValues(periode, aksjonspunkter);

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
      personopplysninger: undefined,
      bosattVurdering: false,
      vurdertAv: '',
      vurdertTidspunkt: '',
      isBosattAksjonspunktClosed: false,
      isPeriodAksjonspunktClosed: false,
      dekningType: undefined,
      medlemskapManuellVurderingType: undefined,
    };

    const aksjonspunkter = [];

    const initialValues = StatusForBorgerFaktaPanel.buildInitialValues(periode, aksjonspunkter);

    expect(initialValues).toStrictEqual({
      apKode: undefined,
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
      personopplysninger: undefined,
      bosattVurdering: false,
      vurdertAv: '',
      vurdertTidspunkt: '',
      isBosattAksjonspunktClosed: false,
      isPeriodAksjonspunktClosed: false,
      dekningType: undefined,
      medlemskapManuellVurderingType: undefined,
      oppholdsrettVurdering: false,
    };
    const aksjonspunkter: Aksjonspunkt[] = [
      {
        definisjon: aksjonspunktCodes.AVKLAR_OPPHOLDSRETT,
        status: 'UTFO',
        kanLoses: false,
        erAktivt: false,
      },
    ];

    const initialValues = StatusForBorgerFaktaPanel.buildInitialValues(periode, aksjonspunkter);

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
      personopplysninger: undefined,
      bosattVurdering: false,
      vurdertAv: '',
      vurdertTidspunkt: '',
      isBosattAksjonspunktClosed: false,
      isPeriodAksjonspunktClosed: false,
      dekningType: undefined,
      medlemskapManuellVurderingType: undefined,
      oppholdsrettVurdering: undefined,
    };
    const aksjonspunkter = [];

    const initialValues = StatusForBorgerFaktaPanel.buildInitialValues(periode, aksjonspunkter);

    expect(initialValues).toStrictEqual({
      apKode: undefined,
      erEosBorger: false,
      oppholdsrettVurdering: undefined,
      lovligOppholdVurdering: false,
      isBorgerAksjonspunktClosed: false,
    });
  });
});
