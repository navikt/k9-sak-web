import { expect } from 'chai';

import fagsakStatusCode from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import behandlingStatusCode from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';

import { kanOverstyreAccess, writeAccess } from './access';

const forEachFagsakAndBehandlingStatus = callback =>
  Object.values(fagsakStatusCode).forEach(fagsakStatus =>
    Object.values(behandlingStatusCode).forEach(behandlingStatus => {
      callback(fagsakStatus, behandlingStatus, false);
      callback(fagsakStatus, behandlingStatus, true);
    }),
  );

const getTestName = (accessName, expected, fagsakStatus, behandlingStatus, behandlingstype) =>
  `skal${expected ? '' : ' ikke'} ha ${accessName} når ` +
  `fagsakStatus er '${fagsakStatus}', ` +
  `behandlingStatus er '${behandlingStatus}' og ` +
  `behandlingstype er '${behandlingstype?.kode}'`;

describe('access', () => {
  const saksbehandlerAnsatt = { kanSaksbehandle: true };
  const veilederAnsatt = { kanVeilede: true };

  describe('writeAccess', () => {
    const validFagsakStatuser = [fagsakStatusCode.OPPRETTET, fagsakStatusCode.UNDER_BEHANDLING];
    const validFagsakStatus = { kode: validFagsakStatuser[0], kodeverk: '' };

    const validBehandlingStatuser = [behandlingStatusCode.OPPRETTET, behandlingStatusCode.BEHANDLING_UTREDES];
    const validBehandlingStatus = { kode: validBehandlingStatuser[0], kodeverk: '' };

    const behandlingstypeSomIkkeErKlage = { kode: behandlingType.FORSTEGANGSSOKNAD, kodeverk: '' };
    const klage = { kode: behandlingType.KLAGE, kodeverk: '' };

    it('saksbehandler skal ha skrivetilgang', () => {
      const accessForSaksbehandler = writeAccess(behandlingstypeSomIkkeErKlage)(
        saksbehandlerAnsatt,
        validFagsakStatus,
        validBehandlingStatus,
        behandlingstypeSomIkkeErKlage,
      );

      expect(accessForSaksbehandler).to.have.property('employeeHasAccess', true);
      expect(accessForSaksbehandler).to.have.property('isEnabled', true);
    });

    it('veileder skal ikke ha aktivert skrivetilgang', () => {
      const accessForVeileder = writeAccess(behandlingstypeSomIkkeErKlage)(
        veilederAnsatt,
        validFagsakStatus,
        validBehandlingStatus,
        behandlingstypeSomIkkeErKlage,
      );

      expect(accessForVeileder).to.have.property('employeeHasAccess', true);
      expect(accessForVeileder).to.have.property('isEnabled', false);
    });

    forEachFagsakAndBehandlingStatus((fagsakStatus, behandlingStatus, erKlage) => {
      const expected =
        (validFagsakStatuser.includes(fagsakStatus) || erKlage) && validBehandlingStatuser.includes(behandlingStatus);
      const behandlingstype = erKlage ? klage : behandlingstypeSomIkkeErKlage;

      it(getTestName('skrivetilgang', expected, fagsakStatus, behandlingStatus, behandlingstype), () => {
        const access = writeAccess(behandlingstype)(
          saksbehandlerAnsatt,
          { kode: fagsakStatus },
          { kode: behandlingStatus },
          behandlingstype,
        );

        expect(access).to.have.property('isEnabled', expected);
      });
    });
  });

  describe('kanOverstyreAccess', () => {
    const validFagsakStatuser = [fagsakStatusCode.UNDER_BEHANDLING];
    const validFagsakStatus = { kode: validFagsakStatuser[0] };

    const validBehandlingStatuser = [behandlingStatusCode.BEHANDLING_UTREDES];
    const validBehandlingStatus = { kode: validBehandlingStatuser[0] };

    const saksbehandlerOgOverstyrerAnsatt = { ...saksbehandlerAnsatt, kanOverstyre: true };
    const veilederOgOverstyrerAnsatt = { ...veilederAnsatt, kanOverstyre: false };

    const behandlingstypeSomIkkeErKlage = { kode: behandlingType.FORSTEGANGSSOKNAD, kodeverk: '' };

    it('saksbehandler med overstyrer-rolle skal ha tilgang til å overstyre', () => {
      const accessForSaksbehandler = kanOverstyreAccess(
        saksbehandlerOgOverstyrerAnsatt,
        validFagsakStatus,
        validBehandlingStatus,
        behandlingstypeSomIkkeErKlage,
      );

      expect(accessForSaksbehandler).to.have.property('employeeHasAccess', true);
      expect(accessForSaksbehandler).to.have.property('isEnabled', true);
    });

    it('saksbehandler uten overstyrer-rolle skal ikke ha tilgang til å overstyre', () => {
      const accessForSaksbehandler = kanOverstyreAccess(
        saksbehandlerAnsatt,
        validFagsakStatus,
        validBehandlingStatus,
        behandlingstypeSomIkkeErKlage,
      );

      expect(accessForSaksbehandler).to.have.property('employeeHasAccess', false);
      expect(accessForSaksbehandler).to.have.property('isEnabled', false);
    });

    it('veileder skal ikke ha aktivert tilgang til å overstyre', () => {
      const accessForVeileder = kanOverstyreAccess(
        veilederAnsatt,
        validFagsakStatus,
        validBehandlingStatus,
        behandlingstypeSomIkkeErKlage,
      );

      expect(accessForVeileder).to.have.property('employeeHasAccess', true);
      expect(accessForVeileder).to.have.property('isEnabled', false);

      const accessForVeilederOverstyrer = kanOverstyreAccess(
        veilederOgOverstyrerAnsatt,
        validFagsakStatus,
        validBehandlingStatus,
        behandlingstypeSomIkkeErKlage,
      );

      expect(accessForVeilederOverstyrer).to.have.property('employeeHasAccess', true);
      expect(accessForVeilederOverstyrer).to.have.property('isEnabled', false);
    });

    forEachFagsakAndBehandlingStatus((fagsakStatus, behandlingStatus) => {
      const expected = validFagsakStatuser.includes(fagsakStatus) && validBehandlingStatuser.includes(behandlingStatus);
      it(
        getTestName('tilgang til å overstyre', expected, fagsakStatus, behandlingStatus, behandlingstypeSomIkkeErKlage),
        () => {
          const access = kanOverstyreAccess(
            saksbehandlerOgOverstyrerAnsatt,
            { kode: fagsakStatus },
            { kode: behandlingStatus },
            behandlingstypeSomIkkeErKlage,
          );

          expect(access).to.have.property('isEnabled', expected);
        },
      );
    });
  });
});
