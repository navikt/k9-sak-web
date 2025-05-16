import {
  PersonadresseDtoAdresseType,
  PersonDtoPersonstatusType,
  PersonopplysningDtoSivilstand,
} from '@k9-sak-web/backend/k9sak/generated';
import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import withKodeverkContext from '@k9-sak-web/gui/storybook/decorators/withKodeverkContext.js';
import type { Meta, StoryObj } from '@storybook/react';
import { expect } from '@storybook/test';
import BostedSokerView from './components/BostedSokerView';

const personopplysninger = {
  navn: 'Espen Utvikler',
  adresser: [
    {
      adresseType: PersonadresseDtoAdresseType.BOSTEDSADRESSE,
      land: 'Norge',
      adresselinje1: 'Vei 1',
      postNummer: '1000',
      poststed: 'Oslo',
    },
  ],
  personstatus: PersonDtoPersonstatusType.BOSA,
  aktoerId: '1',
  fnr: '12345678910',
  sivilstand: PersonopplysningDtoSivilstand.UGIFT,
};

const meta = {
  title: 'gui/fakta/bosted-soker',
  component: BostedSokerView,
  decorators: [withKodeverkContext({ behandlingType: behandlingType.FØRSTEGANGSSØKNAD })],
} satisfies Meta<typeof BostedSokerView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { personopplysninger, sokerTypeText: 'Søker' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Søker')).toBeInTheDocument();
    await expect(canvas.getByText('Espen Utvikler')).toBeInTheDocument();
    await expect(canvas.getByText('Utenlandsadresse')).toBeInTheDocument();
    await expect(canvas.getByText('Bosatt')).toBeInTheDocument();
    await expect(canvas.getByText('Vei 1, 1000 Oslo Norge')).toBeInTheDocument();
    await expect(canvas.getByText('Ugift')).toBeInTheDocument();
  },
};
