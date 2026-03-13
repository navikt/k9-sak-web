import type { BeregningsgrunnlagDto } from '@k9-sak-web/backend/ungsak/kontrakt/aktivitetspenger/BeregningsgrunnlagDto.js';
import { BesteBeregningResultatType } from '@k9-sak-web/backend/ungsak/kontrakt/aktivitetspenger/BesteBeregningResultatType.js';
import type { AktivitetspengerBeregningBackendApiType } from '../../prosess/aktivitetspenger-beregning/AktivitetspengerBeregningBackendApiType.js';
import { ignoreUnusedDeclared } from './ignoreUnusedDeclared.js';

export class FakeAktivitetspengerBeregningBackendApi implements AktivitetspengerBeregningBackendApiType {
  async getBeregningsgrunnnlag(uuid: string): Promise<BeregningsgrunnlagDto> {
    ignoreUnusedDeclared(uuid);
    return {
      beregningsgrunnlag: 500000,
      beregningsgrunnlagRedusert: 429000,
      besteBeregningResultatType: BesteBeregningResultatType.SISTE_ÅR,
      dagsats: 1650,
      pgiÅrsinntekter: [
        {
          årstall: 2025,
          arbeidsinntekt: 400000,
          næring: 220000,
          sum: 620000,
          sumAvkortet: 620000,
          sumAvkortetOgOppjustert: 620000,
        },
        {
          årstall: 2024,
          arbeidsinntekt: 380000,
          næring: 200000,
          sum: 580000,
          sumAvkortet: 560000,
          sumAvkortetOgOppjustert: 592000,
        },
        {
          årstall: 2023,
          arbeidsinntekt: 370000,
          næring: 200000,
          sum: 570000,
          sumAvkortet: 550000,
          sumAvkortetOgOppjustert: 597000,
        },
      ],
      skjæringstidspunkt: '2025-01-01',
      årsinntektSisteTreÅr: 600000,
      årsinntektSisteÅr: 600000,
    };
  }
}
