import beregningAvklaringsbehovCodes from '@k9-sak-web/kodeverk/src/beregningAvklaringsbehovCodes';
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
    return nyData;
  });

export default transformBeregningValues;
