import { expect } from 'chai';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import klageVurdering from '@fpsak-frontend/kodeverk/src/klageVurdering';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktKoder from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import {
  hasIkkeOppfyltSoknadsfristvilkar,
  hasKlageVurderingSomIkkeErAvvist,
  skalSkriveFritekstGrunnetFastsettingAvBeregning,
} from './VedtakHelper';

describe('<VedtakHelper>', () => {
  it('hasIkkeOppfyltSoknadsfristvilkar skal returnere true når søknadfristvilkår ikkje er oppfylt', () => {
    const vilkarListe = [
      {
        vilkarType: vilkarType.SOKNADFRISTVILKARET,
        lovReferanse: '§ 22-13, 2. ledd',
        perioder: [
          {
            vilkarStatus: vilkarUtfallType.IKKE_OPPFYLT,
          },
        ],
      },
    ];

    const hasIkkeOppfylt = hasIkkeOppfyltSoknadsfristvilkar(vilkarListe);

    expect(hasIkkeOppfylt).to.eql(true);
  });

  it('hasKlageVurderingSomIkkeErAvvist skal returnere true når klage ikke er avvist', () => {
    const klageVurderingResultatNK = { klageVurdering: klageVurdering.STADFESTE_YTELSESVEDTAK };
    const klageVurderingResultatNFP = { klageVurdering: klageVurdering.STADFESTE_YTELSESVEDTAK };

    const hasIkkeAvvist = hasKlageVurderingSomIkkeErAvvist(klageVurderingResultatNFP, klageVurderingResultatNK);

    expect(hasIkkeAvvist).to.eql(true);
  });

  it('skal skrive fritekst om manuelt fastsatt andel', () => {
    const bg1 = {
      beregningsgrunnlagPeriode: [
        {
          beregningsgrunnlagPrStatusOgAndel: [
            {
              overstyrtPrAar: null,
            },
          ],
        },
        {
          beregningsgrunnlagPrStatusOgAndel: [
            {
              overstyrtPrAar: null,
            },
          ],
        },
      ],
    };
    const bg2 = {
      beregningsgrunnlagPeriode: [
        {
          beregningsgrunnlagPrStatusOgAndel: [
            {
              overstyrtPrAar: 360_000,
            },
          ],
        },
        {
          beregningsgrunnlagPrStatusOgAndel: [
            {
              overstyrtPrAar: 360_000,
            },
          ],
        },
      ],
    };
    const beregningsgrunnlagListe = [bg1, bg2];
    const aksjonspunkt = [
      {
        definisjon: aksjonspunktKoder.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS,
        status: aksjonspunktStatus.UTFORT,
      },
    ];

    const skalSkriveFritekst = skalSkriveFritekstGrunnetFastsettingAvBeregning(beregningsgrunnlagListe, aksjonspunkt);

    expect(skalSkriveFritekst).to.eql(true);
  });
});
