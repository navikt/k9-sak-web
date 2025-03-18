import beregningAvklaringsbehovCodes from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovCodes';
import mapTilAksjonspunktkode from './mapAksjonspunktkoderBeregning';

const transformBeregningValues = (aksjonspunktData, omitBegrunnelse?: boolean) =>
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
    if (omitBegrunnelse) {
      nyData.begrunnelse = 'Se i Kalkulus for begrunnelser.';
    }
    return nyData;
  });

export default transformBeregningValues;
