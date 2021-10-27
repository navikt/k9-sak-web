import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { MockFieldsWithContent } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import aktivitetStatuser from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import avklaringsbehovCodes from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovCodes';
import inntektskategorier from '@fpsak-frontend/kodeverk/src/inntektskategorier';
import { TableColumn, TableRow } from '@fpsak-frontend/shared-components';
import { InputField, PeriodpickerField, SelectField } from '@fpsak-frontend/form';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { lagStateMedAvklaringsbehovOgBeregningsgrunnlag } from '../beregning-test-helper';
import { AndelRowImpl, mapStateToProps } from './InntektFieldArrayRow';
import ArbeidsforholdField from './ArbeidsforholdField';
import { formNameVurderFaktaBeregning } from '../BeregningFormUtils';
import shallowWithIntl, { intlMock } from '../../../i18n';

const avklaringsbehov = [
  {
    definisjon: { kode: avklaringsbehovCodes.VURDER_FAKTA_FOR_ATFL_SN },
    status: { kode: 'OPPR' },
  },
];

const alleKodeverk = {
  [kodeverkTyper.INNTEKTSKATEGORI]: [
    {
      kode: inntektskategorier.ARBEIDSTAKER,
      navn: 'Arbeidstaker',
    },
    {
      kode: inntektskategorier.FRILANSER,
      navn: 'Frilanser',
    },
    {
      kode: inntektskategorier.DAGPENGER,
      navn: 'Dagpenger',
    },
    {
      kode: inntektskategorier.SELVSTENDIG_NÆRINGSDRIVENDE,
      navn: 'Selvstendig næringsdrivende',
    },
  ],
};

const behandlingId = 1000051;
const behandlingVersjon = 1;

const andelField = {
  nyAndel: false,
  andel: 'Sopra Steria AS (233647823)',
  andelsnr: 1,
  fastsattBelop: '0',
  lagtTilAvSaksbehandler: false,
  inntektskategori: 'ARBEIDSTAKER',
  arbeidsgiverIdent: '233647823',
  arbeidsperiodeFom: '01.01.2018',
  arbeidsperiodeTom: null,
  refusjonskrav: '10 000',
  aktivitetStatus: aktivitetStatuser.ARBEIDSTAKER,
};

const arbeidsgiverOpplysningerPerId = {
  233647823: {
    identifikator: '233647823',
    referanse: '233647823',
    navn: 'Sopra Steria AS',
    fødselsdato: null,
  },
};

const fields = new MockFieldsWithContent('fieldArrayName', [andelField]);

const faktaOmBeregning = {
  faktaOmBeregningTilfeller: [],
};

const initial = {};
initial.fieldArrayName = [andelField];
const beregningsgrunnlag = {
  faktaOmBeregning,
  beregningsgrunnlagPeriode: [{ beregningsgrunnlagPrStatusOgAndel: [{ andelsnr: 1 }] }],
};
const ownProps = {
  alleKodeverk,
  behandlingId,
  behandlingVersjon,
  beregningsgrunnlag,
  arbeidsgiverOpplysningerPerId,
  fields,
  index: 0,
  isAvklaringsbehovClosed: false,
};
const state = lagStateMedAvklaringsbehovOgBeregningsgrunnlag(
  avklaringsbehov,
  beregningsgrunnlag,
  formNameVurderFaktaBeregning,
  initial,
  initial,
);
const props = mapStateToProps(state, ownProps);

it('skal vise komponent med arbeidsperiode og refusjonskrav', () => {
  const wrapper = shallowWithIntl(
    <AndelRowImpl
      intl={intlMock}
      fields={fields}
      readOnly={false}
      skalVisePeriode
      skalViseRefusjon
      skalViseSletteknapp={false}
      skalRedigereInntekt
      andelElementFieldId="fieldArrayName[0]"
      removeAndel={sinon.spy()}
      index={0}
      {...ownProps}
      {...props}
    />,
  );
  const rows = wrapper.find(TableRow);
  expect(rows.length).to.eql(1);
  const columns = rows.first().find(TableColumn);
  expect(columns.length).to.eql(6);
  expect(columns.first().find(ArbeidsforholdField).length).to.eql(1);
  expect(columns.at(1).find(PeriodpickerField).length).to.eql(1);
  expect(columns.at(2).find(InputField).length).to.eql(1);
  expect(columns.at(3).find(InputField).length).to.eql(1);
  expect(columns.at(4).find(SelectField).length).to.eql(1);
  const btn = columns.at(3).find('button');
  expect(btn.length).to.eql(0);
});

