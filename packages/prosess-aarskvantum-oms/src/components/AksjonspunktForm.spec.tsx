import React from 'react';
import { expect } from 'chai';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { CheckboxField, RadioOption } from '@fpsak-frontend/form/index';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { shallowWithIntl } from '../../i18n/intl-enzyme-test-helper-uttaksplan';
import { FormContent, FormValues, transformValues } from './AksjonspunktForm';
import Uttaksperiode from '../dto/Uttaksperiode';
import { UtfallEnum } from '../dto/Utfall';
import { VilkårEnum } from '../dto/Vilkår';

describe('<AksjonspunktForm>', () => {
  const uavklartPeriode: Uttaksperiode = {
    utfall: UtfallEnum.UAVKLART,
    vurderteVilkår: {
      vilkår: {
        [VilkårEnum.ALDERSVILKÅR_BARN]: UtfallEnum.INNVILGET,
        [VilkårEnum.UIDENTIFISERT_RAMMEVEDTAK]: UtfallEnum.UAVKLART,
      },
    },
    periode: '2020-03-01/2020-03-10',
    utbetalingsgrad: 50,
    hjemler: [],
  };

  const innvilgetPeriode: Uttaksperiode = {
    utfall: UtfallEnum.INNVILGET,
    vurderteVilkår: {
      vilkår: {
        [VilkårEnum.ALDERSVILKÅR_BARN]: UtfallEnum.INNVILGET,
      },
    },
    delvisFravær: 'P2DT4H30M',
    periode: '2020-04-01/2020-04-30',
    utbetalingsgrad: 100,
    hjemler: [],
  };

  const avslåttPeriode: Uttaksperiode = {
    utfall: UtfallEnum.AVSLÅTT,
    vurderteVilkår: {
      vilkår: {
        [VilkårEnum.ALDERSVILKÅR_BARN]: UtfallEnum.INNVILGET,
        [VilkårEnum.NOK_DAGER]: UtfallEnum.AVSLÅTT,
      },
    },
    periode: '2020-03-01/2020-03-31',
    utbetalingsgrad: 0,
    hjemler: [],
  };

  describe('<FormContent>', () => {
    it('viser kun en checkbox hvis man har minst én uavklart periode', () => {
      const aktiviteter = [
        {
          arbeidsforhold: {
            arbeidsforholdId: '123',
            organisasjonsnummer: '456',
            type: 'AT',
          },
          uttaksperioder: [innvilgetPeriode, avslåttPeriode],
        },
        {
          arbeidsforhold: {
            arbeidsforholdId: '888',
            organisasjonsnummer: '999',
            type: 'SN',
          },
          uttaksperioder: [uavklartPeriode, innvilgetPeriode],
        },
      ];
      const wrapper = shallowWithIntl(
        <FormContent {...reduxFormPropsMock} aktiviteter={aktiviteter} rammevedtak={[]} />,
      );

      const checkbox = wrapper.find(CheckboxField);
      const radios = wrapper.find(RadioOption);

      expect(checkbox).to.have.length(1);
      expect(radios).to.have.length(0);
    });

    it('viser radios hvis man har minst én avslått periode og ingen uavklarte', () => {
      const aktiviteter = [
        {
          arbeidsforhold: {
            arbeidsforholdId: '123',
            organisasjonsnummer: '456',
            type: 'AT',
          },
          uttaksperioder: [innvilgetPeriode, avslåttPeriode],
        },
        {
          arbeidsforhold: {
            arbeidsforholdId: '888',
            organisasjonsnummer: '999',
            type: 'SN',
          },
          uttaksperioder: [innvilgetPeriode],
        },
      ];
      const wrapper = shallowWithIntl(
        <FormContent {...reduxFormPropsMock} aktiviteter={aktiviteter} rammevedtak={[]} />,
      );

      const checkbox = wrapper.find(CheckboxField);
      const radios = wrapper.find(RadioOption);

      expect(checkbox).to.have.length(0);
      expect(radios).to.have.length(2);
    });
  });

  describe('transformValues', () => {
    it('mapper valg', () => {
      const valgtReBehandling: FormValues = {
        valg: 'reBehandling',
        begrunnelse: 'Nei.',
      };

      const rebehandlingDto = transformValues(valgtReBehandling);

      expect(rebehandlingDto).to.eql([
        {
          fortsettBehandling: false,
          begrunnelse: valgtReBehandling.begrunnelse,
          kode: aksjonspunktCodes.VURDER_ÅRSKVANTUM_KVOTE,
        },
      ]);

      const valgtFortsett: FormValues = {
        valg: 'fortsett',
        begrunnelse: 'Ja.',
      };

      const fortsettDto = transformValues(valgtFortsett);

      expect(fortsettDto).to.eql([
        {
          fortsettBehandling: true,
          begrunnelse: valgtFortsett.begrunnelse,
          kode: aksjonspunktCodes.VURDER_ÅRSKVANTUM_KVOTE,
        },
      ]);
    });

    it('mapper bekreftelse til reBehandling', () => {
      const bekreftelse: FormValues = {
        bekreftInfotrygd: true,
      };

      const mappet = transformValues(bekreftelse);

      expect(mappet).to.eql([
        {
          fortsettBehandling: false,
          kode: aksjonspunktCodes.VURDER_ÅRSKVANTUM_KVOTE,
          begrunnelse: undefined,
        },
      ]);
    });
  });
});
