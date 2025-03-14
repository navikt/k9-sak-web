import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { Button } from '@navikt/ds-react';
import type { Meta, StoryObj } from '@storybook/react';
import withKodeverkContext from '../../storybook/decorators/withKodeverkContext';
import withMaxWidth from '../../storybook/decorators/withMaxWidth';
import FagsakProfilSakIndex from './FagsakProfilSakIndex';

const meta = {
  title: 'gui/sak/fagsak-profil',
  component: FagsakProfilSakIndex,
  decorators: [withKodeverkContext({ behandlingType: behandlingType.FØRSTEGANGSSØKNAD }), withMaxWidth(600)],
} satisfies Meta<typeof FagsakProfilSakIndex>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {
    saksnummer: '232341251',
    fagsakYtelseType: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN,
    fagsakStatus: fagsakStatus.OPPRETTET,
    renderBehandlingMeny: () => <Button size="small">Meny (Placeholder)</Button>,
    renderBehandlingVelger: () => <div>Liste (placeholder)</div>,
  },
};
