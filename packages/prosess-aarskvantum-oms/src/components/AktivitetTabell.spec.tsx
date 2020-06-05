import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';
import NavFrontendChevron from 'nav-frontend-chevron';
import Aktivitet from '../dto/Aktivitet';
import { UtfallEnum } from '../dto/Utfall';
import { VilkårEnum } from '../dto/Vilkår';
import AktivitetTabell from './AktivitetTabell';
import StyledColumn from './StyledColumn';

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
        hjemler: [],
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
    const kolonner = wrapper.find(StyledColumn);

    expect(kolonner).to.have.length(5);

    const kolonnerMedTekst = tekst => kolonner.findWhere(kolonne => kolonne.text() === tekst);
    const kolonnerMedFormatterTekstId = tekstId =>
      kolonner.find(FormattedMessage).findWhere(formatert => formatert.prop('id') === tekstId);

    expect(kolonnerMedTekst('01.03.2020 - 31.03.2020')).to.have.length(1);
    expect(kolonnerMedFormatterTekstId('Uttaksplan.Utfall.AVSLÅTT')).to.have.length(1);
    expect(kolonnerMedTekst('0%')).to.have.length(2);
    expect(kolonnerMedFormatterTekstId('Uttaksplan.FulltFravær')).to.have.length(1);
    expect(kolonner.find(NavFrontendChevron)).to.have.length(1);
  });
});
