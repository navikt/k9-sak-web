import moment from 'moment';
import { createSelector } from 'reselect';

import { isBGAksjonspunktSomGirFritekstfelt } from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import behandlingStatusCode from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import klageVurdering from '@fpsak-frontend/kodeverk/src/klageVurdering';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import tilbakekrevingVidereBehandling from '@fpsak-frontend/kodeverk/src/tilbakekrevingVidereBehandling';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { getKodeverknavnFn } from '@fpsak-frontend/utils';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { erFagytelseTypeUtvidetRett } from '@k9-sak-web/gui/utils/utvidetRettHjelpfunksjoner.js';
import { TIDENES_ENDE } from '@k9-sak-web/lib/dateUtils/dateUtils';

const tilbakekrevingMedInntrekk = (tilbakekrevingKode, simuleringResultat) =>
  tilbakekrevingKode === tilbakekrevingVidereBehandling.TILBAKEKR_OPPRETT &&
  (simuleringResultat.simuleringResultat.sumInntrekk || simuleringResultat.simuleringResultatUtenInntrekk);

export const findTilbakekrevingText = createSelector(
  [ownProps => ownProps.simuleringResultat, ownProps => ownProps.tilbakekrevingvalg, ownProps => ownProps.alleKodeverk],
  (simuleringResultat, tilbakekrevingValg, alleKodeverk) => {
    if (tilbakekrevingValg !== null && tilbakekrevingValg !== undefined) {
      if (tilbakekrevingMedInntrekk(tilbakekrevingValg.videreBehandling.kode, simuleringResultat)) {
        return 'VedtakForm.TilbakekrInfotrygdOgInntrekk';
      }
      const getKodeverkNavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);
      return getKodeverkNavn(tilbakekrevingValg.videreBehandling);
    }
    return null;
  },
);

export const findDelvisInnvilgetResultatText = (behandlingResultatTypeKode, ytelseType) => {
  if (behandlingResultatTypeKode === behandlingResultatType.KLAGE_YTELSESVEDTAK_STADFESTET) {
    return 'VedtakForm.ResultatOpprettholdVedtak';
  }
  if (behandlingResultatTypeKode === behandlingResultatType.KLAGE_MEDHOLD) {
    return 'VedtakForm.ResultatKlageMedhold';
  }

  if (ytelseType === fagsakYtelsesType.OMSORGSPENGER) {
    return 'VedtakForm.VilkarStatusDelvisInnvilgetOmsorgspenger';
  }

  if (ytelseType === fagsakYtelsesType.FRISINN) {
    return 'VedtakForm.VilkarStatusDelvisInnvilgetFrisinn';
  }

  if (erFagytelseTypeUtvidetRett(ytelseType)) {
    return 'VedtakForm.VilkarStatusDelvisInnvilgetUtvidetRett';
  }

  if (ytelseType === fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE) {
    return 'VedtakForm.VilkarStatusDelvisInnvilgetLivetsSluttfase';
  }

  return 'VedtakForm.VilkarStatusDelvisInnvilgetPleiepenger';
};

export const findInnvilgetResultatText = (behandlingResultatTypeKode, ytelseType) => {
  if (behandlingResultatTypeKode === behandlingResultatType.KLAGE_YTELSESVEDTAK_STADFESTET) {
    return 'VedtakForm.ResultatOpprettholdVedtak';
  }
  if (behandlingResultatTypeKode === behandlingResultatType.KLAGE_MEDHOLD) {
    return 'VedtakForm.ResultatKlageMedhold';
  }

  if (ytelseType === fagsakYtelsesType.OMSORGSPENGER) {
    return 'VedtakForm.VilkarStatusInnvilgetOmsorgspenger';
  }

  if (ytelseType === fagsakYtelsesType.FRISINN) {
    return 'VedtakForm.VilkarStatusInnvilgetFrisinn';
  }

  if (erFagytelseTypeUtvidetRett(ytelseType)) {
    return 'VedtakForm.VilkarStatusInnvilgetUtvidetRett';
  }

  if (ytelseType === fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE) {
    return 'VedtakForm.VilkarStatusInnvilgetLivetsSluttfase';
  }

  if (ytelseType === fagsakYtelsesType.UNGDOMSYTELSE) {
    return 'VedtakForm.VilkarStatusInnvilgetUngdomsytelse';
  }

  return 'VedtakForm.VilkarStatusInnvilgetPleiepenger';
};

