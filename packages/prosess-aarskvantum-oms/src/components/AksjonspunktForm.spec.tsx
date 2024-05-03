import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import { UtfallEnum, Uttaksperiode, VilkårEnum } from '@k9-sak-web/types';
import { FraværÅrsakEnum } from '@k9-sak-web/types/src/omsorgspenger/Uttaksperiode';
import { reduxFormPropsMock } from '@k9-sak-web/utils-test/redux-form-test-helper';
import { renderWithIntlAndReduxForm } from '@k9-sak-web/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../i18n/nb_NO.json';
import Aktivitet from '../dto/Aktivitet';
import { FormContent, FormValues, begrunnelseUavklartePerioder, transformValues } from './AksjonspunktForm9014';

describe('<AksjonspunktForm>', () => {
  const uavklartPeriode: Uttaksperiode = {
    utfall: UtfallEnum.UAVKLART,
    fraværÅrsak: FraværÅrsakEnum.ORDINÆRT_FRAVÆR,
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
    fraværÅrsak: FraværÅrsakEnum.ORDINÆRT_FRAVÆR,
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
      renderWithIntlAndReduxForm(
        <FormContent
          {...reduxFormPropsMock}
          aktiviteter={aktiviteter}
          isAksjonspunktOpen
          fosterbarn={[]}
          aksjonspunktKode={aksjonspunktCodes.VURDER_ÅRSKVANTUM_KVOTE}
          valgValue={null}
        />,
        { messages },
      );

      expect(
        screen.getByText(
          'Det finnes overlappende perioder i Infotrygd. Annuller perioden i Infotrygd og kjør behandlingen på nytt.',
        ),
      ).toBeInTheDocument();
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      expect(screen.queryByRole('radio')).not.toBeInTheDocument();
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
      renderWithIntlAndReduxForm(
        <FormContent
          {...reduxFormPropsMock}
          aktiviteter={aktiviteter}
          isAksjonspunktOpen
          fosterbarn={[]}
          aksjonspunktKode={aksjonspunktCodes.VURDER_ÅRSKVANTUM_KVOTE}
          valgValue={null}
        />,
        { messages },
      );

      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
      expect(screen.getAllByRole('radio').length).toBe(2);
    });
  });

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
