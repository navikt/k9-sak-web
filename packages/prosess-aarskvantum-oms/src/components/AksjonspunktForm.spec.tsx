import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { FormValues, begrunnelseUavklartePerioder, transformValues } from './AksjonspunktForm9014';

describe('<AksjonspunktForm>', () => {
  describe('transformValues', () => {
    it('mapper valg', () => {
      const valgtReBehandling: FormValues = {
        valg: 'reBehandling',
        begrunnelse: 'Nei.',
      };

      const rebehandlingDto = transformValues(valgtReBehandling, aksjonspunktCodes.VURDER_ÅRSKVANTUM_KVOTE);

      expect(rebehandlingDto).toEqual([
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

      const fortsettDto = transformValues(valgtFortsett, aksjonspunktCodes.VURDER_ÅRSKVANTUM_KVOTE);

      expect(fortsettDto).toEqual([
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

      const mappet = transformValues(bekreftelse, aksjonspunktCodes.VURDER_ÅRSKVANTUM_KVOTE);

      expect(mappet).toEqual([
        {
          fortsettBehandling: false,
          kode: aksjonspunktCodes.VURDER_ÅRSKVANTUM_KVOTE,
          begrunnelse: begrunnelseUavklartePerioder,
        },
      ]);
    });
  });

  describe('fosterbarn', () => {
    it('uten fosterbarn', () => {
      const utenFosterbarn: FormValues = {
        valg: 'reBehandling',
        begrunnelse: 'Ja.',
        fosterbarn: [],
      };

      const utenFosterbarnDto = transformValues(utenFosterbarn, aksjonspunktCodes.VURDER_ÅRSKVANTUM_KVOTE);

      expect(utenFosterbarnDto).toEqual([
        {
          fortsettBehandling: false,
          begrunnelse: utenFosterbarn.begrunnelse,
          kode: aksjonspunktCodes.VURDER_ÅRSKVANTUM_KVOTE,
          fosterbarn: [],
        },
      ]);

      const medFosterbarn: FormValues = {
        valg: 'fortsett',
        begrunnelse: 'Ja.',
        fosterbarn: ['12345678910', '10987654321'],
      };

      const medFosterbarnDto = transformValues(medFosterbarn, aksjonspunktCodes.VURDER_ÅRSKVANTUM_KVOTE);

      expect(medFosterbarnDto).toEqual([
        {
          fortsettBehandling: true,
          begrunnelse: medFosterbarn.begrunnelse,
          kode: aksjonspunktCodes.VURDER_ÅRSKVANTUM_KVOTE,
          fosterbarn: ['12345678910', '10987654321'],
        },
      ]);
    });
  });

  describe('arskvantumFosterbarnFortsett', () => {
    it('Håndterer fortsettelse av 9014 riktig', () => {
      const formValues: FormValues = {
        valg: 'fortsett',
        begrunnelse: 'Ja.',
        fosterbarn: ['12345678910', '10987654321'],
      };

      const resultat = transformValues(formValues, aksjonspunktCodes.ÅRSKVANTUM_FOSTERBARN, ['12345678910']);

      expect(resultat).toEqual([
        {
          fortsettBehandling: true,
          begrunnelse: formValues.begrunnelse,
          kode: aksjonspunktCodes.ÅRSKVANTUM_FOSTERBARN,
          fosterbarn: ['12345678910'],
        },
      ]);
    });
  });

  describe('arskvantumFosterbarnRebehandling', () => {
    it('Håndterer rebehandling av 9014 riktig', () => {
      const formValues: FormValues = {
        valg: 'reBehandling',
        begrunnelse: 'Ja.',
        fosterbarn: ['12345678910', '10987654321'],
      };

      const resultat = transformValues(formValues, aksjonspunktCodes.ÅRSKVANTUM_FOSTERBARN, ['12345678910']);

      expect(resultat).toEqual([
        {
          fortsettBehandling: false,
          begrunnelse: formValues.begrunnelse,
          kode: aksjonspunktCodes.ÅRSKVANTUM_FOSTERBARN,
          fosterbarn: ['12345678910', '10987654321'],
        },
      ]);
    });
  });
});
