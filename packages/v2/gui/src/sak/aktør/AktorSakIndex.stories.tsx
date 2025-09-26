import { k9_kodeverk_behandling_FagsakYtelseType as FagsakDtoSakstype } from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { Meta, StoryObj } from '@storybook/react';
import AktorSakIndex from './AktorSakIndex';

const fagsak = {
  saksnummer: '35425245',
  sakstype: FagsakDtoSakstype.PLEIEPENGER_SYKT_BARN,
};

const meta = {
  title: 'gui/sak/aktør',
  component: AktorSakIndex,
} satisfies Meta<typeof AktorSakIndex>;

export default meta;

type Story = StoryObj<typeof meta>;

export const visSakerOpprettetPaAktor: Story = {
  args: {
    valgtAktorId: '123',
    aktorInfo: {
      fagsaker: [
        fagsak,
        {
          ...fagsak,
          saksnummer: '123',
        },
      ],
      person: {
        navn: 'Espen Utvikler',
        alder: 41,
        personnummer: '123456233',
        erKvinne: false,
      },
    },
  },
};
export const visningAvUgyldigAktorId: Story = {
  args: {
    valgtAktorId: '123',
    aktorInfo: {
      fagsaker: [],
      person: {
        navn: 'Ukjent Aktør',
        alder: 0,
        personnummer: '00000000000',
        erKvinne: false,
      },
    },
  },
};
