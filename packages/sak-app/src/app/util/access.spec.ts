import fagsakStatusCode from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import behandlingStatusCode from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { NavAnsatt } from '@k9-sak-web/types';

import { kanOverstyreAccess, writeAccess } from './access';

const forEachFagsakAndBehandlingStatus = callback =>
  Object.values(fagsakStatusCode).forEach(fagsakStatus =>
    Object.values(behandlingStatusCode).forEach(behandlingStatus => callback(fagsakStatus, behandlingStatus)),
  );

const getTestName = (accessName, expected, fagsakStatus, behandlingStatus): string =>
  `skal${
    expected ? '' : ' ikke'
  } ha ${accessName} når fagsakStatus er '${fagsakStatus}' og behandlingStatus er '${behandlingStatus}'`;

describe('access', () => {
  const saksbehandlerAnsatt = { kanSaksbehandle: true } as NavAnsatt;
  const veilederAnsatt = { kanVeilede: true } as NavAnsatt;

  describe('writeAccess', () => {
    const validFagsakStatuser = [fagsakStatusCode.OPPRETTET, fagsakStatusCode.UNDER_BEHANDLING];
    const validFagsakStatus = { kode: validFagsakStatuser[0], kodeverk: '' };

    const validBehandlingStatuser = [behandlingStatusCode.OPPRETTET, behandlingStatusCode.BEHANDLING_UTREDES];
    const validBehandlingStatus = { kode: validBehandlingStatuser[0], kodeverk: '' };
    const validBehandlingTyper = { kode: BehandlingType.FORSTEGANGSSOKNAD, kodeverk: '' };

    const behandlingstypeSomIkkeErKlage = { kode: BehandlingType.FORSTEGANGSSOKNAD, kodeverk: '' };
    const klage = { kode: BehandlingType.KLAGE, kodeverk: '' };

    it('saksbehandler skal ha skrivetilgang', () => {
      const accessForSaksbehandler = writeAccess(behandlingstypeSomIkkeErKlage)(
        saksbehandlerAnsatt,
        validFagsakStatus,
        validBehandlingStatus,
        validBehandlingTyper,
      );

      expect(accessForSaksbehandler).toHaveProperty('employeeHasAccess', true);
      expect(accessForSaksbehandler).toHaveProperty('isEnabled', true);
    });

    it('veileder skal ikke ha aktivert skrivetilgang', () => {
      const accessForVeileder = writeAccess(behandlingstypeSomIkkeErKlage)(
        veilederAnsatt,
        validFagsakStatus,
        validBehandlingStatus,
        validBehandlingTyper,
      );

      expect(accessForVeileder).toHaveProperty('employeeHasAccess', true);
      expect(accessForVeileder).toHaveProperty('isEnabled', false);
    });

    forEachFagsakAndBehandlingStatus((fagsakStatus, behandlingStatus, erKlage) => {
      const expected = validFagsakStatuser.includes(fagsakStatus) && validBehandlingStatuser.includes(behandlingStatus);
      const behandlingstype = erKlage ? klage : behandlingstypeSomIkkeErKlage;

      it(`${getTestName('skrivetilgang', expected, fagsakStatus, behandlingStatus)}`, () => {
        const access = writeAccess(behandlingstype)(
          saksbehandlerAnsatt,
          { kode: fagsakStatus, kodeverk: '' },
          { kode: behandlingStatus, kodeverk: '' },
          validBehandlingTyper,
        );

        expect(access).toHaveProperty('isEnabled', expected);
      });
    });
  });

  describe('kanOverstyreAccess', () => {
    const validFagsakStatuser = [fagsakStatusCode.UNDER_BEHANDLING];
    const validFagsakStatus = { kode: validFagsakStatuser[0], kodeverk: '' };

    const validBehandlingStatuser = [behandlingStatusCode.BEHANDLING_UTREDES];
    const validBehandlingStatus = { kode: validBehandlingStatuser[0], kodeverk: '' };
    const validBehandlingTyper = { kode: BehandlingType.FORSTEGANGSSOKNAD, kodeverk: '' };

    const saksbehandlerOgOverstyrerAnsatt = { ...saksbehandlerAnsatt, kanOverstyre: true };
    const veilederOgOverstyrerAnsatt = { ...veilederAnsatt, kanOverstyre: false };

    it('saksbehandler med overstyrer-rolle skal ha tilgang til å overstyre', () => {
      const accessForSaksbehandler = kanOverstyreAccess(
        saksbehandlerOgOverstyrerAnsatt,
        validFagsakStatus,
        validBehandlingStatus,
        validBehandlingTyper,
      );

      expect(accessForSaksbehandler).toHaveProperty('employeeHasAccess', true);
      expect(accessForSaksbehandler).toHaveProperty('isEnabled', true);
    });

    it('saksbehandler uten overstyrer-rolle skal ikke ha tilgang til å overstyre', () => {
      const accessForSaksbehandler = kanOverstyreAccess(
        saksbehandlerAnsatt,
        validFagsakStatus,
        validBehandlingStatus,
        validBehandlingTyper,
      );

      expect(accessForSaksbehandler).toHaveProperty('employeeHasAccess', false);
      expect(accessForSaksbehandler).toHaveProperty('isEnabled', false);
    });

    it('veileder skal ikke ha aktivert tilgang til å overstyre', () => {
      const accessForVeileder = kanOverstyreAccess(
        veilederAnsatt,
        validFagsakStatus,
        validBehandlingStatus,
        validBehandlingTyper,
      );

      expect(accessForVeileder).toHaveProperty('employeeHasAccess', true);
      expect(accessForVeileder).toHaveProperty('isEnabled', false);

      const accessForVeilederOverstyrer = kanOverstyreAccess(
        veilederOgOverstyrerAnsatt,
        validFagsakStatus,
        validBehandlingStatus,
        validBehandlingTyper,
      );

      expect(accessForVeilederOverstyrer).toHaveProperty('employeeHasAccess', true);
      expect(accessForVeilederOverstyrer).toHaveProperty('isEnabled', false);
    });

    forEachFagsakAndBehandlingStatus((fagsakStatus, behandlingStatus) => {
      const expected = validFagsakStatuser.includes(fagsakStatus) && validBehandlingStatuser.includes(behandlingStatus);

      // eslint-disable-next-line vitest/valid-title
      it(getTestName('tilgang til å overstyre', expected, fagsakStatus, behandlingStatus), () => {
        const access = kanOverstyreAccess(
          saksbehandlerOgOverstyrerAnsatt,
          { kode: fagsakStatus, kodeverk: '' },
          { kode: behandlingStatus, kodeverk: '' },
          validBehandlingTyper,
        );

        expect(access).toHaveProperty('isEnabled', expected);
      });
    });
  });
});
