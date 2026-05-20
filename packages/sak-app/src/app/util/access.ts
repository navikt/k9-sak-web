import behandlingStatusCode from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakStatusCode from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import { Kodeverk, NavAnsatt } from '@k9-sak-web/types';

/**
 * Representerer en tilgangsvurdering for en saksbehandler.
 * - employeeHasAccess: Om den ansatte har riktig rolle (f.eks. saksbehandler, overstyrer).
 * - isEnabled: Om tilgangen er aktiv gitt nåværende fagsak- og behandlingsstatus.
 */
type Aksess = {
  employeeHasAccess: boolean;
  isEnabled: boolean;
};

/** Samlet tilgangsobjekt som returneres fra getAccessRights. */
export type AksessRettigheter = {
  writeAccess: Aksess;
  kanOverstyreAccess: Aksess;
};

// --- Rollepredikat-funksjoner ---

const kanVeilede = (navAnsatt: NavAnsatt): boolean => navAnsatt && navAnsatt.kanVeilede;
const kanSaksbehandle = (navAnsatt: NavAnsatt): boolean => navAnsatt && navAnsatt.kanSaksbehandle;
/** Overstyring krever at den ansatte både kan saksbehandle OG har overstyrerrolle. */
const kanOverstyre = (navAnsatt: NavAnsatt): boolean => kanSaksbehandle(navAnsatt) && navAnsatt.kanOverstyre;

const isBehandlingAvTilbakekreving = (type: Kodeverk | undefined): boolean =>
  type != null
    ? type.kode === BehandlingType.TILBAKEKREVING || type.kode === BehandlingType.TILBAKEKREVING_REVURDERING
    : false;

/**
 * Curried funksjon som sjekker om den ansatte oppfyller minst ett av de gitte rollepredikatene.
 * Brukes for å avgjøre om den ansatte i det hele tatt har tilgang (employeeHasAccess).
 */
const accessibleFor =
  (validNavAnsattPredicates: ((navAnsatt: NavAnsatt) => boolean)[]) =>
  (navAnsatt: NavAnsatt): boolean =>
    validNavAnsattPredicates.some(predicate => predicate(navAnsatt));

/**
 * Curried funksjon som sjekker om fagsak- og behandlingsstatus tillater at handlingen utføres.
 * Tilbakekrevingsbehandlinger hopper over sjekk av fagsakstatus (de er alltid gyldige på fagsaknivå).
 */
const enabledFor =
  (validFagsakStauses: string[], validBehandlingStatuses: string[]) =>
  (fagsakStatus: Kodeverk, behandlingStatus: Kodeverk | undefined, isTilbakekrevingBehandling: boolean): boolean =>
    (isTilbakekrevingBehandling || (fagsakStatus && validFagsakStauses.includes(fagsakStatus.kode))) &&
    behandlingStatus != null &&
    validBehandlingStatuses.includes(behandlingStatus.kode);

/**
 * Bygger en Aksess-selektor ved å kombinere rollepredikat og statusregler.
 *
 * Logikk:
 * 1. Hvis den ansatte er veileder, gis lesetilgang (employeeHasAccess=true) men handlingen
 *    er deaktivert (isEnabled=false). Veiledere skal kun se, ikke endre.
 * 2. Ellers sjekkes rollepredikat (employeeHasAccess) og status (isEnabled) separat.
 *    Begge må slå til for at handlingen faktisk skal være tilgjengelig.
 */
const accessSelector =
  (
    validNavAnsattPredicates: ((navAnsatt: NavAnsatt) => boolean)[],
    validFagsakStatuses: string[],
    validBehandlingStatuses: string[],
  ) =>
  (
    navAnsatt: NavAnsatt,
    fagsakStatus: Kodeverk,
    behandlingStatus: Kodeverk | undefined,
    behandlingType: Kodeverk | undefined,
  ): Aksess => {
    if (kanVeilede(navAnsatt)) {
      return {
        employeeHasAccess: true,
        isEnabled: false,
      };
    }
    const employeeHasAccess = accessibleFor(validNavAnsattPredicates)(navAnsatt);
    const isEnabled =
      employeeHasAccess &&
      enabledFor(validFagsakStatuses, validBehandlingStatuses)(
        fagsakStatus,
        behandlingStatus,
        isBehandlingAvTilbakekreving(behandlingType),
      );
    return { employeeHasAccess, isEnabled };
  };

/**
 * Skrivetilgang for saksbehandlere.
 *
 * Krever rollen "kanSaksbehandle".
 * - For klagebehandlinger tillates skriving i flere fagsakstatuser (inkl. LOPENDE og AVSLUTTET),
 *   fordi klager kan opprettes etter at den opprinnelige saken er avsluttet.
 * - For andre behandlingstyper kreves OPPRETTET eller UNDER_BEHANDLING.
 * - Behandlingen selv må være i status OPPRETTET eller BEHANDLING_UTREDES.
 */
export const writeAccess = behandlingType =>
  accessSelector(
    [kanSaksbehandle],
    behandlingType && behandlingType.kode === BehandlingType.KLAGE
      ? [
          fagsakStatusCode.OPPRETTET,
          fagsakStatusCode.UNDER_BEHANDLING,
          fagsakStatusCode.LOPENDE,
          fagsakStatusCode.AVSLUTTET,
        ]
      : [fagsakStatusCode.OPPRETTET, fagsakStatusCode.UNDER_BEHANDLING],
    [behandlingStatusCode.OPPRETTET, behandlingStatusCode.BEHANDLING_UTREDES],
  );

/**
 * Tilgang til å overstyre vilkår/aksjonspunkter.
 *
 * Krever rollen "kanOverstyre" (som igjen krever "kanSaksbehandle").
 * Kun tillatt når fagsaken er UNDER_BEHANDLING og behandlingen er i BEHANDLING_UTREDES.
 */
export const kanOverstyreAccess = accessSelector(
  [kanOverstyre],
  [fagsakStatusCode.UNDER_BEHANDLING],
  [behandlingStatusCode.BEHANDLING_UTREDES],
);

/**
 * Hovedfunksjonen som beregner alle tilgangsrettigheter for en gitt saksbehandler og behandling.
 *
 * Returnerer et AksessRettigheter-objekt med:
 * - writeAccess: Om saksbehandleren kan gjøre endringer i behandlingen.
 * - kanOverstyreAccess: Om saksbehandleren kan overstyre vilkår/aksjonspunkter.
 */
const getAccessRights = (
  navAnsatt: NavAnsatt,
  fagsakStatus: Kodeverk,
  behandlingStatus: Kodeverk | undefined,
  behandlingType: Kodeverk | undefined,
): AksessRettigheter => ({
  writeAccess: writeAccess(behandlingType)(navAnsatt, fagsakStatus, behandlingStatus, behandlingType),
  kanOverstyreAccess: kanOverstyreAccess(navAnsatt, fagsakStatus, behandlingStatus, behandlingType),
});

export default getAccessRights;
