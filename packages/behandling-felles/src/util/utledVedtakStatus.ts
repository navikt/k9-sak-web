import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { isAvslag } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { Aksjonspunkt, Behandlingsresultat, Vilkar } from '@k9-sak-web/types';

const hasOnlyClosedAps = (aksjonspunkter: Aksjonspunkt[], vedtakAksjonspunkter: Aksjonspunkt[]) =>
  aksjonspunkter
    .filter(ap => !vedtakAksjonspunkter.some(vap => vap.definisjon.kode === ap.definisjon.kode))
    .every(ap => !isAksjonspunktOpen(ap.status.kode));

const hasOpenOverstyrBeregningAksjonspunkt = (ap: Aksjonspunkt) =>
  ap.definisjon.kode === aksjonspunktCodes.OVERSTYR_BEREGNING && isAksjonspunktOpen(ap.status.kode);

const harVilkårMedStatus = (vilkar: Vilkar[], status: string) =>
  vilkar.some(v => v.perioder.some(periode => periode.vilkarStatus.kode === status));

interface VedtakStatusInnstillinger {
  /**
   * Når true: returnerer IKKE_OPPFYLT tidlig dersom alle relevante aksjonspunkt er lukket
   * og minst ett vilkår har status IKKE_OPPFYLT.
   */
  skalSjekkeIkkeOppfyltVilkår?: boolean;
  /**
   * Når true: åpent OVERSTYR_BEREGNING-aksjonspunkt gir IKKE_VURDERT.
   */
  skalSjekkeOverstyrBeregningAksjonspunkt?: boolean;
}

/**
 * Utleder vedtakstatus basert på vilkår, aksjonspunkt og behandlingsresultat.
 *
 * Standardregler brukes for:
 * - Omsorgspenger
 * - Frisinn
 * - Pleiepenger sluttfase
 * - Unntak
 *
 * Ytelser med avvik:
 * - Opplæringspenger og pleiepenger: skalSjekkeIkkeOppfyltVilkår = false
 * - Ungdomsytelse: skalSjekkeIkkeOppfyltVilkår = false og skalSjekkeOverstyrBeregningAksjonspunkt = false
 */
const utledVedtakStatus = (
  vilkar: Vilkar[],
  aksjonspunkter: Aksjonspunkt[],
  vedtakAksjonspunkter: Aksjonspunkt[],
  behandlingsresultat: Behandlingsresultat,
  innstillinger: VedtakStatusInnstillinger = {},
) => {
  const { skalSjekkeIkkeOppfyltVilkår = true, skalSjekkeOverstyrBeregningAksjonspunkt = true } = innstillinger;

  if (vilkar.length === 0) {
    return vilkarUtfallType.IKKE_VURDERT;
  }

  if (
    skalSjekkeIkkeOppfyltVilkår &&
    hasOnlyClosedAps(aksjonspunkter, vedtakAksjonspunkter) &&
    harVilkårMedStatus(vilkar, vilkarUtfallType.IKKE_OPPFYLT)
  ) {
    return vilkarUtfallType.IKKE_OPPFYLT;
  }

  if (
    harVilkårMedStatus(vilkar, vilkarUtfallType.IKKE_VURDERT) ||
    (skalSjekkeOverstyrBeregningAksjonspunkt && aksjonspunkter.some(hasOpenOverstyrBeregningAksjonspunkt))
  ) {
    return vilkarUtfallType.IKKE_VURDERT;
  }

  if (!hasOnlyClosedAps(aksjonspunkter, vedtakAksjonspunkter)) {
    return vilkarUtfallType.IKKE_VURDERT;
  }

  if (isAvslag(behandlingsresultat.type.kode)) {
    return vilkarUtfallType.IKKE_OPPFYLT;
  }

  return vilkarUtfallType.OPPFYLT;
};

export default utledVedtakStatus;
