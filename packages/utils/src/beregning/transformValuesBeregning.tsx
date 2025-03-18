import beregningAvklaringsbehovCodes from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovCodes';
import mapTilAksjonspunktkode from './mapAksjonspunktkoderBeregning';

const transformBeregningValues = aksjonspunktData =>
  aksjonspunktData.flatMap(data => {
    if (
      data.kode === beregningAvklaringsbehovCodes.OVERSTYRING_AV_BEREGNINGSGRUNNLAG ||
      data.kode === beregningAvklaringsbehovCodes.OVERSTYRING_AV_BEREGNINGSAKTIVITETER
    ) {
      return data.grunnlag.map(gr => ({
        kode: mapTilAksjonspunktkode(data.kode),
        ...gr,
      }));
    }
    const nyData = { ...data };
    nyData.kode = mapTilAksjonspunktkode(data.kode);
    nyData.begrunnelse = '';
    return nyData;
  });

export default transformBeregningValues;