it('skal vise komponent uten arbeidsperiode og refusjonskrav', () => {
  const andelField2 = {
    nyAndel: false,
    andel: 'Sopra Steria AS (233647823)',
    andelsnr: 1,
    fastsattBelop: '0',
    lagtTilAvSaksbehandler: false,
    inntektskategori: 'ARBEIDSTAKER',
    arbeidsgiverIdent: '',
    arbeidsperiodeFom: '',
    arbeidsperiodeTom: '',
    skalRedigereInntekt: true,
  };

  const fields2 = new MockFieldsWithContent('fieldArrayName', [andelField2]);

  const wrapper = shallowWithIntl(
    <AndelRowImpl
      intl={intlMock}
      fields={fields2}
      readOnly={false}
      skalVisePeriode={false}
      skalViseSletteknapp={false}
      skalViseRefusjon={false}
      skalRedigereInntekt
      andelElementFieldId="fieldArrayName[0]"
      removeAndel={sinon.spy()}
      index={0}
      inntektskategoriKoder={[]}
      isAvklaringsbehovClosed={false}
      skalRedigereInntektskategori={false}
      {...ownProps}
    />,
  );
  const row = wrapper.find(TableRow);
  expect(row.length).to.eql(1);
  const columns = row.first().find(TableColumn);
  expect(columns.length).to.eql(4);
  expect(columns.first().find(ArbeidsforholdField).length).to.eql(1);
  const inputField = columns.at(1).find(InputField);
  expect(inputField.length).to.eql(1);
  expect(inputField.props().name).to.eql('fieldArrayName[0].fastsattBelop');
  expect(columns.at(2).find(SelectField).length).to.eql(1);
  const btn = columns.at(3).find('button');
  expect(btn.length).to.eql(0);
});

it('skal vise komponent med readOnly beløp', () => {
  const andelField2 = {
    nyAndel: false,
    andel: 'Sopra Steria AS (233647823)',
    andelsnr: 1,
    fastsattBelop: '0',
    lagtTilAvSaksbehandler: false,
    inntektskategori: 'ARBEIDSTAKER',
    arbeidsgiverIdent: '',
    arbeidsperiodeFom: '',
    arbeidsperiodeTom: '',
    skalRedigereInntekt: false,
  };

  const fields2 = new MockFieldsWithContent('fieldArrayName', [andelField2]);

  const wrapper = shallowWithIntl(
    <AndelRowImpl
      intl={intlMock}
      fields={fields2}
      readOnly={false}
      skalVisePeriode={false}
      skalViseSletteknapp={false}
      skalViseRefusjon={false}
      skalRedigereInntekt={false}
      andelElementFieldId="fieldArrayName[0]"
      removeAndel={sinon.spy()}
      index={0}
      inntektskategoriKoder={[]}
      isAvklaringsbehovClosed={false}
      skalRedigereInntektskategori={false}
      {...ownProps}
    />,
  );
  const row = wrapper.find(TableRow);
  expect(row.length).to.eql(1);
  const columns = row.first().find(TableColumn);
  expect(columns.length).to.eql(4);
  expect(columns.first().find(ArbeidsforholdField).length).to.eql(1);
  const inputField = columns.at(1).find(InputField);
  expect(inputField.length).to.eql(1);
  expect(inputField.props().name).to.eql('fieldArrayName[0].belopReadOnly');
  expect(columns.at(2).find(SelectField).length).to.eql(1);
  const btn = columns.at(3).find('button');
  expect(btn.length).to.eql(0);
});

it('skal vise komponent med sletteknapp', () => {
  const andelField2 = {
    nyAndel: false,
    andel: 'Sopra Steria AS (233647823)',
    andelsnr: 1,
    fastsattBelop: '0',
    lagtTilAvSaksbehandler: false,
    inntektskategori: 'ARBEIDSTAKER',
    arbeidsgiverIdent: '',
    arbeidsperiodeFom: '',
    arbeidsperiodeTom: '',
  };

  const fields2 = new MockFieldsWithContent('fieldArrayName', [andelField2]);

  const wrapper = shallowWithIntl(
    <AndelRowImpl
      intl={intlMock}
      fields={fields2}
      readOnly={false}
      skalVisePeriode={false}
      skalViseSletteknapp
      skalViseRefusjon={false}
      skalRedigereInntekt
      andelElementFieldId="fieldArrayName[0]"
      removeAndel={sinon.spy()}
      index={0}
      {...ownProps}
      {...props}
    />,
  );
  const row = wrapper.find(TableRow);
  expect(row.length).to.eql(1);
  const columns = row.first().find(TableColumn);
  expect(columns.length).to.eql(4);
  expect(columns.first().find(ArbeidsforholdField).length).to.eql(1);
  expect(columns.at(1).find(InputField).length).to.eql(1);
  expect(columns.at(2).find(SelectField).length).to.eql(1);
  const btn = columns.at(3).find('button');
  expect(btn.length).to.eql(1);
});
