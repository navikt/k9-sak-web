import React from 'react';
import { expect } from 'chai';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { CheckboxField, RadioOption } from '@fpsak-frontend/form/index';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { shallowWithIntl } from '../../i18n/intl-enzyme-test-helper-uttaksplan';
import { begrunnelseUavklartePerioder, FormContent, FormValues, transformValues } from './AksjonspunktForm';

describe('<AksjonspunktForm>', () => {
  describe('<FormContent>', () => {
    it('viser kun en checkbox hvis man har minst én uavklart periode', () => {
      const wrapper = shallowWithIntl(
        <FormContent {...reduxFormPropsMock} harUavklartePerioder />,
      );

      const checkbox = wrapper.find(CheckboxField);
      const radios = wrapper.find(RadioOption);

      expect(checkbox).to.have.length(1);
      expect(radios).to.have.length(0);
    });

    it('viser radios hvis man ikke har uavklarte perioder', () => {
      const wrapper = shallowWithIntl(
        <FormContent {...reduxFormPropsMock} harUavklartePerioder={false} />,
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
