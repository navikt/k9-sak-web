import { expect } from 'chai';
import avklaringsbehovCodes from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovCodes';
import avklaringsbehovStatus from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovStatus';
import {
  harIkkeEndringerIAvklarAktiviteterMedFlereAvklaringsbehov,
  transformValuesVurderFaktaBeregning,
} from './VurderFaktaBeregningPanel';

const { AVKLAR_AKTIVITETER, VURDER_FAKTA_FOR_ATFL_SN } = avklaringsbehovCodes;

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
      faktaOmberegningTilfeller: [],
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

  it('skal returnere true for endring i avklar med kun avklar aksjonspunkt', () => {
    const aps = [{ definisjon: { kode: AVKLAR_AKTIVITETER } }];
    const knappSkalKunneTrykkes = harIkkeEndringerIAvklarAktiviteterMedFlereAvklaringsbehov(true, aps);
    expect(knappSkalKunneTrykkes).to.equal(true);
  });

  it('skal returnere false for endring i avklar med to avklaringsbehov', () => {
    const aps = [{ definisjon: { kode: AVKLAR_AKTIVITETER } }, { definisjon: { kode: VURDER_FAKTA_FOR_ATFL_SN } }];
    const knappSkalKunneTrykkes = harIkkeEndringerIAvklarAktiviteterMedFlereAvklaringsbehov(true, aps);
    expect(knappSkalKunneTrykkes).to.equal(false);
  });

  it('skal returnere true for ingen endring i avklar med VURDER_FAKTA_FOR_ATFL_SN', () => {
    const aps = [{ definisjon: { kode: VURDER_FAKTA_FOR_ATFL_SN } }];
    const knappSkalKunneTrykkes = harIkkeEndringerIAvklarAktiviteterMedFlereAvklaringsbehov(false, aps);
    expect(knappSkalKunneTrykkes).to.equal(true);
  });

  it('skal returnere true for ingen endring i avklar med to avklaringsbehov', () => {
    const aps = [{ definisjon: { kode: AVKLAR_AKTIVITETER } }, { definisjon: { kode: VURDER_FAKTA_FOR_ATFL_SN } }];
    const knappSkalKunneTrykkes = harIkkeEndringerIAvklarAktiviteterMedFlereAvklaringsbehov(false, aps);
    expect(knappSkalKunneTrykkes).to.equal(true);
  });
});
