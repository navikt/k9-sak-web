import React from 'react';
import { TableColumn } from '@fpsak-frontend/shared-components/index';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';
import Aktivitet from '../dto/Aktivitet';
import { UtfallEnum } from '../dto/Utfall';
import { VilkårEnum } from '../dto/Vilkår';
import AktivitetTabell from './AktivitetTabell';

describe('AktivitetTabell', () => {
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
        utbetalingsgrad: 0,
        vurderteVilkår: {
          vilkår: {
            [VilkårEnum.NOK_DAGER]: UtfallEnum.AVSLÅTT,
            [VilkårEnum.ALDERSVILKÅR_BARN]: UtfallEnum.INNVILGET,
          },
        },
      },
    ],
  };

  it('rendrer tabellrad med rett info', () => {
    const wrapper = shallow(
      <AktivitetTabell
        uttaksperioder={aktivitet.uttaksperioder}
        arbeidsforhold={aktivitet.arbeidsforhold}
        aktivitetsstatuser={[]}
      />,
    );
    const kolonner = wrapper.find(TableColumn);

    expect(kolonner).to.have.length(5);

    const kolonnerMedTekst = tekst => kolonner.findWhere(kolonne => kolonne.text() === tekst);
    const kolonnerMedFormatterTekstId = tekstId =>
      kolonner.find(FormattedMessage).findWhere(formatert => formatert.prop('id') === tekstId);

    expect(kolonnerMedTekst('01.03.2020 - 31.03.2020')).to.have.length(1);
    expect(kolonnerMedFormatterTekstId('Uttaksplan.Utfall.AVSLÅTT')).to.have.length(1);
    expect(kolonnerMedTekst('0%')).to.have.length(1);
    expect(kolonnerMedFormatterTekstId('Uttaksplan.FulltFravær')).to.have.length(1);
  });
});
