import React from 'react';
import { DateLabel, Image, PeriodLabel, Table, TableColumn, TableRow } from '@fpsak-frontend/shared-components';
import arbeidsforholdHandlingType from '@fpsak-frontend/kodeverk/src/arbeidsforholdHandlingType';
import { Normaltekst } from 'nav-frontend-typografi';
import mountWithIntl, { intlMock } from '../../../i18n/intl-enzyme-test-helper-fakta-arbeidsforhold';
import PersonArbeidsforholdTable from './PersonArbeidsforholdTable';
import IngenArbeidsforholdRegistrert from './IngenArbeidsforholdRegistrert';
import PersonArbeidsforholdDetailForm from '../arbeidsforholdDetaljer/PersonArbeidsforholdDetailForm';

describe('<PersonArbeidsforholdTable>', () => {
  const arbeidsforhold = {
    id: '1',
    arbeidsforhold: {
      eksternArbeidsforholdId: '1231-2345',
      internArbeidsforholdId: null,
    },
    arbeidsgiver: {
      arbeidsgiverOrgnr: '1234567',
      arbeidsgiverAktørId: null,
    },
    perioder: [
      {
        fom: '2018-01-01',
        tom: '2018-10-10',
      },
    ],
    kilde: ['INNTEKT'],
    handlingType: 'BRUK',
    aksjonspunktÅrsaker: ['INNTEKTSMELDING_UTEN_ARBEIDSFORHOLD'],
    inntektsmeldinger: [],
    yrkestittel: 'Vaktmester',
    stillingsprosent: 80,
  };

  const arbeidsforhold2 = {
    id: '2',
    arbeidsforhold: {
      eksternArbeidsforholdId: null,
      internArbeidsforholdId: '4532-2345',
    },
    arbeidsgiver: {
      arbeidsgiverOrgnr: '234567',
      arbeidsgiverAktørId: null,
    },
    perioder: [
      {
        fom: '2018-01-01',
        tom: '2018-10-10',
      },
    ],
    kilde: ['INNTEKT'],
    handlingType: 'BRUK',
    aksjonspunktÅrsaker: ['INNTEKTSMELDING_UTEN_ARBEIDSFORHOLD'],
    inntektsmeldinger: [],
  };

  it('skal vise tabell med to arbeidsforhold der den ene raden er markert som valgt', () => {
    const wrapper = mountWithIntl(
      <PersonArbeidsforholdTable
        harAksjonspunktAvklarArbeidsforhold
        intl={intlMock}
        alleArbeidsforhold={[arbeidsforhold, arbeidsforhold2]}
        selectedId={arbeidsforhold.id}
        alleKodeverk={{}}
        behandlingId={1}
        behandlingVersjon={2}
        updateArbeidsforhold={() => undefined}
      />,
    );

    const table = wrapper.find(Table);
    expect(table).toHaveLength(1);

    const rows = table.find(TableRow);
    expect(rows).toHaveLength(2);
    const row1 = rows.at(0);
    expect(row1.prop('isSelected')).toBe(true);
    const colsRow1 = row1.find(TableColumn);
    expect(colsRow1).toHaveLength(6);
    expect(colsRow1.first().childAt(0).childAt(0).text()).toEqual('Vaktmester (...2345)');
    expect(colsRow1.at(1).find(PeriodLabel)).toHaveLength(1);
    expect(colsRow1.at(3).childAt(0).childAt(0).text()).toEqual('80.00 %');

    const row2 = rows.last();
    expect(row2.prop('isSelected')).toBe(false);
  });

  it('skal ikke vise mottatt dato for inntektsmelding når denne ikke finnes', () => {
    const wrapper = mountWithIntl(
      <PersonArbeidsforholdTable
        harAksjonspunktAvklarArbeidsforhold
        intl={intlMock}
        alleArbeidsforhold={[arbeidsforhold]}
        selectedId={arbeidsforhold.id}
        alleKodeverk={{}}
        behandlingId={1}
        behandlingVersjon={2}
        updateArbeidsforhold={() => undefined}
      />,
    );

    const cols = wrapper.find(TableColumn);

    expect(cols).toHaveLength(6);
    expect(cols.at(4).children()).toHaveLength(0);
  });

  it('skal vise mottatt dato for inntektsmelding når denne finnes', () => {
    const newArbeidsforhold = {
      ...arbeidsforhold,
      inntektsmeldinger: [
        {
          mottattTidspunkt: '2018-05-05',
        },
      ],
    };
    const wrapper = mountWithIntl(
      <PersonArbeidsforholdTable
        harAksjonspunktAvklarArbeidsforhold
        intl={intlMock}
        alleArbeidsforhold={[newArbeidsforhold]}
        selectedId={newArbeidsforhold.id}
        alleKodeverk={{}}
        behandlingId={1}
        behandlingVersjon={2}
        updateArbeidsforhold={() => undefined}
      />,
    );
    const cols = wrapper.find(TableColumn);
    expect(cols).toHaveLength(6);
    expect(wrapper.find(DateLabel).prop('dateString')).toEqual('2018-05-05');
  });

  it('skal ikke vise ikon for at arbeidsforholdet er i bruk', () => {
    const newArbeidsforhold = {
      ...arbeidsforhold,
      handlingType: arbeidsforholdHandlingType.IKKE_BRUK,
      aksjonspunktÅrsaker: [],
    };
    const wrapper = mountWithIntl(
      <PersonArbeidsforholdTable
        harAksjonspunktAvklarArbeidsforhold
        intl={intlMock}
        alleArbeidsforhold={[newArbeidsforhold]}
        selectedId={arbeidsforhold.id}
        alleKodeverk={{}}
        behandlingId={1}
        behandlingVersjon={2}
        updateArbeidsforhold={() => undefined}
      />,
    );

    const cols = wrapper.find(TableColumn);
    expect(cols).toHaveLength(6);
    expect(cols.last().children()).toHaveLength(0);
  });

  it('skal vise ikon for at arbeidsforholdet er i bruk', () => {
    const newArbeidsforhold = {
      ...arbeidsforhold,
      handlingType: arbeidsforholdHandlingType.BRUK,
      aksjonspunktÅrsaker: [],
    };

    const wrapper = mountWithIntl(
      <PersonArbeidsforholdTable
        harAksjonspunktAvklarArbeidsforhold={false}
        intl={intlMock}
        alleArbeidsforhold={[newArbeidsforhold]}
        selectedId={newArbeidsforhold.id}
        alleKodeverk={{}}
        behandlingId={1}
        behandlingVersjon={2}
        updateArbeidsforhold={() => undefined}
      />,
    );

    const cols = wrapper.find(TableColumn);
    expect(cols).toHaveLength(6);
    expect(cols.last().find(Image)).toHaveLength(1);
  });

  it('skal vise IngenArbeidsforholdRegistrert komponent når ingen arbeidsforhold', () => {
    const wrapper = mountWithIntl(
      <PersonArbeidsforholdTable
        harAksjonspunktAvklarArbeidsforhold
        intl={intlMock}
        alleArbeidsforhold={[]}
        selectedId={undefined}
        alleKodeverk={{}}
        behandlingId={1}
        behandlingVersjon={2}
        updateArbeidsforhold={() => undefined}
      />,
    );
    const element = wrapper.find(IngenArbeidsforholdRegistrert);
    expect(element).toHaveLength(1);
  });

  it('skal vise stillingsprosent selv når den er 0', () => {
    const endretArbeidsforhold = {
      ...arbeidsforhold,
      stillingsprosent: 0,
    };
    const wrapper = mountWithIntl(
      <PersonArbeidsforholdTable
        harAksjonspunktAvklarArbeidsforhold
        intl={intlMock}
        alleArbeidsforhold={[endretArbeidsforhold]}
        selectedId={undefined}
        alleKodeverk={{}}
        behandlingId={1}
        behandlingVersjon={2}
        updateArbeidsforhold={() => undefined}
      />,
    );
    const tableRow = wrapper.find(TableRow).at(0);
    expect(tableRow.props().model.stillingsprosent).toEqual(0);
  });

  it('skal vise riktig utledet yrkestittel når lagt til av saksbehandler', () => {
    const endretArbeidsforhold = {
      ...arbeidsforhold,
      handlingType: arbeidsforholdHandlingType.BASERT_PÅ_INNTEKTSMELDING,
      yrkestittel: 'Lærer',
    };
    const wrapper = mountWithIntl(
      <PersonArbeidsforholdTable
        harAksjonspunktAvklarArbeidsforhold
        intl={intlMock}
        alleArbeidsforhold={[endretArbeidsforhold]}
        selectedId={undefined}
        alleKodeverk={{}}
        behandlingId={1}
        behandlingVersjon={2}
        updateArbeidsforhold={() => undefined}
      />,
    );
    const tableRow = wrapper.find(TableRow).at(0);
    const tekst = tableRow.find(Normaltekst).at(0);
    expect(tekst.childAt(0).text()).toEqual('Lærer (...2345)');
  });

  it('skal vise tom dato', () => {
    const endretArbeidsforhold = {
      ...arbeidsforhold,
    };
    const wrapper = mountWithIntl(
      <PersonArbeidsforholdTable
        harAksjonspunktAvklarArbeidsforhold
        intl={intlMock}
        alleArbeidsforhold={[endretArbeidsforhold]}
        selectedId={undefined}
        alleKodeverk={{}}
        behandlingId={1}
        behandlingVersjon={2}
        updateArbeidsforhold={() => undefined}
      />,
    );
    const periodeLabel = wrapper.find(PeriodLabel);
    expect(periodeLabel.props().dateStringTom).toEqual('2018-10-10');
  });

  it('arbeidsforhold en med arbeidsforholdId og en uten, skal få ulik nøkkel', () => {
    const arbfor1 = { ...arbeidsforhold };
    arbfor1.arbeidsforhold.eksternArbeidsforholdId = '123';
    arbfor1.arbeidsforhold.internArbeidsforholdId = null;

    const arbfor2 = { ...arbeidsforhold2 };
    arbfor2.arbeidsforhold.eksternArbeidsforholdId = null;
    arbfor2.arbeidsforhold.internArbeidsforholdId = '345';

    expect(arbfor1.id).not.toEqual(arbfor2.id);
  });

  it('skal vise arbeidsforhold-detaljer på alle arbeidsforhold som har er aksjonspunkt', () => {
    const wrapper = mountWithIntl(
      <PersonArbeidsforholdTable
        harAksjonspunktAvklarArbeidsforhold
        intl={intlMock}
        alleArbeidsforhold={[arbeidsforhold]}
        selectedId="1"
        alleKodeverk={{}}
        behandlingId={1}
        behandlingVersjon={2}
        updateArbeidsforhold={() => undefined}
      />,
    );
    expect(wrapper.find(PersonArbeidsforholdDetailForm)).toHaveLength(1);
  });

  it('skal ikke vise arbeidsforhold automatisk når det ikke er aksjonspunkt på det', () => {
    const wrapper = mountWithIntl(
      <PersonArbeidsforholdTable
        harAksjonspunktAvklarArbeidsforhold={false}
        intl={intlMock}
        alleArbeidsforhold={[
          {
            ...arbeidsforhold,
            aksjonspunktÅrsaker: [],
          },
        ]}
        selectedId={undefined}
        alleKodeverk={{}}
        behandlingId={1}
        behandlingVersjon={2}
        updateArbeidsforhold={() => undefined}
      />,
    );

    expect(wrapper.find(PersonArbeidsforholdDetailForm)).toHaveLength(0);
  });
});
