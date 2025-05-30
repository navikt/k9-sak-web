import {
  BehandlingDtoType as KlageBehandlingDtoType,
  BehandlingDtoBehandlingResultatType as klageBehandlingsresultat,
} from '@k9-sak-web/backend/k9klage/generated/types.js';
import { FagsakYtelsesType, fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { erFagytelseTypeUtvidetRett } from '@k9-sak-web/gui/utils/utvidetRettHjelpfunksjoner.js';
import { TIDENES_ENDE } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import { KodeverkNavnFraKodeType } from '@k9-sak-web/lib/kodeverk/types.js';
import { KodeverkType } from '@k9-sak-web/lib/kodeverk/types/KodeverkType.js';
import {
  AvslagsårsakPrPeriodeDto,
  BeregningsgrunnlagPeriodeDto,
  TilbakekrevingValgDto,
  TilbakekrevingValgDtoVidereBehandling,
} from '@navikt/k9-sak-typescript-client';
import moment from 'moment';
import VedtakSimuleringResultat from '../types/VedtakSimuleringResultat';

const erTilbakekrevingType = (type: string | undefined | { kode: string }) => {
  if (typeof type === 'string') {
    return KlageBehandlingDtoType.TILBAKEKREVING === type || KlageBehandlingDtoType.REVURDERING_TILBAKEKREVING === type;
  }
  return (
    KlageBehandlingDtoType.TILBAKEKREVING === type?.kode ||
    KlageBehandlingDtoType.REVURDERING_TILBAKEKREVING === type?.kode
  );
};

const tilbakekrevingMedInntrekk = (
  tilbakekrevingKode: TilbakekrevingValgDto['videreBehandling'],
  simuleringResultat: VedtakSimuleringResultat,
) =>
  tilbakekrevingKode === TilbakekrevingValgDtoVidereBehandling.OPPRETT_TILBAKEKREVING &&
  (simuleringResultat.simuleringResultat?.sumInntrekk || simuleringResultat.simuleringResultatUtenInntrekk);

export const findTilbakekrevingText = (props: {
  simuleringResultat: VedtakSimuleringResultat;
  tilbakekrevingvalg?: TilbakekrevingValgDto;
  kodeverkNavnFraKode: KodeverkNavnFraKodeType;
  behandlingType: string | undefined;
}) => {
  const { simuleringResultat, tilbakekrevingvalg, kodeverkNavnFraKode, behandlingType } = props;
  if (tilbakekrevingvalg !== null && tilbakekrevingvalg !== undefined && erTilbakekrevingType(behandlingType)) {
    if (tilbakekrevingMedInntrekk(tilbakekrevingvalg.videreBehandling, simuleringResultat)) {
      return 'VedtakForm.TilbakekrInfotrygdOgInntrekk';
    }
    return tilbakekrevingvalg.videreBehandling != null
      ? kodeverkNavnFraKode(tilbakekrevingvalg.videreBehandling, KodeverkType.TILBAKEKR_VIDERE_BEH)
      : null;
  }
  return null;
};

export const findDelvisInnvilgetResultatText = (behandlingResultatTypeKode: string, ytelseType: FagsakYtelsesType) => {
  if (behandlingResultatTypeKode === klageBehandlingsresultat.KLAGE_YTELSESVEDTAK_STADFESTET) {
    return 'VedtakForm.ResultatOpprettholdVedtak';
  }
  if (behandlingResultatTypeKode === klageBehandlingsresultat.KLAGE_MEDHOLD) {
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

  if (ytelseType === fagsakYtelsesType.OPPLÆRINGSPENGER) {
    return 'VedtakForm.VilkarStatusDelvisInnvilgetOpplæringspenger';
  }

  return 'VedtakForm.VilkarStatusDelvisInnvilgetPleiepenger';
};

export const findInnvilgetResultatText = (behandlingResultatTypeKode: string, ytelseType: FagsakYtelsesType) => {
  if (behandlingResultatTypeKode === klageBehandlingsresultat.KLAGE_YTELSESVEDTAK_STADFESTET) {
    return 'VedtakForm.ResultatOpprettholdVedtak';
  }
  if (behandlingResultatTypeKode === klageBehandlingsresultat.KLAGE_MEDHOLD) {
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

  if (ytelseType === fagsakYtelsesType.OPPLÆRINGSPENGER) {
    return 'VedtakForm.VilkarStatusInnvilgetOpplæringspenger';
  }

  return 'VedtakForm.VilkarStatusInnvilgetPleiepenger';
};

export const findAvslagResultatText = (behandlingResultatTypeKode: string, ytelseType: FagsakYtelsesType) => {
  if (behandlingResultatTypeKode === klageBehandlingsresultat.KLAGE_YTELSESVEDTAK_OPPHEVET) {
    return 'VedtakForm.ResultatKlageYtelsesvedtakOpphevet';
  }
  if (behandlingResultatTypeKode === klageBehandlingsresultat.KLAGE_AVVIST) {
    return 'VedtakForm.ResultatKlageAvvist';
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

  if (ytelseType === fagsakYtelsesType.OPPLÆRINGSPENGER) {
    return 'VedtakForm.OpplæringspengerIkkeInnvilget';
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
