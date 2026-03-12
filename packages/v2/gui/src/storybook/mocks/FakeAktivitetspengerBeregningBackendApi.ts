import type { BeregningsgrunnlagDto } from '@k9-sak-web/backend/ungsak/kontrakt/aktivitetspenger/BeregningsgrunnlagDto.js';
import type { AktivitetspengerBeregningBackendApiType } from '../../prosess/aktivitetspenger-beregning/AktivitetspengerBeregningBackendApiType.js';

export class FakeAktivitetspengerBeregningBackendApi implements AktivitetspengerBeregningBackendApiType {
  async getBeregningsgrunnnlag(): Promise<BeregningsgrunnlagDto> {
    return {
      skjæringstidspunkt: '2025-01-01',
      beregningsgrunnlag: 650000,
      beregningsgrunnlagRedusert: 429000,
      besteBeregningResultatType: 'SISTE_ÅR',
      dagsats: 1650,
      årsinntektSisteÅr: 620000,
      årsinntektSisteTreÅr: 590000,
      pgiÅrsinntekter: [
        { årstall: 2024, pgiÅrsinntekt: 620000, avkortetOgOppjustert: 620000 },
        { årstall: 2023, pgiÅrsinntekt: 580000, avkortetOgOppjustert: 592000 },
        { årstall: 2022, pgiÅrsinntekt: 570000, avkortetOgOppjustert: 597000 },
      ],
    };
  }
}
