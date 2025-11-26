import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { BehandlingAppKontekst, Fagsak } from '@k9-sak-web/types';
import { userEvent } from 'storybook/test';
import { UngSakApiKeys, requestApi } from '../../data/ungsakApi';
import TotrinnskontrollIndex from './TotrinnskontrollIndex.js';
import withKodeverkContext from '@k9-sak-web/gui/storybook/decorators/withKodeverkContext.js';
import withK9Kodeverkoppslag from '@k9-sak-web/gui/storybook/decorators/withK9Kodeverkoppslag.js';
import { Meta, StoryObj } from '@storybook/react-vite';
import {
  AksjonspunktGodkjenningDtos,
  TotrinnskontrollApi,
  TotrinnskontrollData,
  TotrinnskontrollDataForAksjonspunkt,
} from '@k9-sak-web/gui/behandling/support/totrinnskontroll/TotrinnskontrollApi.js';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { ignoreUnusedDeclared } from '@k9-sak-web/gui/storybook/mocks/ignoreUnusedDeclared.js';
import type { TotrinnskontrollAksjonspunkterDto } from '@k9-sak-web/backend/combined/kontrakt/vedtak/TotrinnskontrollAksjonspunkterDto.js';
import { expect } from 'storybook/test';
import { action } from 'storybook/actions';

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
  title: 'ung/sak-app/behandlingsupport/totrinnskontroll/TotrinnskontrollIndex',
  component: TotrinnskontrollIndex,
  beforeEach: () => {
    requestApi.clearMockData(UngSakApiKeys.NAV_ANSATT);
    requestApi.clearMockData(UngSakApiKeys.HAR_REVURDERING_SAMME_RESULTAT);
    requestApi.mock(UngSakApiKeys.NAV_ANSATT, navAnsatt);
    requestApi.mock(UngSakApiKeys.HAR_REVURDERING_SAMME_RESULTAT, {});
  },
  decorators: [withKodeverkContext(), withK9Kodeverkoppslag()],
} satisfies Meta<typeof TotrinnskontrollIndex>;

type Story = StoryObj<typeof meta>;

const fagsak = {
  saksnummer: '1',
  sakstype: fagsakYtelsesType.UNGDOMSYTELSE,
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

const dummyData: TotrinnskontrollData = {
  forAksjonspunkt(aksjonspunktKode: AksjonspunktDefinisjon): TotrinnskontrollDataForAksjonspunkt | undefined {
    ignoreUnusedDeclared(aksjonspunktKode);
    return undefined;
  },
  alleAksjonspunkt: [],
  prSkjermlenke: [],
  vurderPåNyttÅrsakNavn(årsak: Required<TotrinnskontrollAksjonspunkterDto>['vurderPaNyttArsaker'][number]): string {
    ignoreUnusedDeclared(årsak);
    return 'Testdata mangler';
  },
};
const api: TotrinnskontrollApi = {
  backend: 'k9sak',
  hentTotrinnskontrollSkjermlenkeContext(behandlingUuid: string): Promise<TotrinnskontrollData> {
    ignoreUnusedDeclared(behandlingUuid);
    return Promise.resolve(dummyData);
  },
  hentTotrinnskontrollvurderingSkjermlenkeContext(behandlingUuid: string): Promise<TotrinnskontrollData> {
    ignoreUnusedDeclared(behandlingUuid);
    return Promise.resolve(dummyData);
  },
  bekreft(
    behandlingUuid: Readonly<string>,
    behandlingVersjon: Readonly<number>,
    aksjonspunktGodkjenningDtos: AksjonspunktGodkjenningDtos,
  ): Promise<void> {
    action('api.bekreft')(behandlingUuid, behandlingVersjon, aksjonspunktGodkjenningDtos);
    return Promise.resolve();
  },
};

export const Default: Story = {
  args: {
    fagsak: fagsak as Fagsak,
    alleBehandlinger: alleBehandlinger as unknown as BehandlingAppKontekst[],
    behandlingId: alleBehandlinger[0].id,
    api,
    urlEtterpå: '#',
  },
  play: async ({ canvas }) => {
    await expect(await canvas.findByText('Kontroller endrede opplysninger og faglige vurderinger')).toBeVisible();
    const godkjennBtn = canvas.getByRole('button', { name: 'Godkjenn vedtaket' });
    await expect(godkjennBtn).toBeVisible();
    await userEvent.click(godkjennBtn);
    const dlg = await canvas.findByRole('dialog', {
      name: 'Ungdomsytelse er innvilget og vedtaket blir iverksatt. Du kommer nå til forsiden.',
    });
    await expect(dlg).toBeVisible();
  },
};

export default meta;
