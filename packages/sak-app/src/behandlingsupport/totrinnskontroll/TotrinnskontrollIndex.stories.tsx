import TotrinnskontrollIndex from './TotrinnskontrollIndex.js';
import withKodeverkContext from '@k9-sak-web/gui/storybook/decorators/withKodeverkContext.js';
import withK9Kodeverkoppslag from '@k9-sak-web/gui/storybook/decorators/withK9Kodeverkoppslag.js';
import type { Meta, StoryObj } from '@storybook/react';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType.js';
import { TotrinnskontrollApi } from '@k9-sak-web/gui/behandling/support/totrinnskontroll/TotrinnskontrollApi.js';
import { TotrinnskontrollSkjermlenkeContextDto } from '@k9-sak-web/backend/combined/kontrakt/vedtak/TotrinnskontrollSkjermlenkeContextDto.js';
import { ignoreUnusedDeclared } from '@k9-sak-web/gui/storybook/mocks/ignoreUnusedDeclared.js';
import { BehandlingAppKontekst, Fagsak } from '@k9-sak-web/types';
import { K9sakApiKeys, requestApi } from '../../data/k9sakApi.js';
import { expect, userEvent } from 'storybook/test';

const navAnsatt = {
  brukernavn: 'Test',
  kanBehandleKode6: false,
  kanBehandleKode7: false,
  kanBehandleKodeEgenAnsatt: false,
  kanBeslutte: true,
  kanOverstyre: false,
  kanSaksbehandle: true,
  kanVeilede: false,
  navn: 'Test',
};

const meta = {
  title: 'sak/sak-app/behandlingsupport/totrinnskontroll/TotrinnskontrollIndex',
  component: TotrinnskontrollIndex,
  beforeEach: () => {
    requestApi.clearMockData(K9sakApiKeys.NAV_ANSATT);
    requestApi.clearMockData(K9sakApiKeys.HAR_REVURDERING_SAMME_RESULTAT);
    requestApi.mock(K9sakApiKeys.NAV_ANSATT, navAnsatt);
    requestApi.mock(K9sakApiKeys.HAR_REVURDERING_SAMME_RESULTAT, {});
  },
  decorators: [withKodeverkContext(), withK9Kodeverkoppslag()],
} satisfies Meta<typeof TotrinnskontrollIndex>;

type Story = StoryObj<typeof meta>;

const fagsak = {
  saksnummer: '1',
  sakstype: fagsakYtelsesType.FORELDREPENGER,
  person: {
    aktørId: '123',
  },
};

const alleBehandlinger = [
  {
    id: 1234,
    versjon: 123,
    type: {
      kode: behandlingType.FORSTEGANGSSOKNAD,
      kodeverk: '',
    },
    opprettet: '29.08.2017 09:54:22',
    status: {
      kode: 'FVED',
      kodeverk: 'BEHANDLING_STATUS',
    },
    toTrinnsBehandling: true,
    ansvarligSaksbehandler: 'Espen Utvikler',
    behandlingÅrsaker: [],
  },
];

const api: TotrinnskontrollApi = {
  hentTotrinnskontrollSkjermlenkeContext(behandlingUuid: string): Promise<TotrinnskontrollSkjermlenkeContextDto[]> {
    ignoreUnusedDeclared(behandlingUuid);
    return Promise.resolve([]);
  },
  hentTotrinnskontrollvurderingSkjermlenkeContext(
    behandlingUuid: string,
  ): Promise<TotrinnskontrollSkjermlenkeContextDto[]> {
    ignoreUnusedDeclared(behandlingUuid);
    return Promise.resolve([]);
  },
};

export const Default: Story = {
  // TODO: Forbedre args data til å vere fullstendig korrekte typer
  args: {
    fagsak: fagsak as Fagsak,
    alleBehandlinger: alleBehandlinger as unknown as BehandlingAppKontekst[],
    behandlingId: alleBehandlinger[0].id,
    behandlingVersjon: alleBehandlinger[0].versjon,
    api,
  },
  play: async ({ canvas }) => {
    await expect(await canvas.findByText('Kontroller endrede opplysninger og faglige vurderinger')).toBeVisible();
    const godkjennBtn = canvas.getByRole('button', { name: 'Godkjenn vedtaket' });
    await expect(godkjennBtn).toBeVisible();
    await userEvent.click(godkjennBtn);
    const dlg = await canvas.findByRole('dialog', {
      name: 'Omsorgspenger er innvilget og vedtaket blir iverksatt. Du kommer nå til forsiden.',
    });
    await expect(dlg).toBeVisible();
  },
};

export default meta;
