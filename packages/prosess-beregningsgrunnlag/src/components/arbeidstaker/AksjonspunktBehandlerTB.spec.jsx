import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import periodeAarsak from '@fpsak-frontend/kodeverk/src/periodeAarsak';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import avklaringsbehovCodes from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovCodes';
import avklaringsbehovStatus from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovStatus';
import AksjonspunktBehandlerTidsbegrenset, {
  createInputFieldKey,
  createTableData,
  getIsAvklaringsbehovClosed,
} from './AksjonspunktBehandlerTB';

const firstCol = {
  erTidsbegrenset: true,
  isEditable: false,
  tabellInnhold: 'Arbeidsgiver 1',
  inputfieldKey: '',
};

const secondCol = {
  erTidsbegrenset: false,
  isEditable: false,
  tabellInnhold: '100000',
  inputfieldKey: '',
};

const thirdCol = {
  erTidsbegrenset: false,
  isEditable: true,
  tabellInnhold: '100000',
  inputfieldKey: 'DetteErBareEnTest',
};


const mockTableData = {
    '123dette-er-en-arbeidsforholdid': [firstCol, secondCol, thirdCol],
};

const mockbruttoPerodeList = [
  { brutto: 560500, periodeFom: '2019-09-16', periodeTom: '2019-09-29' },
  { brutto: 0,  periodeFom: '2019-09-30', periodeTom: '9999-12-31'},
];

const beregnetPrAarAndelEn = 250000;
const overstyrtPrAarAndelEn = 100000;

const beregnetPrAarAndelTo = 100000;
const overstyrtPrAarAndelTo = 200000;

const beregningsgrunnlagPerioder = [
  {
    periodeAarsaker: [],
    beregningsgrunnlagPeriodeFom: '2018-06-01',
    beregningsgrunnlagPeriodeTom: '2018-06-30',
    beregningsgrunnlagPrStatusOgAndel: [
      {
        aktivitetStatus: {
          kode: aktivitetStatus.ARBEIDSTAKER,
        },
        erTidsbegrensetArbeidsforhold: true,
        beregnetPrAar: beregnetPrAarAndelEn,
        overstyrtPrAar: null,
        arbeidsforhold: {
          arbeidsgiverIdent: '123',
          arbeidsforholdId: 'dette-er-en-arbeidsforholdsid',
          eksternArbeidsforholdId: '345678',
        },
        andelsnr: 1,
      },
      {
        aktivitetStatus: {
          kode: aktivitetStatus.ARBEIDSTAKER,
        },
        erTidsbegrensetArbeidsforhold: true,
        beregnetPrAar: beregnetPrAarAndelTo,
        overstyrtPrAar: null,
        arbeidsforhold: {
          arbeidsgiverIdent: '456',
          arbeidsforholdId: 'dette-er-en-annen-arbeidsforholdsid',
          eksternArbeidsforholdId: '567890',
        },
        andelsnr: 2,
      },
    ],
  },
  {
    periodeAarsaker: [{ kode: periodeAarsak.ARBEIDSFORHOLD_AVSLUTTET }],
    beregningsgrunnlagPeriodeFom: '2018-07-01',
    beregningsgrunnlagPeriodeTom: '2018-07-31',
    beregningsgrunnlagPrStatusOgAndel: [
      {
        aktivitetStatus: {
          kode: aktivitetStatus.ARBEIDSTAKER,
        },
        erTidsbegrensetArbeidsforhold: true,
        beregnetPrAar: beregnetPrAarAndelEn,
        overstyrtPrAar: overstyrtPrAarAndelEn,
        arbeidsforhold: {
          arbeidsgiverIdent: '123',
          arbeidsforholdId: 'dette-er-en-arbeidsforholdsid',
          eksternArbeidsforholdId: '345678',
        },
        andelsnr: 1,
      },
      {
        aktivitetStatus: {
          kode: aktivitetStatus.ARBEIDSTAKER,
        },
        erTidsbegrensetArbeidsforhold: true,
        beregnetPrAar: beregnetPrAarAndelTo,
        overstyrtPrAar: overstyrtPrAarAndelTo,
        arbeidsforhold: {
          arbeidsforholdId: 'dette-er-en-annen-arbeidsforholdsid',
          arbeidsgiverIdent: '456',
          eksternArbeidsforholdId: '567890',
        },
        andelsnr: 2,
      },
    ],
  },
  {
    periodeAarsaker: [{ kode: periodeAarsak.ARBEIDSFORHOLD_AVSLUTTET }],
    beregningsgrunnlagPeriodeFom: '2018-08-01',
    beregningsgrunnlagPrStatusOgAndel: [
      {
        aktivitetStatus: {
          kode: aktivitetStatus.ARBEIDSTAKER,
        },
        erTidsbegrensetArbeidsforhold: true,
        beregnetPrAar: beregnetPrAarAndelEn,
        overstyrtPrAar: overstyrtPrAarAndelEn,
        arbeidsforhold: {
          arbeidsgiverIdent: '123',
          arbeidsforholdId: 'dette-er-en-arbeidsforholdsid',
          eksternArbeidsforholdId: '345678',
        },
        andelsnr: 1,
      },
      {
        aktivitetStatus: {
          kode: aktivitetStatus.ARBEIDSTAKER,
        },
        erTidsbegrensetArbeidsforhold: true,
        beregnetPrAar: beregnetPrAarAndelTo,
        overstyrtPrAar: overstyrtPrAarAndelTo,
        arbeidsforhold: {
          arbeidsgiverIdent: '456',
          arbeidsforholdId: 'dette-er-en-annen-arbeidsforholdsid',
          eksternArbeidsforholdId: '567890',
        },
        andelsnr: 2,
      },
    ],
  },
  {
    periodeAarsaker: [{ kode: periodeAarsak.REFUSJON_OPPHOERER }],
    beregningsgrunnlagPeriodeFom: '2019-01-01',
    beregningsgrunnlagPrStatusOgAndel: [
      {
        aktivitetStatus: {
          kode: aktivitetStatus.ARBEIDSTAKER,
        },
        erTidsbegrensetArbeidsforhold: true,
        beregnetPrAar: beregnetPrAarAndelEn,
        overstyrtPrAar: overstyrtPrAarAndelEn,
        arbeidsforhold: {
          arbeidsgiverIdent: '123',
          arbeidsforholdId: 'dette-er-en-arbeidsforholdsid',
          eksternArbeidsforholdId: '345678',
        },
        andelsnr: 1,
      },
      {
        aktivitetStatus: {
          kode: aktivitetStatus.ARBEIDSTAKER,
        },
        erTidsbegrensetArbeidsforhold: true,
        beregnetPrAar: beregnetPrAarAndelTo,
        overstyrtPrAar: overstyrtPrAarAndelTo,
        arbeidsforhold: {
          arbeidsgiverIdent: '456',
          arbeidsforholdId: 'dette-er-en-annen-arbeidsforholdsid',
          eksternArbeidsforholdId: '567890',
        },
        andelsnr: 2,
      },
    ],
  },
];

