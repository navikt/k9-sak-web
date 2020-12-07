import behandlingStatusCode from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import fagsakStatusCode from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { NavAnsatt, Kodeverk } from '@k9-sak-web/types';

// TODO (TOR) FLytt alt dette til server

const kanVeilede = (navAnsatt: NavAnsatt) => navAnsatt && navAnsatt.kanVeilede;
const kanSaksbehandle = (navAnsatt: NavAnsatt) => navAnsatt && navAnsatt.kanSaksbehandle;
const isBehandlingAvTilbakekreving = type =>
  type ? type.kode === BehandlingType.TILBAKEKREVING || type.kode === BehandlingType.TILBAKEKREVING_REVURDERING : false;

const accessibleFor = validNavAnsattPredicates => navAnsatt =>
  validNavAnsattPredicates.some(predicate => predicate(navAnsatt));

const enabledFor = (validFagsakStauses, validBehandlingStatuses) => (
  fagsakStatus: Kodeverk,
  behandlingStatus: Kodeverk,
  isTilbakekrevingBehandling: boolean,
) =>
  (isTilbakekrevingBehandling || (fagsakStatus && validFagsakStauses.includes(fagsakStatus.kode))) &&
  behandlingStatus &&
  validBehandlingStatuses.includes(behandlingStatus.kode);

const accessSelector = (validNavAnsattPredicates, validFagsakStatuses, validBehandlingStatuses) => (
  navAnsatt: NavAnsatt,
  fagsakStatus: Kodeverk,
  behandlingStatus: Kodeverk,
  type: Kodeverk,
) => {
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
      isBehandlingAvTilbakekreving(type),
    );
  return { employeeHasAccess, isEnabled };
};

const henleggBehandlingAccessSelector = behandlingstype => {
  const fagsakstatus =
    behandlingstype?.kode === BehandlingType.KLAGE
      ? [fagsakStatusCode.UNDER_BEHANDLING, fagsakStatusCode.LOPENDE, fagsakStatusCode.AVSLUTTET]
      : [fagsakStatusCode.UNDER_BEHANDLING];
  return accessSelector([kanSaksbehandle], fagsakstatus, [
    behandlingStatusCode.OPPRETTET,
    behandlingStatusCode.BEHANDLING_UTREDES,
  ]);
};

export const henleggBehandlingAccess = (navansatt, fagsakstatus, behandlingsstatus, behandlingstype) =>
  henleggBehandlingAccessSelector(behandlingstype)(navansatt, fagsakstatus, behandlingsstatus, behandlingstype);
// https://github.com/navikt/k9-sak-web/compare/Sett-behandling-på-vent
const settBehandlingPaVentAccessSelector = () => {
  return accessSelector(
    [kanSaksbehandle],
    [fagsakStatusCode.UNDER_BEHANDLING],
    [behandlingStatusCode.OPPRETTET, behandlingStatusCode.BEHANDLING_UTREDES, behandlingStatusCode.FORESLA_VEDTAK],
  );
};

export const settBehandlingPaVentAccess = (navAnsatt, fagsakStatus, behandlingStatus, type) =>
  settBehandlingPaVentAccessSelector()(navAnsatt, fagsakStatus, behandlingStatus, type);

export const byttBehandlendeEnhetAccess = accessSelector(
  [kanSaksbehandle],
  [fagsakStatusCode.UNDER_BEHANDLING],
  [behandlingStatusCode.OPPRETTET, behandlingStatusCode.BEHANDLING_UTREDES],
);

const opprettRevurderingAccessSelector = (kanRevurderingOpprettes, sakstype) => {
  if (!kanRevurderingOpprettes) {
    return accessSelector([kanSaksbehandle], [], []);
  }

  // PKMANTIS-1796/PK-54777 Workaround mens endelige regler for opprettelse av behandling avklares
  const fagsakStatus =
    sakstype.kode === fagsakYtelseType.ENGANGSSTONAD
      ? [fagsakStatusCode.AVSLUTTET]
      : [
          fagsakStatusCode.OPPRETTET,
          fagsakStatusCode.UNDER_BEHANDLING,
          fagsakStatusCode.LOPENDE,
          fagsakStatusCode.AVSLUTTET,
        ];
  return accessSelector([kanSaksbehandle], fagsakStatus, [
    behandlingStatusCode.AVSLUTTET,
    behandlingStatusCode.IVERKSETTER_VEDTAK,
  ]);
};

