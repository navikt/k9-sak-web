import { klageBehandlingsresultat } from '@k9-sak-web/backend/k9klage/kodeverk/behandling/KlageBehandlingsresultat.js';
import { erFagytelseTypeUtvidetRett } from '@k9-sak-web/behandling-utvidet-rett/src/utils/utvidetRettHjelpfunksjoner';
import { TIDENES_ENDE } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import { KodeverkNavnFraKodeType } from '@k9-sak-web/lib/kodeverk/types.js';
import { KodeverkType } from '@k9-sak-web/lib/kodeverk/types/KodeverkType.js';
import {
  AvslagsårsakPrPeriodeDto,
  BeregningsgrunnlagPeriodeDto,
  TilbakekrevingValgDto,
  fagsakYtelseType,
  videreBehandling as generatedVidereBehandling,
} from '@navikt/k9-sak-typescript-client';
import moment from 'moment';
import VedtakSimuleringResultat from '../types/VedtakSimuleringResultat';

const tilbakekrevingMedInntrekk = (
  tilbakekrevingKode: TilbakekrevingValgDto['videreBehandling'],
  simuleringResultat: VedtakSimuleringResultat,
) =>
  tilbakekrevingKode === generatedVidereBehandling.OPPRETT_TILBAKEKREVING &&
  (simuleringResultat.simuleringResultat.sumInntrekk || simuleringResultat.simuleringResultatUtenInntrekk);

export const findTilbakekrevingText = (props: {
  simuleringResultat: VedtakSimuleringResultat;
  tilbakekrevingvalg?: TilbakekrevingValgDto;
  kodeverkNavnFraKode: KodeverkNavnFraKodeType;
}) => {
  const { simuleringResultat, tilbakekrevingvalg, kodeverkNavnFraKode } = props;
  if (tilbakekrevingvalg !== null && tilbakekrevingvalg !== undefined) {
    if (tilbakekrevingMedInntrekk(tilbakekrevingvalg.videreBehandling, simuleringResultat)) {
      return 'VedtakForm.TilbakekrInfotrygdOgInntrekk';
    }
    return kodeverkNavnFraKode(tilbakekrevingvalg.videreBehandling, KodeverkType.TILBAKEKR_VIDERE_BEH);
  }
  return null;
};

export const findDelvisInnvilgetResultatText = (behandlingResultatTypeKode: string, ytelseType: string) => {
  if (behandlingResultatTypeKode === klageBehandlingsresultat.KLAGE_YTELSESVEDTAK_STADFESTET) {
    return 'VedtakForm.ResultatOpprettholdVedtak';
  }
  if (behandlingResultatTypeKode === klageBehandlingsresultat.KLAGE_MEDHOLD) {
    return 'VedtakForm.ResultatKlageMedhold';
  }

  if (ytelseType === fagsakYtelseType.OMP) {
    return 'VedtakForm.VilkarStatusDelvisInnvilgetOmsorgspenger';
  }

  if (ytelseType === fagsakYtelseType.FRISINN) {
    return 'VedtakForm.VilkarStatusDelvisInnvilgetFrisinn';
  }

  if (erFagytelseTypeUtvidetRett(ytelseType)) {
    return 'VedtakForm.VilkarStatusDelvisInnvilgetUtvidetRett';
  }

  if (ytelseType === fagsakYtelseType.PPN) {
    return 'VedtakForm.VilkarStatusDelvisInnvilgetLivetsSluttfase';
  }

  return 'VedtakForm.VilkarStatusDelvisInnvilgetPleiepenger';
};

export const findInnvilgetResultatText = (behandlingResultatTypeKode: string, ytelseType: string) => {
  if (behandlingResultatTypeKode === klageBehandlingsresultat.KLAGE_YTELSESVEDTAK_STADFESTET) {
    return 'VedtakForm.ResultatOpprettholdVedtak';
  }
  if (behandlingResultatTypeKode === klageBehandlingsresultat.KLAGE_MEDHOLD) {
    return 'VedtakForm.ResultatKlageMedhold';
  }

  if (ytelseType === fagsakYtelseType.OMP) {
    return 'VedtakForm.VilkarStatusInnvilgetOmsorgspenger';
  }

  if (ytelseType === fagsakYtelseType.FRISINN) {
    return 'VedtakForm.VilkarStatusInnvilgetFrisinn';
  }

  if (erFagytelseTypeUtvidetRett(ytelseType)) {
    return 'VedtakForm.VilkarStatusInnvilgetUtvidetRett';
  }

  if (ytelseType === fagsakYtelseType.PPN) {
    return 'VedtakForm.VilkarStatusInnvilgetLivetsSluttfase';
  }

  return 'VedtakForm.VilkarStatusInnvilgetPleiepenger';
};

export const findAvslagResultatText = (behandlingResultatTypeKode: string, ytelseType: string) => {
  if (behandlingResultatTypeKode === klageBehandlingsresultat.KLAGE_YTELSESVEDTAK_OPPHEVET) {
    return 'VedtakForm.ResultatKlageYtelsesvedtakOpphevet';
  }
  if (behandlingResultatTypeKode === klageBehandlingsresultat.KLAGE_AVVIST) {
    return 'VedtakForm.ResultatKlageAvvist';
  }

  if (ytelseType === fagsakYtelseType.OMP) {
    return 'VedtakForm.OmsorgspengerIkkeInnvilget';
  }

  if (erFagytelseTypeUtvidetRett(ytelseType)) {
    return 'VedtakForm.UtvidetRettIkkeInnvilget';
  }

  if (ytelseType === fagsakYtelseType.FRISINN) {
    return 'VedtakForm.FrisinnIkkeInnvilget';
  }

  if (ytelseType === fagsakYtelseType.PPN) {
    return 'VedtakForm.LivetsSluttfaseIkkeInnvilget';
  }

  return 'VedtakForm.PleiepengerIkkeInnvilget';
};

export const finnSistePeriodeMedAvslagsårsakBeregning = (
  perioderMedAvslag: AvslagsårsakPrPeriodeDto[],
  bgPerioder: BeregningsgrunnlagPeriodeDto[],
) => {
  if (!perioderMedAvslag || perioderMedAvslag.length < 1) {
    return null;
  }
  const kronologiskeBGPerioder = bgPerioder
    .filter(periode => periode.beregningsgrunnlagPeriodeTom !== TIDENES_ENDE)
    .sort((a, b) => {
      const dateA = moment(a.beregningsgrunnlagPeriodeFom);
      const dateB = moment(b.beregningsgrunnlagPeriodeFom);
      if (dateA.isBefore(dateB)) return -1;
      if (dateA.isAfter(dateB)) return 1;
      return 0;
    });
  if (kronologiskeBGPerioder.length < 1) {
    return null;
  }
  const sisteBGPeriode = kronologiskeBGPerioder[kronologiskeBGPerioder.length - 1];
  return perioderMedAvslag.find(periode => periode.fom === sisteBGPeriode.beregningsgrunnlagPeriodeFom);
};
