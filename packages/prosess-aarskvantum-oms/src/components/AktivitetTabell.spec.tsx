import { TableRow } from '@fpsak-frontend/shared-components';
import React from 'react';
import { shallow } from 'enzyme';
import { Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import NavFrontendChevron from 'nav-frontend-chevron';
import { Arbeidsforhold, UtfallEnum, VilkårEnum } from '@k9-sak-web/types';
import Aktivitet from '../dto/Aktivitet';
import AktivitetTabell from './AktivitetTabell';
import Utfall from './Utfall';

describe('<AktivitetTabell />', () => {
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
            [VilkårEnum.ARBEIDSFORHOLD]: UtfallEnum.AVSLÅTT,
            [VilkårEnum.NOK_DAGER]: UtfallEnum.AVSLÅTT,
            [VilkårEnum.ALDERSVILKÅR_BARN]: UtfallEnum.INNVILGET,
          },
        },
      },
    ],
  };

  // @ts-ignore
  const arbeidsforhold: Arbeidsforhold = {
    navn: 'Bedrift AS',
    arbeidsgiverIdentifiktorGUI: '999',
    eksternArbeidsforholdId: '1',
    arbeidsforholdId: '123',
  };

  it('rendrer tabellrad med rett info', () => {
    const wrapper = shallow(
      <AktivitetTabell
        uttaksperioder={aktivitet.uttaksperioder}
        arbeidsforholdtypeKode="AT"
        arbeidsforhold={arbeidsforhold}
        aktivitetsstatuser={[]}
        arbeidsgiverOpplysningerPerId={{}}
      />,
    );
    const kolonner = wrapper.find('td');

    expect(kolonner).toHaveLength(5);

    const kolonnerMedTekst = tekst => kolonner.findWhere(kolonne => kolonne.text() === tekst);
    const kolonnerMedFormatterTekstId = tekstId =>
      kolonner.find(FormattedMessage).findWhere(formatert => formatert.prop('id') === tekstId);

    expect(kolonnerMedTekst('01.03.2020 - 31.03.2020')).toHaveLength(1);
    const uttak = kolonner.find(Utfall);
    expect(uttak.prop('utfall')).toBe('AVSLÅTT');
    expect(kolonnerMedTekst('0%')).toHaveLength(2);
    expect(kolonnerMedFormatterTekstId('Uttaksplan.FulltFravær')).toHaveLength(1);
    expect(kolonner.find(NavFrontendChevron)).toHaveLength(1);
  });

  it('Klikk expandknapp rendrer detaljer og viser vilkår om arbeidsforhold sist', () => {
    const wrapper = shallow(
      <AktivitetTabell
        uttaksperioder={aktivitet.uttaksperioder}
        arbeidsforhold={arbeidsforhold}
        arbeidsforholdtypeKode="AT"
        aktivitetsstatuser={[]}
        arbeidsgiverOpplysningerPerId={{}}
      />,
    );

    expect(wrapper.find(TableRow)).toHaveLength(aktivitet.uttaksperioder.length);
    wrapper.find('button').simulate('click');

    const expandedContent = wrapper.find(TableRow);

    expect(expandedContent).toHaveLength(aktivitet.uttaksperioder.length * 3);

    const vilkår = expandedContent.at(2).find(Normaltekst);

    expect(vilkår).toHaveLength(3);
    expect(vilkår.last().find(FormattedMessage).prop('id')).toBe('Uttaksplan.Vilkår.ARBEIDSFORHOLD_AVSLÅTT');
  });
});
