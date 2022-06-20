import { expect } from 'chai';
import periodeAarsak from '@fpsak-frontend/kodeverk/src/periodeAarsak';
import slåSammenPerioder from './SlåSammenPerioder';


const arbeidsforhold1 = {
  arbeidsforholdId: null,
  arbeidsforholdType: 'ARBEID',
  arbeidsgiverIdent: '914555825',
  belopFraInntektsmeldingPrMnd: 41667,
  opphoersdato: '2019-06-01',
  organisasjonstype: 'VIRKSOMHET',
  refusjonPrAar: 500004,
  startdato: '2016-08-01',
};


const fordelAndel = {
  aktivitetStatus: 'AT',
  andelIArbeid: [0],
  andelsnr: 1,
  arbeidsforhold: arbeidsforhold1,
  inntektskategori: 'ARBEIDSTAKER',
  nyttArbeidsforhold: false,
};

const arbeidsforhold2 = {
  arbeidsforholdId: 'd0101e6c-c54a-4db2-ac91-f5b0d86a6d3e',
  arbeidsforholdType: 'ARBEID',
  arbeidsgiverIdent: '996607852',
  belopFraInntektsmeldingPrMnd: 41667,
  organisasjonstype: 'VIRKSOMHET',
  refusjonPrAar: 500004,
  startdato: '2019-06-02',
};

const fordelAndel2 = {
  aktivitetStatus: 'AT',
  andelIArbeid: [0],
  andelsnr: 2,
  arbeidsforhold: arbeidsforhold2,
  inntektskategori: '-',
  nyttArbeidsforhold: true,
};


