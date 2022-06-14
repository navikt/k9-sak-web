import { expect } from 'chai';
import avklaringsbehovCodes from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovCodes';
import avklaringsbehovStatus from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovStatus';
import faktaOmBeregningTilfelle from "@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle";
import {
  harIkkeEndringerIAvklarAktiviteterMedFlereAvklaringsbehov,
  transformValuesVurderFaktaBeregning,
} from './VurderFaktaBeregningPanel';

const { AVKLAR_AKTIVITETER, VURDER_FAKTA_FOR_ATFL_SN } = avklaringsbehovCodes;
const { VURDER_MOTTAR_YTELSE } = faktaOmBeregningTilfelle;

const avklarAktiviteterAp = {
  id: 1,
  definisjon: {
    kode: AVKLAR_AKTIVITETER,
    navn: 'ap1',
  },
  status: {
    kode: avklaringsbehovStatus.OPPRETTET,
    navn: 's1',
  },
};

describe('<VurderFaktaBeregningPanel>', () => {
  it('skal ikkje transformValues uten aksjonspunkt', () => {
    const faktaOmBeregning = {
      avklarAktiviteter: {
        skjæringstidspunkt: '2020-01-01',
        ventelonnVartpenger: {
          inkludert: null,
        },
      },
      faktaOmBeregningTilfeller: [],
      avklaringsbehov: [avklarAktiviteterAp],
    };
    const values = {
      vurderFaktaListe: [faktaOmBeregning],
    };
    const transformed = transformValuesVurderFaktaBeregning(
      values,
      [{ faktaOmBeregning }],
      [{ periode: { fom: '2020-01-01' } }],
    );
    expect(transformed).to.be.empty;
  });

  it('skal transformValues for 5058 og 6015', () => {
    const faktaOmBeregning = {
      avklarAktiviteter: {
        skjæringstidspunkt: '2020-01-01',
      },
      faktaOmBeregningTilfeller: [{ kode: VURDER_MOTTAR_YTELSE }],
      vurderMottarYtelse: { arbeidstakerAndelerUtenIM: [] }
    };
    const faktaOmBeregning2 = {
      avklarAktiviteter: {
        skjæringstidspunkt: '2020-02-01',
      },
      faktaOmBeregningTilfeller: [{ kode: VURDER_MOTTAR_YTELSE }],
      vurderMottarYtelse: { arbeidstakerAndelerUtenIM: [] }

    };
    const faktaOmBeregning3 = {
      avklarAktiviteter: {
        skjæringstidspunkt: '2020-03-01',
      },
      faktaOmBeregningTilfeller: [{ kode: VURDER_MOTTAR_YTELSE }],
      vurderMottarYtelse: { arbeidstakerAndelerUtenIM: [] }
    };
    const values = {
      vurderFaktaListe: [{
        avklaringsbehov: [{ definisjon: { kode: VURDER_FAKTA_FOR_ATFL_SN }, kanLoses: true }],
        faktaOmBeregning,
        manuellOverstyringRapportertInntekt: true,
        inntektFieldArray: [
          { andelsnr: 1, fastsattBelop: 10000, inntektskategori: 'Arbeidstaker', skalRedigereInntekt: true }
        ],
        erTilVurdering: true,
        tilfeller: faktaOmBeregning.faktaOmBeregningTilfeller
      },
      {
        avklaringsbehov: [{ definisjon: { kode: VURDER_FAKTA_FOR_ATFL_SN }, kanLoses: true }],
        faktaOmBeregning: faktaOmBeregning2,
        manuellOverstyringRapportertInntekt: false,
        erTilVurdering: true,
        tilfeller: faktaOmBeregning2.faktaOmBeregningTilfeller,
        mottarYtelseField_frilans: false
      },
      {
        avklaringsbehov: [{ definisjon: { kode: VURDER_FAKTA_FOR_ATFL_SN }, kanLoses: true }],
        faktaOmBeregning: faktaOmBeregning3,
        manuellOverstyringRapportertInntekt: true,
        inntektFieldArray: [
          { andelsnr: 1, fastsattBelop: 10000, inntektskategori: 'Arbeidstaker', skalRedigereInntekt: true },
          { andelsnr: 2, fastsattBelop: 30000, inntektskategori: 'Arbeidstaker', skalRedigereInntekt: true }
        ],
        erTilVurdering: true,
        tilfeller: faktaOmBeregning3.faktaOmBeregningTilfeller
      }],
    };

    const alleBeregningsgrunnlag = [
      {
        avklaringsbehov: [{ definisjon: { kode: VURDER_FAKTA_FOR_ATFL_SN }, kanLoses: true }],
        faktaOmBeregning
      },
      {
        avklaringsbehov: [{ definisjon: { kode: VURDER_FAKTA_FOR_ATFL_SN }, kanLoses: true }],
        faktaOmBeregning2
      },
      {
        avklaringsbehov: [{ definisjon: { kode: VURDER_FAKTA_FOR_ATFL_SN }, kanLoses: true }],
        faktaOmBeregning3
      }
    ]

    const transformed = transformValuesVurderFaktaBeregning(
      values,
      alleBeregningsgrunnlag,
      [{ periode: { fom: '2020-01-01' } }, { periode: { fom: '2020-02-01' } }, { periode: { fom: '2020-03-01' } }],
    );
    expect(transformed.length).to.equal(3);
    expect(transformed[0].kode).to.equal('5058');
    expect(transformed[0].grunnlag.length).to.equal(1);
    expect(transformed[1].kode).to.equal('6015');
    expect(transformed[1].overstyrteAndeler.length).to.equal(1);
    expect(transformed[2].kode).to.equal('6015');
    expect(transformed[2].overstyrteAndeler.length).to.equal(2);

  });

  it('skal returnere true for endring i avklar med kun avklar aksjonspunkt', () => {
    const aps = [{ definisjon: AVKLAR_AKTIVITETER }];
    const knappSkalKunneTrykkes = harIkkeEndringerIAvklarAktiviteterMedFlereAvklaringsbehov(true, aps);
    expect(knappSkalKunneTrykkes).to.equal(true);
  });

  it('skal returnere false for endring i avklar med to avklaringsbehov', () => {
    const aps = [{ definisjon: AVKLAR_AKTIVITETER }, { definisjon: VURDER_FAKTA_FOR_ATFL_SN }];
    const knappSkalKunneTrykkes = harIkkeEndringerIAvklarAktiviteterMedFlereAvklaringsbehov(true, aps);
    expect(knappSkalKunneTrykkes).to.equal(false);
  });

  it('skal returnere true for ingen endring i avklar med VURDER_FAKTA_FOR_ATFL_SN', () => {
    const aps = [{ definisjon: VURDER_FAKTA_FOR_ATFL_SN }];
    const knappSkalKunneTrykkes = harIkkeEndringerIAvklarAktiviteterMedFlereAvklaringsbehov(false, aps);
    expect(knappSkalKunneTrykkes).to.equal(true);
  });

  it('skal returnere true for ingen endring i avklar med to avklaringsbehov', () => {
    const aps = [{ definisjon: AVKLAR_AKTIVITETER }, { definisjon: VURDER_FAKTA_FOR_ATFL_SN }];
    const knappSkalKunneTrykkes = harIkkeEndringerIAvklarAktiviteterMedFlereAvklaringsbehov(false, aps);
    expect(knappSkalKunneTrykkes).to.equal(true);
  });
});
