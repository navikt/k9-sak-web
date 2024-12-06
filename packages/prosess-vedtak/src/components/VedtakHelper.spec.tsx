import { klageBehandlingsresultat } from '@k9-sak-web/backend/k9klage/kodeverk/behandling/KlageBehandlingsresultat.js';
import {
  avslagsårsak,
  AvslagsårsakPrPeriodeDto,
  behandlingResultatType,
  BeregningsgrunnlagPeriodeDto,
  fagsakYtelseType,
  videreBehandling,
} from '@navikt/k9-sak-typescript-client';
import {
  findAvslagResultatText,
  findDelvisInnvilgetResultatText,
  findInnvilgetResultatText,
  findTilbakekrevingText,
  finnSistePeriodeMedAvslagsårsakBeregning,
} from './VedtakHelper';

describe('VedtakHelper', () => {
  describe('findTilbakekrevingText', () => {
    it('should return correct text for tilbakekreving with inntrekk', () => {
      const simuleringResultat = {
        simuleringResultat: { sumInntrekk: 1000 },
        simuleringResultatUtenInntrekk: null,
      };
      const tilbakekrevingvalg = {
        videreBehandling: videreBehandling.OPPRETT_TILBAKEKREVING,
        erTilbakekrevingVilkårOppfylt: false,
      };
      const kodeverkNavnFraKode = vi.fn().mockReturnValue('Tilbakekreving');

      const result = findTilbakekrevingText({ simuleringResultat, tilbakekrevingvalg, kodeverkNavnFraKode });
      expect(result).toBe('VedtakForm.TilbakekrInfotrygdOgInntrekk');
    });

    it('should return correct text for tilbakekreving without inntrekk', () => {
      const simuleringResultat = {
        simuleringResultat: { sumInntrekk: 0 },
        simuleringResultatUtenInntrekk: null,
      };
      const tilbakekrevingvalg = {
        videreBehandling: videreBehandling.OPPRETT_TILBAKEKREVING,
        erTilbakekrevingVilkårOppfylt: false,
      };
      const kodeverkNavnFraKode = vi.fn().mockReturnValue('Tilbakekreving');

      const result = findTilbakekrevingText({ simuleringResultat, tilbakekrevingvalg, kodeverkNavnFraKode });
      expect(result).toBe('Tilbakekreving');
    });
  });

  describe('findDelvisInnvilgetResultatText', () => {
    it('should return correct text for klage ytelsesvedtak stadfestet', () => {
      const result = findDelvisInnvilgetResultatText(
        klageBehandlingsresultat.KLAGE_YTELSESVEDTAK_STADFESTET,
        fagsakYtelseType.OMP,
      );
      expect(result).toBe('VedtakForm.ResultatOpprettholdVedtak');
    });

    it('should return correct text for klage medhold', () => {
      const result = findDelvisInnvilgetResultatText(klageBehandlingsresultat.KLAGE_MEDHOLD, fagsakYtelseType.OMP);
      expect(result).toBe('VedtakForm.ResultatKlageMedhold');
    });

    it('should return correct text for omsorgspenger', () => {
      const result = findDelvisInnvilgetResultatText(behandlingResultatType.INNVILGET, fagsakYtelseType.OMP);
      expect(result).toBe('VedtakForm.VilkarStatusDelvisInnvilgetOmsorgspenger');
    });

    it('should return correct text for frisinn', () => {
      const result = findDelvisInnvilgetResultatText(behandlingResultatType.INNVILGET, fagsakYtelseType.FRISINN);
      expect(result).toBe('VedtakForm.VilkarStatusDelvisInnvilgetFrisinn');
    });
  });

  describe('findInnvilgetResultatText', () => {
    it('should return correct text for klage ytelsesvedtak stadfestet', () => {
      const result = findInnvilgetResultatText(
        klageBehandlingsresultat.KLAGE_YTELSESVEDTAK_STADFESTET,
        fagsakYtelseType.OMP,
      );
      expect(result).toBe('VedtakForm.ResultatOpprettholdVedtak');
    });

    it('should return correct text for klage medhold', () => {
      const result = findInnvilgetResultatText(klageBehandlingsresultat.KLAGE_MEDHOLD, fagsakYtelseType.OMP);
      expect(result).toBe('VedtakForm.ResultatKlageMedhold');
    });

    it('should return correct text for omsorgspenger', () => {
      const result = findInnvilgetResultatText(behandlingResultatType.INNVILGET, fagsakYtelseType.OMP);
      expect(result).toBe('VedtakForm.VilkarStatusInnvilgetOmsorgspenger');
    });

    it('should return correct text for frisinn', () => {
      const result = findInnvilgetResultatText(behandlingResultatType.INNVILGET, fagsakYtelseType.FRISINN);
      expect(result).toBe('VedtakForm.VilkarStatusInnvilgetFrisinn');
    });
  });

  describe('findAvslagResultatText', () => {
    it('should return correct text for klage ytelsesvedtak opphevet', () => {
      const result = findAvslagResultatText(
        klageBehandlingsresultat.KLAGE_YTELSESVEDTAK_OPPHEVET,
        fagsakYtelseType.OMP,
      );
      expect(result).toBe('VedtakForm.ResultatKlageYtelsesvedtakOpphevet');
    });

    it('should return correct text for klage avvist', () => {
      const result = findAvslagResultatText(klageBehandlingsresultat.KLAGE_AVVIST, fagsakYtelseType.OMP);
      expect(result).toBe('VedtakForm.ResultatKlageAvvist');
    });

    it('should return correct text for omsorgspenger', () => {
      const result = findAvslagResultatText(behandlingResultatType.AVSLÅTT, fagsakYtelseType.OMP);
      expect(result).toBe('VedtakForm.OmsorgspengerIkkeInnvilget');
    });

    it('should return correct text for frisinn', () => {
      const result = findAvslagResultatText(behandlingResultatType.AVSLÅTT, fagsakYtelseType.FRISINN);
      expect(result).toBe('VedtakForm.FrisinnIkkeInnvilget');
    });
  });

  describe('finnSistePeriodeMedAvslagsårsakBeregning', () => {
    it('should return the last period with rejection reason', () => {
      const perioderMedAvslag: AvslagsårsakPrPeriodeDto[] = [
        { fom: '2020-01-01', tom: '2020-01-31', avslagsårsak: avslagsårsak.FOR_LAVT_BG },
        { fom: '2020-02-01', tom: '2020-02-29', avslagsårsak: avslagsårsak.FOR_LAVT_BG },
      ];
      const bgPerioder: BeregningsgrunnlagPeriodeDto[] = [
        { beregningsgrunnlagPeriodeFom: '2020-01-01', beregningsgrunnlagPeriodeTom: '2020-01-31' },
        { beregningsgrunnlagPeriodeFom: '2020-02-01', beregningsgrunnlagPeriodeTom: '2020-02-29' },
      ];

      const result = finnSistePeriodeMedAvslagsårsakBeregning(perioderMedAvslag, bgPerioder);
      expect(result).toEqual({ fom: '2020-02-01', tom: '2020-02-29', avslagsårsak: 'FOR_LAVT_BG' });
    });

    it('should return null if no periods with rejection reason', () => {
      const perioderMedAvslag: AvslagsårsakPrPeriodeDto[] = [];
      const bgPerioder: BeregningsgrunnlagPeriodeDto[] = [
        { beregningsgrunnlagPeriodeFom: '2020-01-01', beregningsgrunnlagPeriodeTom: '2020-01-31' },
        { beregningsgrunnlagPeriodeFom: '2020-02-01', beregningsgrunnlagPeriodeTom: '2020-02-29' },
      ];

      const result = finnSistePeriodeMedAvslagsårsakBeregning(perioderMedAvslag, bgPerioder);
      expect(result).toBeNull();
    });

    it('should return null if no valid bg periods', () => {
      const perioderMedAvslag: AvslagsårsakPrPeriodeDto[] = [
        { fom: '2020-01-01', tom: '2020-01-31', avslagsårsak: avslagsårsak.FOR_LAVT_BG },
        { fom: '2020-02-01', tom: '2020-02-29', avslagsårsak: avslagsårsak.FOR_LAVT_BG },
      ];
      const bgPerioder: BeregningsgrunnlagPeriodeDto[] = [];

      const result = finnSistePeriodeMedAvslagsårsakBeregning(perioderMedAvslag, bgPerioder);
      expect(result).toBeNull();
    });
  });
});
