import React from 'react';
import TableColumn from '@fpsak-frontend/shared-components/src/table/TableColumn';
import { FormattedMessage } from 'react-intl';
import IngenArbeidsforholdRegistrert from './IngenArbeidsforholdRegistrert';
import shallowWithIntl from '../../../i18n/intl-enzyme-test-helper-fakta-arbeidsforhold';

describe('<IngenArbeidsforholdRegistrert>', () => {
  const headerColumnContent = [
    <span>PersonArbeidsforholdTable.Arbeidsforhold</span>,
    <span>PersonArbeidsforholdTable.Periode</span>,
    <span>PersonArbeidsforholdTable.Kilde</span>,
    <span>PersonArbeidsforholdTable.Stillingsprosent</span>,
    <span>PersonArbeidsforholdTable.MottattDato</span>,
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <></>,
  ];
  it('Skal sjekke at IngenArbeidsforholdRegistrert rendrer korrekt', () => {
    const wrapper = shallowWithIntl(<IngenArbeidsforholdRegistrert headerColumnContent={headerColumnContent} />);
    expect(wrapper.find(TableColumn)).toHaveLength(6);
    // @ts-ignore
    expect(wrapper.find(FormattedMessage).props().id).toEqual(
      'PersonArbeidsforholdTable.IngenArbeidsforholdRegistrert',
    );
  });
});
