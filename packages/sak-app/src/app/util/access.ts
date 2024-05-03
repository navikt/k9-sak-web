import behandlingStatusCode from '@k9-sak-web/kodeverk/src/behandlingStatus';
import BehandlingType from '@k9-sak-web/kodeverk/src/behandlingType';
import fagsakStatusCode from '@k9-sak-web/kodeverk/src/fagsakStatus';
import { Kodeverk, NavAnsatt } from '@k9-sak-web/types';

type Aksess = {
  employeeHasAccess: boolean;
  isEnabled: boolean;
};

export type AksessRettigheter = {
  writeAccess: Aksess;
  kanOverstyreAccess: Aksess;
};

const kanVeilede = (navAnsatt: NavAnsatt): boolean => navAnsatt && navAnsatt.kanVeilede;
const kanSaksbehandle = (navAnsatt: NavAnsatt): boolean => navAnsatt && navAnsatt.kanSaksbehandle;
const kanOverstyre = (navAnsatt: NavAnsatt): boolean => kanSaksbehandle(navAnsatt) && navAnsatt.kanOverstyre;
const isBehandlingAvTilbakekreving = (type: Kodeverk): boolean =>
  type ? type.kode === BehandlingType.TILBAKEKREVING || type.kode === BehandlingType.TILBAKEKREVING_REVURDERING : false;

const accessibleFor =
  (validNavAnsattPredicates: ((navAnsatt: NavAnsatt) => boolean)[]) =>
  (navAnsatt: NavAnsatt): boolean =>
    validNavAnsattPredicates.some(predicate => predicate(navAnsatt));

const enabledFor =
  (validFagsakStauses: string[], validBehandlingStatuses: string[]) =>
  (fagsakStatus: Kodeverk, behandlingStatus: Kodeverk, isTilbakekrevingBehandling: boolean): boolean =>
    (isTilbakekrevingBehandling || (fagsakStatus && validFagsakStauses.includes(fagsakStatus.kode))) &&
    behandlingStatus &&
    validBehandlingStatuses.includes(behandlingStatus.kode);

const accessSelector =
  (
    validNavAnsattPredicates: ((navAnsatt: NavAnsatt) => boolean)[],
    validFagsakStatuses: string[],
    validBehandlingStatuses: string[],
  ) =>
  (navAnsatt: NavAnsatt, fagsakStatus: Kodeverk, behandlingStatus: Kodeverk, behandlingType: Kodeverk): Aksess => {
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

export const kanOverstyreAccess = accessSelector(
  [kanOverstyre],
  [fagsakStatusCode.UNDER_BEHANDLING],
  [behandlingStatusCode.BEHANDLING_UTREDES],
);

const getAccessRights = (
  navAnsatt: NavAnsatt,
  fagsakStatus: Kodeverk,
  behandlingStatus: Kodeverk,
  behandlingType: Kodeverk,
): AksessRettigheter => ({
  writeAccess: writeAccess(behandlingType)(navAnsatt, fagsakStatus, behandlingStatus, behandlingType),
  kanOverstyreAccess: kanOverstyreAccess(navAnsatt, fagsakStatus, behandlingStatus, behandlingType),
});

export default getAccessRights;
