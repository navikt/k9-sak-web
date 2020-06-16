import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl } from '../../i18n/intl-enzyme-test-helper-uttaksplan';
import Uttaksplan from './Uttaksplan';
import Aktivitet from '../dto/Aktivitet';
import { UtfallEnum } from '../dto/Utfall';
import { VilkårEnum } from '../dto/Vilkår';
import AktivitetTabell from './AktivitetTabell';

describe('Uttaksplan', () => {
  const aktivitet: Aktivitet = {
    arbeidsforhold: {
      arbeidsforholdId: '888',
      organisasjonsnummer: '999',
      type: 'selvstendig næringsdrivende',
    },
    uttaksperioder: [
      {
        utfall: UtfallEnum.AVSLÅTT,
        periode: '2020-03-01/2020-03-31',
        hjemler: [],
        utbetalingsgrad: 0,
        vurderteVilkår: {
          vilkår: {
            [VilkårEnum.NOK_DAGER]: UtfallEnum.INNVILGET,
            [VilkårEnum.ALDERSVILKÅR_BARN]: UtfallEnum.INNVILGET,
          },
        },
      },
    ],
  };
  it('rendrer en tabell per aktivitet', () => {
    const aktiviteter: Aktivitet[] = [aktivitet, aktivitet, aktivitet];
    const wrapper = shallowWithIntl(<Uttaksplan aktiviteterBehandling={aktiviteter} aktivitetsstatuser={[]} />);

    const tabell = wrapper.find(AktivitetTabell);

    expect(tabell).to.have.length(aktiviteter.length);
  });
});
