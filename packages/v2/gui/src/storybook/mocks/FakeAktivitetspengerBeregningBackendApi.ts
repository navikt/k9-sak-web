import type { BeregningsgrunnlagDto } from '@k9-sak-web/backend/ungsak/kontrakt/aktivitetspenger/BeregningsgrunnlagDto.js';
import type { AktivitetspengerBeregningBackendApiType } from '../../prosess/aktivitetspenger-beregning/AktivitetspengerBeregningBackendApiType.js';
import { ignoreUnusedDeclared } from './ignoreUnusedDeclared.js';

export class FakeAktivitetspengerBeregningBackendApi implements AktivitetspengerBeregningBackendApiType {
  async getBeregningsgrunnnlag(uuid: string): Promise<BeregningsgrunnlagDto> {
    ignoreUnusedDeclared(uuid);
    return {
      skjæringstidspunkt: '2026-03-17',
      årsinntektSisteÅr: 0,
      årsinntektSisteTreÅr: 93313,
      beregningsgrunnlag: 93313,
      beregningsgrunnlagRedusert: 61587,
      dagsats: 236.87,
      pgiÅrsinntekter: [
        {
          årstall: 2023,
          sum: 250000,
          sumAvkortet: 250000,
          sumAvkortetOgOppjustert: 279940,
          arbeidsinntekt: 0,
          næring: 250000,
        },
        { årstall: 2024, sum: 0, sumAvkortet: 0, sumAvkortetOgOppjustert: 0, arbeidsinntekt: 0, næring: 0 },
        { årstall: 2025, sum: 0, sumAvkortet: 0, sumAvkortetOgOppjustert: 0, arbeidsinntekt: 0, næring: 0 },
      ],
      besteBeregningResultatType: 'SNITT_SISTE_TRE_ÅR',
    };
  }
}
