import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import mapTilAksjonspunktkode from './mapAksjonspunktkoderBeregning';

const transformBeregningValues = aksjonspunktData =>
  aksjonspunktData.flatMap(data => {
    if (data.kode === aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSGRUNNLAG) {
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
