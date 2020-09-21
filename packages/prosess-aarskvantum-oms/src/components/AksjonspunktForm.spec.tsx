import React from 'react';
import { expect } from 'chai';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { CheckboxField, RadioOption } from '@fpsak-frontend/form/index';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { shallowWithIntl } from '../../i18n';
import { begrunnelseUavklartePerioder, FormContent, FormValues, transformValues } from './AksjonspunktForm';
import Uttaksperiode from '../dto/Uttaksperiode';
import { UtfallEnum } from '../dto/Utfall';
import { VilkårEnum } from '../dto/Vilkår';
import Aktivitet from '../dto/Aktivitet';

describe('<AksjonspunktForm>', () => {
  const uavklartPeriode: Uttaksperiode = {
    utfall: UtfallEnum.UAVKLART,
    periode: '2020-03-01/2020-03-31',
    utbetalingsgrad: 0,
    hjemler: [],
    vurderteVilkår: {
      vilkår: {
        [VilkårEnum.NOK_DAGER]: UtfallEnum.UAVKLART,
      },
    },
  };

  const innvilgetPeriode: Uttaksperiode = {
    utfall: UtfallEnum.INNVILGET,
    periode: '2020-03-01/2020-03-31',
    utbetalingsgrad: 100,
    hjemler: [],
    vurderteVilkår: {
      vilkår: {
        [VilkårEnum.ALDERSVILKÅR_BARN]: UtfallEnum.INNVILGET,
      },
    },
  };

  describe('<FormContent>', () => {
    it('viser kun en checkbox hvis man har minst én uavklart periode', () => {
      const aktiviteter: Aktivitet[] = [
        {
          uttaksperioder: [uavklartPeriode],
          arbeidsforhold: { type: 'AT' },
        },
        {
          uttaksperioder: [innvilgetPeriode],
          arbeidsforhold: { type: 'AT' },
        },
      ];
      const wrapper = shallowWithIntl(
        <FormContent {...reduxFormPropsMock} aktiviteter={aktiviteter} isAksjonspunktOpen />,
      );

      const checkbox = wrapper.find(CheckboxField);
      const radios = wrapper.find(RadioOption);

      expect(checkbox).to.have.length(1);
      expect(radios).to.have.length(0);
    });

    it('viser radios hvis man ikke har uavklarte perioder', () => {
      const aktiviteter: Aktivitet[] = [
        {
          uttaksperioder: [innvilgetPeriode],
          arbeidsforhold: { type: 'AT' },
        },
        {
          uttaksperioder: [innvilgetPeriode],
          arbeidsforhold: { type: 'AT' },
        },
      ];
      const wrapper = shallowWithIntl(
        <FormContent {...reduxFormPropsMock} aktiviteter={aktiviteter} isAksjonspunktOpen />,
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
          begrunnelse: begrunnelseUavklartePerioder,
        },
      ]);
    });
  });
});
