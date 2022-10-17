import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

const transformBeregningValues = aksjonspunktData =>
  aksjonspunktData.flatMap(data => {
    if (data.kode === aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSGRUNNLAG) {
      return data.grunnlag.map(gr => ({
        kode: data.kode,
        ...gr,
      }));
    }
    return data;
  });

export default transformBeregningValues;
