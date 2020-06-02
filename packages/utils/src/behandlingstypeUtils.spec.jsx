import behandlingstype from '@fpsak-frontend/kodeverk/src/behandlingType';
import fpsakApi from '@fpsak-frontend/sak-app/src/data/fpsakApi';
import { expect } from 'chai';
import ApiForBehandlingstype from './behandlingstypeUtils';

describe('behandlingstypeUtils', () => {

  describe('behandlingerApi', () => {

    const inputToOutputMap = new Map([
      [behandlingstype.KLAGE, fpsakApi.BEHANDLINGER_KLAGE],
      [behandlingstype.TILBAKEKREVING, fpsakApi.BEHANDLINGER_FPTILBAKE],
      [behandlingstype.TILBAKEKREVING_REVURDERING, fpsakApi.BEHANDLINGER_FPTILBAKE],
      [behandlingstype.FORSTEGANGSSOKNAD, fpsakApi.BEHANDLINGER_FPSAK],
      [behandlingstype.SOKNAD, fpsakApi.BEHANDLINGER_FPSAK],
      [behandlingstype.REVURDERING, fpsakApi.BEHANDLINGER_FPSAK]
    ]);

    inputToOutputMap.forEach((expectedOutput, input) => it(
      `Returnerer ${expectedOutput.name} når behandlingstype er ${input}`,
      () => {
        const behandlingstypeapi = new ApiForBehandlingstype(input);
        expect(behandlingstypeapi.behandlingerApi()).to.equal(expectedOutput);
      }
    ));
  });

  describe('newBehandlingApi', () => {

    const inputToOutputMap = new Map([
      [behandlingstype.KLAGE, fpsakApi.NEW_BEHANDLING_KLAGE],
      [behandlingstype.TILBAKEKREVING, fpsakApi.NEW_BEHANDLING_FPTILBAKE],
      [behandlingstype.TILBAKEKREVING_REVURDERING, fpsakApi.NEW_BEHANDLING_FPTILBAKE],
      [behandlingstype.FORSTEGANGSSOKNAD, fpsakApi.NEW_BEHANDLING_FPSAK],
      [behandlingstype.SOKNAD, fpsakApi.NEW_BEHANDLING_FPSAK],
      [behandlingstype.REVURDERING, fpsakApi.NEW_BEHANDLING_FPSAK]
    ]);

    inputToOutputMap.forEach((expectedOutput, input) => it(
      `Returnerer ${expectedOutput.name} når behandlingstype er ${input}`,
      () => {
        const behandlingstypeapi = new ApiForBehandlingstype(input);
        expect(behandlingstypeapi.newBehandlingApi()).to.equal(expectedOutput);
      }
    ));
  });
});
