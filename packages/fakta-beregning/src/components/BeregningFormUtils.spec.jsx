import { expect } from 'chai';
import avklaringsbehovCodes from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovCodes';
import { lagStateMedAvklaringsbehovOgBeregningsgrunnlag } from './beregning-test-helper';
import {
  formNameVurderFaktaBeregning,
  getFormInitialValuesForBeregning,
  getFormValuesForBeregning,
} from './BeregningFormUtils';

const { VURDER_FAKTA_FOR_ATFL_SN, AVKLAR_AKTIVITETER } = avklaringsbehovCodes;
const fellesAksjonspunkt = { definisjon: VURDER_FAKTA_FOR_ATFL_SN };
const avklarAktiviteterAksjonspunkt = { definisjon: AVKLAR_AKTIVITETER };
const avklaringsbehov = [fellesAksjonspunkt, avklarAktiviteterAksjonspunkt];

const behandlingProps = {
  behandlingId: 1000051,
  behandlingVersjon: 1,
};

describe('<BeregningFormUtils>', () => {
  it('skal returnere udefinert om values er udefinert', () => {
    const formValues = getFormValuesForBeregning.resultFunc(undefined, undefined);
    expect(formValues).to.equal(undefined);
  });

  it('skal returnere values', () => {
    const values = {
      test: 'test',
    };
    const state = lagStateMedAvklaringsbehovOgBeregningsgrunnlag(
      avklaringsbehov,
      {},
      formNameVurderFaktaBeregning,
      values,
    );
    const formValues = getFormValuesForBeregning(state, behandlingProps);
    expect(formValues.test).to.equal('test');
  });

  it('skal returnere initialvalues', () => {
    const values = {
      test: 'test',
    };
    const state = lagStateMedAvklaringsbehovOgBeregningsgrunnlag(
      avklaringsbehov,
      {},
      formNameVurderFaktaBeregning,
      {},
      values,
    );
    const formValues = getFormInitialValuesForBeregning(state, behandlingProps);
    expect(formValues.test).to.equal('test');
  });
});