export const opprettRevurderingAccess = (
  navAnsatt,
  fagsakStatus,
  behandlingStatus,
  kanRevurderingOpprettes,
  sakstype,
  type,
) =>
  opprettRevurderingAccessSelector(kanRevurderingOpprettes, sakstype)(navAnsatt, fagsakStatus, behandlingStatus, type);

export const opprettNyForstegangsBehandlingAccess = accessSelector(
  [kanSaksbehandle],
  [fagsakStatusCode.AVSLUTTET],
  [behandlingStatusCode.AVSLUTTET],
);

const infotrygdSelector = skalBehandlesAvInfotrygd => ({
  employeeHasAccess: true,
  isEnabled: skalBehandlesAvInfotrygd,
});

export const sjekkOmSkalTilInfotrygdAccess = skalBehandlesAvInfotrygd => infotrygdSelector(skalBehandlesAvInfotrygd);

export const gjenopptaBehandlingAccess = accessSelector(
  [kanSaksbehandle],
  [fagsakStatusCode.UNDER_BEHANDLING],
  [behandlingStatusCode.BEHANDLING_UTREDES],
);

const opneBehandlingForEndringerAccessSelector = behandlingType => {
  if (!behandlingType || behandlingType.kode !== BehandlingType.REVURDERING) {
    return accessSelector([kanSaksbehandle], [], []);
  }

  return accessSelector(
    [kanSaksbehandle],
    [fagsakStatusCode.UNDER_BEHANDLING],
    [behandlingStatusCode.BEHANDLING_UTREDES],
  );
};

export const opneBehandlingForEndringerAccess = (
  behandlingType: Kodeverk,
  navAnsatt: NavAnsatt,
  fagsakStatus: Kodeverk,
  behandlingStatus: Kodeverk,
) =>
  opneBehandlingForEndringerAccessSelector(behandlingType)(navAnsatt, fagsakStatus, behandlingStatus, behandlingType);

export const allMenuAccessRights = (
  navAnsatt: NavAnsatt,
  fagsakStatus: Kodeverk,
  kanRevurderingOpprettes: boolean,
  skalBehandlesAvInfotrygd: boolean,
  sakstype: Kodeverk,
  behandlingStatus: Kodeverk,
  behandlingType: Kodeverk,
) => ({
  henleggBehandlingAccess: henleggBehandlingAccess(navAnsatt, fagsakStatus, behandlingStatus, behandlingType),
  settBehandlingPaVentAccess: settBehandlingPaVentAccess(navAnsatt, fagsakStatus, behandlingStatus, behandlingType),
  byttBehandlendeEnhetAccess: byttBehandlendeEnhetAccess(navAnsatt, fagsakStatus, behandlingStatus, behandlingType),
  opprettRevurderingAccess: opprettRevurderingAccess(
    navAnsatt,
    fagsakStatus,
    behandlingStatus,
    kanRevurderingOpprettes,
    sakstype,
    behandlingType,
  ),
  opprettNyForstegangsBehandlingAccess: opprettNyForstegangsBehandlingAccess(
    navAnsatt,
    fagsakStatus,
    behandlingStatus,
    behandlingType,
  ),
  gjenopptaBehandlingAccess: gjenopptaBehandlingAccess(navAnsatt, fagsakStatus, behandlingStatus, behandlingType),
  opneBehandlingForEndringerAccess: opneBehandlingForEndringerAccess(
    behandlingType,
    navAnsatt,
    fagsakStatus,
    behandlingStatus,
  ),
  ikkeVisOpprettNyBehandling: sjekkOmSkalTilInfotrygdAccess(skalBehandlesAvInfotrygd),
});