describe('<FordelBeregningsgrunnlagForm>', () => {

  it('skal returnere liste med en periode om kun en periode i grunnlag', () => {
    const perioder = [
      {
        fom: '01-01-2019',
        tom: null,
        fordelBeregningsgrunnlagAndeler: [fordelAndel],
        harPeriodeAarsakGraderingEllerRefusjon: true,
      },
    ];
    const bgPerioder = [
      {
        beregningsgrunnlagPeriodeFom: '01-01-2019',
        beregningsgrunnlagPeriodeTom: null,
        periodeAarsaker: [periodeAarsak.ENDRING_I_REFUSJONSKRAV],
      },
    ];
    const nyePerioder = slåSammenPerioder(perioder, bgPerioder);
    expect(nyePerioder.length).to.equal(1);
    expect(nyePerioder[0].fom).to.equal('01-01-2019');
    expect(nyePerioder[0].tom).to.equal(null);
  });

  it('skal returnere liste med en periode om andre periode har naturalytelse tilkommet', () => {
    const perioder = [
      {
        fom: '01-01-2019',
        tom: '01-02-2019',
        fordelBeregningsgrunnlagAndeler: [fordelAndel],
        harPeriodeAarsakGraderingEllerRefusjon: true,
      },
      {
        fom: '02-02-2019',
        tom: null,
        fordelBeregningsgrunnlagAndeler: [fordelAndel],
        harPeriodeAarsakGraderingEllerRefusjon: true,
      },
    ];
    const bgPerioder = [
      {
        beregningsgrunnlagPeriodeFom: '01-01-2019',
        beregningsgrunnlagPeriodeTom: '01-02-2019',
        periodeAarsaker: [periodeAarsak.ENDRING_I_REFUSJONSKRAV],
      },
      {
        beregningsgrunnlagPeriodeFom: '02-02-2019',
        beregningsgrunnlagPeriodeTom: null,
        periodeAarsaker: [periodeAarsak.NATURALYTELSE_TILKOMMER],
      },
    ];
    const nyePerioder = slåSammenPerioder(perioder, bgPerioder);
    expect(nyePerioder.length).to.equal(1);
    expect(nyePerioder[0].fom).to.equal('01-01-2019');
    expect(nyePerioder[0].tom).to.equal(null);
  });

  it('skal returnere liste med en periode om andre periode har naturalytelse bortfalt', () => {
    const perioder = [
      {
        fom: '01-01-2019',
        tom: '01-02-2019',
        fordelBeregningsgrunnlagAndeler: [fordelAndel],
        harPeriodeAarsakGraderingEllerRefusjon: true,
      },
      {
        fom: '02-02-2019',
        tom: null,
        fordelBeregningsgrunnlagAndeler: [fordelAndel],
        harPeriodeAarsakGraderingEllerRefusjon: true,
      },
    ];
    const bgPerioder = [
      {
        beregningsgrunnlagPeriodeFom: '01-01-2019',
        beregningsgrunnlagPeriodeTom: '01-02-2019',
        periodeAarsaker: [periodeAarsak.ENDRING_I_REFUSJONSKRAV],
      },
      {
        beregningsgrunnlagPeriodeFom: '02-02-2019',
        beregningsgrunnlagPeriodeTom: null,
        periodeAarsaker: [periodeAarsak.NATURALYTELSE_BORTFALT],
      },
    ];
    const nyePerioder = slåSammenPerioder(perioder, bgPerioder);
    expect(nyePerioder.length).to.equal(1);
    expect(nyePerioder[0].fom).to.equal('01-01-2019');
    expect(nyePerioder[0].tom).to.equal(null);
  });

  it('skal returnere liste med en periode om andre periode har avsluttet arbeidsforhold uten endring i bruttoPrÅr', () => {
    const perioder = [
      {
        fom: '01-01-2019',
        tom: '01-02-2019',
        fordelBeregningsgrunnlagAndeler: [fordelAndel],
        harPeriodeAarsakGraderingEllerRefusjon: true,
      },
      {
        fom: '02-02-2019',
        tom: null,
        fordelBeregningsgrunnlagAndeler: [fordelAndel],
        harPeriodeAarsakGraderingEllerRefusjon: true,
      },
    ];
    const bgPerioder = [
      {
        beregningsgrunnlagPeriodeFom: '01-01-2019',
        beregningsgrunnlagPeriodeTom: '01-02-2019',
        bruttoPrAar: 120000,
        periodeAarsaker: [periodeAarsak.ENDRING_I_REFUSJONSKRAV],
      },
      {
        beregningsgrunnlagPeriodeFom: '02-02-2019',
        beregningsgrunnlagPeriodeTom: null,
        bruttoPrAar: 120000,
        periodeAarsaker: [periodeAarsak.ARBEIDSFORHOLD_AVSLUTTET],
      },
    ];
    const nyePerioder = slåSammenPerioder(perioder, bgPerioder);
    expect(nyePerioder.length).to.equal(1);
    expect(nyePerioder[0].fom).to.equal('01-01-2019');
    expect(nyePerioder[0].tom).to.equal(null);
  });

  it('skal returnere liste med to perioder om andre periode har avsluttet arbeidsforhold med endring i bruttoPrÅr', () => {
    const perioder = [
      {
        fom: '01-01-2019',
        tom: '01-02-2019',
        fordelBeregningsgrunnlagAndeler: [fordelAndel],
        harPeriodeAarsakGraderingEllerRefusjon: true,
      },
      {
        fom: '02-02-2019',
        tom: null,
        fordelBeregningsgrunnlagAndeler: [fordelAndel],
        harPeriodeAarsakGraderingEllerRefusjon: true,
      },
    ];
    const bgPerioder = [
      {
        beregningsgrunnlagPeriodeFom: '01-01-2019',
        beregningsgrunnlagPeriodeTom: '01-02-2019',
        bruttoPrAar: 120000,
        periodeAarsaker: [periodeAarsak.ENDRING_I_REFUSJONSKRAV],
      },
      {
        beregningsgrunnlagPeriodeFom: '02-02-2019',
        beregningsgrunnlagPeriodeTom: null,
        bruttoPrAar: 130000,
        periodeAarsaker: [periodeAarsak.ARBEIDSFORHOLD_AVSLUTTET],
      },
    ];
    const nyePerioder = slåSammenPerioder(perioder, bgPerioder);
    expect(nyePerioder.length).to.equal(2);
    expect(nyePerioder[0].fom).to.equal('01-01-2019');
    expect(nyePerioder[0].tom).to.equal('01-02-2019');
    expect(nyePerioder[1].fom).to.equal('02-02-2019');
    expect(nyePerioder[1].tom).to.equal(null);
  });

  it('skal returnere liste med to perioder om andre periode har opphør av refusjon', () => {
    const perioder = [
      {
        fom: '01-01-2019',
        tom: '01-02-2019',
        fordelBeregningsgrunnlagAndeler: [fordelAndel],
        harPeriodeAarsakGraderingEllerRefusjon: true,
      },
      {
        fom: '02-02-2019',
        tom: null,
        fordelBeregningsgrunnlagAndeler: [fordelAndel],
        harPeriodeAarsakGraderingEllerRefusjon: false,
      },
    ];
    const bgPerioder = [
      {
        beregningsgrunnlagPeriodeFom: '01-01-2019',
        beregningsgrunnlagPeriodeTom: '01-02-2019',
        bruttoPrAar: 120000,
        periodeAarsaker: [periodeAarsak.ENDRING_I_REFUSJONSKRAV],
      },
      {
        beregningsgrunnlagPeriodeFom: '02-02-2019',
        beregningsgrunnlagPeriodeTom: null,
        bruttoPrAar: 120000,
        periodeAarsaker: [periodeAarsak.REFUSJON_OPPHOERER],
      },
    ];
    const nyePerioder = slåSammenPerioder(perioder, bgPerioder);
    expect(nyePerioder.length).to.equal(2);
    expect(nyePerioder[0].fom).to.equal('01-01-2019');
    expect(nyePerioder[0].tom).to.equal('01-02-2019');
    expect(nyePerioder[1].fom).to.equal('02-02-2019');
    expect(nyePerioder[1].tom).to.equal(null);
  });

  it('skal returnere liste med to perioder om andre periode har endring i refusjon', () => {
    const perioder = [
      {
        fom: '01-01-2019',
        tom: '01-02-2019',
        fordelBeregningsgrunnlagAndeler: [fordelAndel],
        harPeriodeAarsakGraderingEllerRefusjon: false,
      },
      {
        fom: '02-02-2019',
        tom: null,
        fordelBeregningsgrunnlagAndeler: [fordelAndel],
        harPeriodeAarsakGraderingEllerRefusjon: true,
      },
    ];
    const bgPerioder = [
      {
        beregningsgrunnlagPeriodeFom: '01-01-2019',
        beregningsgrunnlagPeriodeTom: '01-02-2019',
        bruttoPrAar: 120000,
        periodeAarsaker: [],
      },
      {
        beregningsgrunnlagPeriodeFom: '02-02-2019',
        beregningsgrunnlagPeriodeTom: null,
        bruttoPrAar: 120000,
        periodeAarsaker: [periodeAarsak.ENDRING_I_REFUSJONSKRAV],
      },
    ];
    const nyePerioder = slåSammenPerioder(perioder, bgPerioder);
    expect(nyePerioder.length).to.equal(2);
    expect(nyePerioder[0].fom).to.equal('01-01-2019');
    expect(nyePerioder[0].tom).to.equal('01-02-2019');
    expect(nyePerioder[1].fom).to.equal('02-02-2019');
    expect(nyePerioder[1].tom).to.equal(null);
  });


  it('skal returnere liste med en periode om andre periode har endring i søkt ytelse uten endring i refusjon eller brutto', () => {
    const perioder = [
      {
        fom: '01-01-2019',
        tom: '01-02-2019',
        fordelBeregningsgrunnlagAndeler: [fordelAndel],
        harPeriodeAarsakGraderingEllerRefusjon: true,
      },
      {
        fom: '02-02-2019',
        tom: null,
        fordelBeregningsgrunnlagAndeler: [fordelAndel],
        harPeriodeAarsakGraderingEllerRefusjon: true,
      },
    ];
    const bgPerioder = [
      {
        beregningsgrunnlagPeriodeFom: '01-01-2019',
        beregningsgrunnlagPeriodeTom: '01-02-2019',
        periodeAarsaker: [],
        bruttoPrAar: 500_000,
      },
      {
        beregningsgrunnlagPeriodeFom: '02-02-2019',
        beregningsgrunnlagPeriodeTom: null,
        periodeAarsaker: [periodeAarsak.ENDRING_I_AKTIVITETER_SØKT_FOR],
        bruttoPrAar: 500_000,
      },
    ];
    const nyePerioder = slåSammenPerioder(perioder, bgPerioder);
    expect(nyePerioder.length).to.equal(1);
    expect(nyePerioder[0].fom).to.equal('01-01-2019');
    expect(nyePerioder[0].tom).to.equal(null);
  });

  it('skal returnere liste med to periode om andre periode har endring i søkt ytelse med endring i refusjon', () => {
    const perioder = [
      {
        fom: '01-01-2019',
        tom: '01-02-2019',
        fordelBeregningsgrunnlagAndeler: [fordelAndel],
        harPeriodeAarsakGraderingEllerRefusjon: true,
      },
      {
        fom: '02-02-2019',
        tom: null,
        fordelBeregningsgrunnlagAndeler: [{ ...fordelAndel, refusjonskravPrAar: 100_000 }],
        harPeriodeAarsakGraderingEllerRefusjon: true,
      },
    ];
    const bgPerioder = [
      {
        beregningsgrunnlagPeriodeFom: '01-01-2019',
        beregningsgrunnlagPeriodeTom: '01-02-2019',
        periodeAarsaker: [],
        bruttoPrAar: 500_000,
      },
      {
        beregningsgrunnlagPeriodeFom: '02-02-2019',
        beregningsgrunnlagPeriodeTom: null,
        periodeAarsaker: [periodeAarsak.ENDRING_I_AKTIVITETER_SØKT_FOR],
        bruttoPrAar: 500_000,
      },
    ];
    const nyePerioder = slåSammenPerioder(perioder, bgPerioder);
    expect(nyePerioder.length).to.equal(2);
    expect(nyePerioder[0].fom).to.equal('01-01-2019');
    expect(nyePerioder[0].tom).to.equal('01-02-2019');
    expect(nyePerioder[1].fom).to.equal('02-02-2019');
    expect(nyePerioder[1].tom).to.equal(null);
  });

  it('skal returnere liste med to periode om andre periode har endring i søkt ytelse med endring i brutto', () => {
    const perioder = [
      {
        fom: '01-01-2019',
        tom: '01-02-2019',
        fordelBeregningsgrunnlagAndeler: [fordelAndel],
        harPeriodeAarsakGraderingEllerRefusjon: true,
      },
      {
        fom: '02-02-2019',
        tom: null,
        fordelBeregningsgrunnlagAndeler: [fordelAndel],
        harPeriodeAarsakGraderingEllerRefusjon: true,
      },
    ];
    const bgPerioder = [
      {
        beregningsgrunnlagPeriodeFom: '01-01-2019',
        beregningsgrunnlagPeriodeTom: '01-02-2019',
        periodeAarsaker: [],
        bruttoPrAar: 500_000,
      },
      {
        beregningsgrunnlagPeriodeFom: '02-02-2019',
        beregningsgrunnlagPeriodeTom: null,
        periodeAarsaker: [periodeAarsak.ENDRING_I_AKTIVITETER_SØKT_FOR],
        bruttoPrAar: 200_000,
      },
    ];
    const nyePerioder = slåSammenPerioder(perioder, bgPerioder);
    expect(nyePerioder.length).to.equal(2);
    expect(nyePerioder[0].fom).to.equal('01-01-2019');
    expect(nyePerioder[0].tom).to.equal('01-02-2019');
    expect(nyePerioder[1].fom).to.equal('02-02-2019');
    expect(nyePerioder[1].tom).to.equal(null);
  });

  it('skal returnere liste med to periode om andre periode har endring i søkt ytelse med ulikt antall andeler', () => {
    const perioder = [
      {
        fom: '01-01-2019',
        tom: '01-02-2019',
        fordelBeregningsgrunnlagAndeler: [fordelAndel, fordelAndel2],
        harPeriodeAarsakGraderingEllerRefusjon: true,
      },
      {
        fom: '02-02-2019',
        tom: null,
        fordelBeregningsgrunnlagAndeler: [fordelAndel],
        harPeriodeAarsakGraderingEllerRefusjon: true,
      },
    ];
    const bgPerioder = [
      {
        beregningsgrunnlagPeriodeFom: '01-01-2019',
        beregningsgrunnlagPeriodeTom: '01-02-2019',
        periodeAarsaker: [periodeAarsak.ENDRING_I_AKTIVITETER_SØKT_FOR],
        bruttoPrAar: 500_000,
      },
      {
        beregningsgrunnlagPeriodeFom: '02-02-2019',
        beregningsgrunnlagPeriodeTom: null,
        periodeAarsaker: [periodeAarsak.ENDRING_I_AKTIVITETER_SØKT_FOR],
        bruttoPrAar: 500_000,
      },
    ];
    const nyePerioder = slåSammenPerioder(perioder, bgPerioder);
    expect(nyePerioder.length).to.equal(2);
    expect(nyePerioder[0].fom).to.equal('01-01-2019');
    expect(nyePerioder[0].tom).to.equal('01-02-2019');
    expect(nyePerioder[1].fom).to.equal('02-02-2019');
    expect(nyePerioder[1].tom).to.equal(null);
  });

});
