import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { DateLabel, Image, PeriodLabel, Table, TableColumn, TableRow } from '@fpsak-frontend/shared-components';
import arbeidsforholdHandlingType from '@fpsak-frontend/kodeverk/src/arbeidsforholdHandlingType';
import PersonArbeidsforholdTable, { utledNøkkel } from './PersonArbeidsforholdTable';
import IngenArbeidsforholdRegistrert from './IngenArbeidsforholdRegistrert';
import { mountWithIntl } from '../../../i18n';

describe('<PersonArbeidsforholdTable>', () => {
  const arbeidsforhold = {
    id: '1',
    arbeidsgiver: {
      arbeidsgiverOrgnr: '98000167',
      arbeidsgiverAktørId: 'aktørId',
    },
    arbeidsforhold: {
      internArbeidsforholdId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      eksternArbeidsforholdId: '9056806408',
    },
    yrkestittel: 'Vaktmester',
    begrunnelse: null,
    perioder: [
      {
        fom: '2020-02-14',
        tom: '2020-12-14',
      },
    ],
    handlingType: 'UDEFINERT',
    kilde: ['AAREGISTERET'],
    permisjoner: [
      {
        permisjonFom: '2020-12-14',
        permisjonTom: '2020-12-14',
      },
    ],
    stillingsprosent: 40,
    aksjonspunktÅrsaker: ['MANGLENDE_INNTEKTSMELDING'],
    inntektsmeldinger: [
      {
        journalpostId: '98548088',
        mottattTidspunkt: '2020-12-14',
        status: 'GYLDIG',
        begrunnelse: 'null',
      },
    ],
  };

  const fagsystemer = [
    {
      kode: 'AA',
      navn: 'aa',
    },
    {
      kode: 'INNTEKT',
      navn: 'inntekt',
    },
  ];

  it('skal vise tabell med to arbeidsforhold der den ene raden er markert som valgt', () => {
    const arbeidsforhold2 = {
      id: '2',
      arbeidsgiver: {
        arbeidsgiverOrgnr: '99999999',
        arbeidsgiverAktørId: 'aktørId',
      },
      arbeidsforhold: {
        internArbeidsforholdId: '3fa85f64-5717-4562-b3fc-2c963f66afa8',
        eksternArbeidsforholdId: '99999999999',
      },
      yrkestittel: 'Lærer',
      begrunnelse: null,
      perioder: [
        {
          fom: '2020-02-14',
          tom: '2020-12-14',
        },
      ],
      handlingType: 'UDEFINERT',
      kilde: ['AAREGISTERET'],
      permisjoner: [
        {
          permisjonFom: '2020-12-14',
          permisjonTom: '2020-12-14',
        },
      ],
      stillingsprosent: 60,
      aksjonspunktÅrsaker: ['MANGLENDE_INNTEKTSMELDING'],
      inntektsmeldinger: [
        {
          journalpostId: '98548088',
          mottattTidspunkt: '2018-05-05',
          status: 'GYLDIG',
          begrunnelse: 'null',
        },
      ],
    };

    const wrapper = mountWithIntl(
      <PersonArbeidsforholdTable
        alleArbeidsforhold={[arbeidsforhold, arbeidsforhold2]}
        selectedId={arbeidsforhold.id}
        alleKodeverk={{}}
        selectArbeidsforholdCallback={sinon.spy()}
        updateArbeidsforhold={sinon.spy()}
        cancelArbeidsforhold={sinon.spy()}
        fagsystemer={fagsystemer}
        behandlingVersjon={1}
        behandlingId={1}
      />,
    );

    const table = wrapper.find(Table);
    expect(table).has.length(1);

    const rows = table.find(TableRow);

    expect(rows).has.length(3);

    const row1 = rows.at(1);
    expect(row1.prop('isSelected')).is.true;
    const colsRow1 = row1.find(TableColumn);
    expect(colsRow1).has.length(6);
    expect(colsRow1.first().childAt(0).childAt(0).text()).is.eql('Svendsen Eksos (1234567)...6789');
    expect(colsRow1.at(1).find(PeriodLabel)).has.length(1);
    expect(colsRow1.at(3).childAt(0).childAt(0).text()).is.eql('80.00 %');

    const row2 = rows.last();
    expect(row2.prop('isSelected')).is.false;
  });

  it('skal ikke vise mottatt dato for inntektsmelding når denne ikke finnes', () => {
    const wrapper = mountWithIntl(
      <PersonArbeidsforholdTable
        alleArbeidsforhold={[arbeidsforhold]}
        selectedId={arbeidsforhold.id}
        alleKodeverk={{}}
        selectArbeidsforholdCallback={sinon.spy()}
        updateArbeidsforhold={sinon.spy()}
        cancelArbeidsforhold={sinon.spy()}
        fagsystemer={fagsystemer}
        behandlingVersjon={1}
        behandlingId={1}
      />,
    );

    const cols = wrapper.find(TableColumn);

    expect(cols).has.length(13);
    expect(cols.at(10).children()).has.length(1);
  });

  it('skal vise mottatt dato for inntektsmelding når denne finnes', () => {
    const wrapper = mountWithIntl(
      <PersonArbeidsforholdTable
        alleArbeidsforhold={[arbeidsforhold]}
        selectedId={arbeidsforhold.id}
        alleKodeverk={{}}
        selectArbeidsforholdCallback={sinon.spy()}
        updateArbeidsforhold={sinon.spy()}
        cancelArbeidsforhold={sinon.spy()}
        behandlingVersjon={1}
        behandlingId={1}
      />,
    );

    const cols = wrapper.find(TableColumn);
    expect(cols).has.length(13);
    expect(wrapper.find(DateLabel).prop('dateString')).to.eql('2020-12-14');
  });

  it('skal ikke vise ikon for at arbeidsforholdet er i bruk', () => {
    const wrapper = mountWithIntl(
      <PersonArbeidsforholdTable
        alleArbeidsforhold={[arbeidsforhold]}
        selectedId={arbeidsforhold.id}
        alleKodeverk={{}}
        selectArbeidsforholdCallback={sinon.spy()}
        updateArbeidsforhold={sinon.spy()}
        cancelArbeidsforhold={sinon.spy()}
        behandlingVersjon={1}
        behandlingId={1}
      />,
    );

    const cols = wrapper.find(TableColumn);
    expect(cols).has.length(13);
    expect(cols.last().children()).has.length(1);
  });

  it('skal vise ikon for at arbeidsforholdet er i bruk', () => {
    const newArbeidsforhold = {
      ...arbeidsforhold,
      handlingType: arbeidsforholdHandlingType.BRUK,
      aksjonspunktÅrsaker: [],
    };

    const wrapper = mountWithIntl(
      <PersonArbeidsforholdTable
        alleArbeidsforhold={[newArbeidsforhold]}
        selectedId={newArbeidsforhold.id}
        alleKodeverk={{}}
        selectArbeidsforholdCallback={sinon.spy()}
        updateArbeidsforhold={sinon.spy()}
        cancelArbeidsforhold={sinon.spy()}
        behandlingVersjon={1}
        behandlingId={1}
      />,
    );

    const cols = wrapper.find(TableColumn);
    expect(cols).has.length(13);
    expect(cols.last().find(Image)).has.length(1);
  });

  it('skal vise IngenArbeidsforholdRegistrert komponent når ingen arbeidsforhold', () => {
    const wrapper = mountWithIntl(
      <PersonArbeidsforholdTable
        alleArbeidsforhold={[]}
        selectedId={undefined}
        selectArbeidsforholdCallback={sinon.spy()}
        fagsystemer={fagsystemer}
        alleKodeverk={{}}
        updateArbeidsforhold={sinon.spy()}
        cancelArbeidsforhold={sinon.spy()}
        behandlingVersjon={1}
        behandlingId={1}
      />,
    );
    const element = wrapper.find(IngenArbeidsforholdRegistrert);
    expect(element).has.length(1);
  });

  it('skal vise stillingsprosent selv når den er 0', () => {
    const endretArbeidsforhold = {
      ...arbeidsforhold,
      stillingsprosent: 0,
    };
    const wrapper = mountWithIntl(
      <PersonArbeidsforholdTable
        alleArbeidsforhold={[endretArbeidsforhold]}
        selectedId={undefined}
        alleKodeverk={{}}
        selectArbeidsforholdCallback={sinon.spy()}
        updateArbeidsforhold={sinon.spy()}
        cancelArbeidsforhold={sinon.spy()}
        behandlingVersjon={1}
        behandlingId={1}
      />,
    );
    const tableRow = wrapper.find(TableRow).at(1);
    expect(tableRow.props().model.stillingsprosent).to.eql(0);
  });

  it('skal vise riktig utledet navn', () => {
    const wrapper = mountWithIntl(
      <PersonArbeidsforholdTable
        alleArbeidsforhold={[arbeidsforhold]}
        selectedId={undefined}
        alleKodeverk={{}}
        selectArbeidsforholdCallback={sinon.spy()}
        updateArbeidsforhold={sinon.spy()}
        cancelArbeidsforhold={sinon.spy()}
        behandlingVersjon={1}
        behandlingId={1}
      />,
    );
    const tableRow = wrapper.find(TableRow).at(1);
    expect(tableRow.props().model.yrkestittel).to.eql('Vaktmester');
  });

  it('skal vise tom dato', () => {
    const endretArbeidsforhold = {
      ...arbeidsforhold,
    };
    const wrapper = mountWithIntl(
      <PersonArbeidsforholdTable
        alleArbeidsforhold={[endretArbeidsforhold]}
        selectedId={undefined}
        alleKodeverk={{}}
        selectArbeidsforholdCallback={sinon.spy()}
        updateArbeidsforhold={sinon.spy()}
        cancelArbeidsforhold={sinon.spy()}
        behandlingVersjon={1}
        behandlingId={1}
      />,
    );
    const periodeLabel = wrapper.find(PeriodLabel);
    expect(periodeLabel.props().dateStringTom).to.eql('2020-12-14');
  });
  it('arbeidsforhold med samme navn og orgnr, en med arbeidsforholdId og en uten, skal få ulik nøkkel', () => {
    const arbfor1 = { ...arbeidsforhold };
    arbfor1.arbeidsforholdId = '123';
    arbfor1.eksternArbeidsforholdId = null;

    const arbfor2 = { ...arbeidsforhold };
    arbfor2.arbeidsforholdId = null;
    arbfor2.eksternArbeidsforholdId = null;

    const nøkkel1 = utledNøkkel(arbfor1);
    const nøkkel2 = utledNøkkel(arbfor2);
    expect(nøkkel1).to.not.eql(nøkkel2);
  });
});