export const findAvslagResultatText = (behandlingResultatTypeKode, ytelseType) => {
  if (behandlingResultatTypeKode === behandlingResultatType.KLAGE_YTELSESVEDTAK_OPPHEVET) {
    return 'VedtakForm.ResultatKlageYtelsesvedtakOpphevet';
  }
  if (behandlingResultatTypeKode === behandlingResultatType.KLAGE_AVVIST) {
    return 'VedtakForm.ResultatKlageAvvist';
  }

  if (ytelseType === fagsakYtelsesType.OMSORGSPENGER) {
    return 'VedtakForm.OmsorgspengerIkkeInnvilget';
  }

  if (ytelseType === fagsakYtelsesType.OMSORGSPENGER) {
    return 'VedtakForm.OmsorgspengerIkkeInnvilget';
  }

  if (erFagytelseTypeUtvidetRett(ytelseType)) {
    return 'VedtakForm.UtvidetRettIkkeInnvilget';
  }

  if (ytelseType === fagsakYtelsesType.FRISINN) {
    return 'VedtakForm.FrisinnIkkeInnvilget';
  }

  if (ytelseType === fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE) {
    return 'VedtakForm.LivetsSluttfaseIkkeInnvilget';
  }

  if (ytelseType === fagsakYtelsesType.UNGDOMSYTELSE) {
    return 'VedtakForm.UngdomsytelseIkkeInnvilget';
  }

  return 'VedtakForm.PleiepengerIkkeInnvilget';
};

export const hasIkkeOppfyltSoknadsfristvilkar = vilkar =>
  vilkar.some(
    v =>
      v.vilkarType.kode === vilkarType.SOKNADFRISTVILKARET &&
      Array.isArray(v.perioder) &&
      v.perioder.some(periode => periode.vilkarStatus.kode === vilkarUtfallType.IKKE_OPPFYLT),
  );

export const medholdIKlage = klageVurderingResultat =>
  klageVurderingResultat && klageVurderingResultat.klageVurdering === klageVurdering.MEDHOLD_I_KLAGE;

export const hasKlageVurderingSomIkkeErAvvist = (klageVurderingResultatNFP, klageVurderingResultatNK) => {
  const isKlageVurderingNfpAvvisKlage =
    klageVurderingResultatNFP && klageVurderingResultatNFP.klageVurdering === klageVurdering.AVVIS_KLAGE;
  const isKlageVurderingNkAvvisKlage =
    klageVurderingResultatNK && klageVurderingResultatNK.klageVurdering === klageVurdering.AVVIS_KLAGE;
  const isKlageVurderingNkMedholdKlage =
    klageVurderingResultatNK && klageVurderingResultatNK.klageVurdering === klageVurdering.MEDHOLD_I_KLAGE;
  return !(isKlageVurderingNfpAvvisKlage || isKlageVurderingNkAvvisKlage || isKlageVurderingNkMedholdKlage);
};

export const shouldGiveBegrunnelse = (klageVurderingResultatNK, klageVurderingResultatNFP, vilkar, behandlingStatus) =>
  behandlingStatus === behandlingStatusCode.BEHANDLING_UTREDES &&
  (hasIkkeOppfyltSoknadsfristvilkar(vilkar) ||
    hasKlageVurderingSomIkkeErAvvist(klageVurderingResultatNFP, klageVurderingResultatNK));

export const skalSkriveFritekstGrunnetFastsettingAvBeregning = (beregningsgrunnlag, aksjonspunkter) => {
  if (!beregningsgrunnlag || !aksjonspunkter || beregningsgrunnlag.length === 0) {
    return false;
  }
  const behandlingHarLøstBGAP = aksjonspunkter.find(
    ap => isBGAksjonspunktSomGirFritekstfelt(ap.definisjon.kode) && ap.status.kode === aksjonspunktStatus.UTFORT,
  );

  const alleAndelerFørstePerioder = beregningsgrunnlag
    .map(bg => bg.beregningsgrunnlagPeriode[0])
    .flatMap(periode => periode.beregningsgrunnlagPrStatusOgAndel);
  const andelSomErManueltFastsatt = alleAndelerFørstePerioder.find(
    andel => andel.overstyrtPrAar || andel.overstyrtPrAar === 0,
  );
  return !!behandlingHarLøstBGAP || !!andelSomErManueltFastsatt;
};

export const finnSistePeriodeMedAvslagsårsakBeregning = (perioderMedAvslag, bgPerioder) => {
  if (!perioderMedAvslag || perioderMedAvslag.length < 1) {
    return null;
  }
  const kronologiskeBGPerioder = bgPerioder
    .filter(periode => periode.beregningsgrunnlagPeriodeTom !== TIDENES_ENDE)
    .sort((a, b) => moment(a.beregningsgrunnlagPeriodeFom) - moment(b.beregningsgrunnlagPeriodeFom));
  if (kronologiskeBGPerioder.length < 1) {
    return null;
  }
  const sisteBGPeriode = kronologiskeBGPerioder[kronologiskeBGPerioder.length - 1];
  return perioderMedAvslag.find(periode => periode.fom === sisteBGPeriode.beregningsgrunnlagPeriodeFom);
};