const arbeidsgiverOpplysningerPerId = {
  123: {
    identifikator: '123',
    referanse: '123',
    navn: 'arbeidsgiver',
    fødselsdato: null,
  },
  456: {
    identifikator: '456',
    referanse: '456',
    navn: 'arbeidsgiver',
    fødselsdato: null,
  },
};

const keyForPeriodeOgAndel = (periodeNr, andelNr) =>
  createInputFieldKey(
    beregningsgrunnlagPerioder[periodeNr].beregningsgrunnlagPrStatusOgAndel[andelNr],
    beregningsgrunnlagPerioder[periodeNr],
  );

const alleKodeverk = {
  test: 'test',
};

describe('<AksjonspunktBehandlerTidsbegrenset>', () => {
  it('Skal teste tabellen får korrekte rader', () => {
    const wrapper = shallowWithIntl(
      <AksjonspunktBehandlerTidsbegrenset.WrappedComponent
        readOnly={false}
        tableData={mockTableData}
        isAvklaringsbehovClosed={false}
        bruttoPrPeriodeList={mockbruttoPerodeList}
        fieldArrayID="dummyId"
      />,
    );
    const dataRows = wrapper.findWhere(node => node.key() === '123dette-er-en-arbeidsforholdid');
    const arbeidsgiverNavn = dataRows.first().find('Normaltekst');
    expect(arbeidsgiverNavn.first().childAt(0).text()).to.equal(
      mockTableData['123dette-er-en-arbeidsforholdid'][0].tabellInnhold,
    );
    const editableFields = mockTableData['123dette-er-en-arbeidsforholdid'].filter(
      periode => periode.isEditable === true,
    );
    expect(editableFields).to.have.length(1);
    const sumRows = wrapper.find('#bruttoPrPeriodeRad');
    const sumCols = sumRows.first().find('td');
    expect(sumCols).to.have.length(3);
    expect(sumCols.first().find('MemoizedFormattedMessage').first().props().id).to.equal(
      'Beregningsgrunnlag.AarsinntektPanel.AksjonspunktBehandlerTB.SumPeriode',
    );
  });
  it('Skal teste at initial values bygges korrekt', () => {
    const korrektApApent = [
      {
        definisjon: {
          kode: avklaringsbehovCodes.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
        },
        status: {
          kode: avklaringsbehovStatus.OPPRETTET,
        },
      },
    ];
    const expectedInitialValues = {};
      expectedInitialValues[keyForPeriodeOgAndel(1, 0)] = formatCurrencyNoKr(overstyrtPrAarAndelEn);
    expectedInitialValues[keyForPeriodeOgAndel(1, 1)] = formatCurrencyNoKr(overstyrtPrAarAndelTo);
    const initialValues = AksjonspunktBehandlerTidsbegrenset.buildInitialValues(beregningsgrunnlagPerioder, korrektApApent);
    expect(initialValues).to.eql(expectedInitialValues);
  });
  it(
    'Skal teste at selector lager forventet objekt ut av en liste med beregningsgrunnlagperioder ' +
      'som inneholder kortvarige arbeidsforhold når vi har aksjonspunkt',
    () => {
      const expectedResultObjectWhenWeHaveAksjonspunkt = {
        '123dette-er-en-arbeidsforholdsid': [
          {
            erTidsbegrenset: true,
            isEditable: false,
            tabellInnhold: 'arbeidsgiver (123)...5678',
            inputfieldKey: '',
          },
          {
            erTidsbegrenset: false,
            isEditable: false,
            tabellInnhold: formatCurrencyNoKr(beregnetPrAarAndelEn),
            inputfieldKey: '',
          },
          {
            erTidsbegrenset: false,
            isEditable: true,
            tabellInnhold: formatCurrencyNoKr(overstyrtPrAarAndelEn),
            inputfieldKey: 'inntektField_123_1_2018-07-01',
          }
        ],
        '456dette-er-en-annen-arbeidsforholdsid': [
          {
            erTidsbegrenset: true,
            isEditable: false,
            tabellInnhold: 'arbeidsgiver (456)...7890',
            inputfieldKey: '',
          },
          {
            erTidsbegrenset: false,
            isEditable: false,
            tabellInnhold: formatCurrencyNoKr(beregnetPrAarAndelTo),
            inputfieldKey: '',
          },
          {
            erTidsbegrenset: false,
            isEditable: true,
            tabellInnhold: formatCurrencyNoKr(overstyrtPrAarAndelTo),
            inputfieldKey: 'inntektField_456_2_2018-07-01',
          }
        ],
      };
      const selectorData = createTableData.resultFunc(
        beregningsgrunnlagPerioder,
        alleKodeverk,
        arbeidsgiverOpplysningerPerId,
      );

      expect(selectorData).to.deep.equal(expectedResultObjectWhenWeHaveAksjonspunkt);
    },
  );
  it('Skal teste at selector henter ut om aksjonspunktet er lukket eller ikke', () => {
    const korrektApLukket = [
      {
        definisjon: {
          kode: avklaringsbehovCodes.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
        },
        status: {
          kode: avklaringsbehovStatus.UTFORT,
        },
      },
    ];
    const korrektApApent = [
      {
        definisjon: {
          kode: avklaringsbehovCodes.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
        },
        status: {
          kode: avklaringsbehovStatus.OPPRETTET,
        },
      },
    ];
    const selectorDataLukket = getIsAvklaringsbehovClosed.resultFunc(korrektApLukket);
    expect(selectorDataLukket).to.equal(true);
    const selectorDataApent = getIsAvklaringsbehovClosed.resultFunc(korrektApApent);
    expect(selectorDataApent).to.equal(false);
  });
  it('Skal teste transformValues metode', () => {
    const formValues = {};
    formValues.ATFLVurdering = "Alt ser greit ut.";
    formValues.inntektFrilanser = '120 000';
    formValues[keyForPeriodeOgAndel(1, 0)] = '100 000';
    formValues[keyForPeriodeOgAndel(1, 1)] = '250 000';
    const expectedTransformedValues = {
      fastsatteTidsbegrensedePerioder: [
      {
        periodeFom: beregningsgrunnlagPerioder[1].beregningsgrunnlagPeriodeFom,
        periodeTom: beregningsgrunnlagPerioder[2].beregningsgrunnlagPeriodeTom,
        fastsatteTidsbegrensedeAndeler: [
          {
            andelsnr: 1,
            bruttoFastsattInntekt: 100000,
          },
          {
            andelsnr: 2,
            bruttoFastsattInntekt: 250000,
          },
        ],
      }
    ],
    kode: avklaringsbehovCodes.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
    begrunnelse: "Alt ser greit ut.",
    frilansInntekt: 120000,
    };
    const transformedValues = AksjonspunktBehandlerTidsbegrenset.transformValues(
      formValues,
      beregningsgrunnlagPerioder,
    );
    expect(transformedValues).is.deep.equal(expectedTransformedValues);
  });

  it('Skal teste buildInitialValues metode', () => {
    const korrektApApent = [
      {
        definisjon: {
          kode: avklaringsbehovCodes.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
        },
        status: {
          kode: avklaringsbehovStatus.OPPRETTET,
        },
      },
    ];
    const expectedInitialValues = {};
    expectedInitialValues[keyForPeriodeOgAndel(1, 0)] = formatCurrencyNoKr(overstyrtPrAarAndelEn);
    expectedInitialValues[keyForPeriodeOgAndel(1, 1)] = formatCurrencyNoKr(overstyrtPrAarAndelTo);
    const initialValues = AksjonspunktBehandlerTidsbegrenset.buildInitialValues(beregningsgrunnlagPerioder, korrektApApent);
    expect(initialValues).is.deep.equal(expectedInitialValues);
  });
});
