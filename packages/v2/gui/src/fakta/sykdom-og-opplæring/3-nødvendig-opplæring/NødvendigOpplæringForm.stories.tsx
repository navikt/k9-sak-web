import withK9Kodeverkoppslag from '../../../storybook/decorators/withK9Kodeverkoppslag.jsx';
import NødvendigOpplæringForm from './NødvendigOpplæringForm.jsx';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import {
  KodeverdiSomObjektAvslagsårsakKilde,
  OpplæringVurderingDtoAvslagsÅrsak,
  OpplæringVurderingDtoResultat,
} from '@navikt/k9-sak-typescript-client';
import { Period } from '@navikt/ft-utils';
import { action } from '@storybook/addon-actions';
import { within, userEvent, expect } from '@storybook/test';
import { SykdomOgOpplæringContext } from '../FaktaSykdomOgOpplæringIndex.jsx';
import { K9SakKodeverkoppslag } from '../../../kodeverk/oppslag/K9SakKodeverkoppslag.ts';
import { oppslagKodeverkSomObjektK9Sak } from '../../../kodeverk/mocks/oppslagKodeverkSomObjektK9Sak.ts';

const withSykdomOgOpplæringContext = (): Decorator => Story => {
  const sykdomOgOpplæringContextState = {
    readOnly: false,
    løsAksjonspunkt9300: action('løsAksjonspunkt9300'),
    løsAksjonspunkt9301: action('løsAksjonspunkt9301'),
    løsAksjonspunkt9302: action('løsAksjonspunkt9302'),
    løsAksjonspunkt9303: action('løsAksjonspunkt9303'),
    behandlingUuid: '333-4444',
    aksjonspunkter: [],
  };
  return (
    <SykdomOgOpplæringContext value={sykdomOgOpplæringContextState}>
      <Story />
    </SykdomOgOpplæringContext>
  );
};

const sakKodeverkOppslag = new K9SakKodeverkoppslag(oppslagKodeverkSomObjektK9Sak);

const meta = {
  title: 'gui/fakta/sykdom-og-opplæring/3-nødvendig-opplæring',
  component: NødvendigOpplæringForm,
  decorators: [withK9Kodeverkoppslag(), withSykdomOgOpplæringContext()],
} satisfies Meta<typeof NødvendigOpplæringForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Avslagsårsaker: Story = {
  args: {
    vurdering: {
      avslagsÅrsak: OpplæringVurderingDtoAvslagsÅrsak.IKKE_NØDVENDIG_OPPLÆRING,
      begrunnelse: 'Begrunnelse for at opplæring ikke er nødvendig',
      dokumentertOpplæring: false,
      nødvendigOpplæring: false,
      opplæring: {
        fom: '2025-02-14',
        tom: '2025-02-23',
      },
      perioder: [new Period('2025-02-14', '2025-02-23')],
      resultat: OpplæringVurderingDtoResultat.IKKE_GODKJENT,
      vurdertAv: 'testbruker',
      vurdertTidspunkt: '2025-02-14T10:00:00Z',
    },
    setRedigering: action('setRedigering'),
    redigering: true,
  },
  play: async ({ canvas }) => {
    const nødvendigOpplæringLegend = canvas.getByText('Er nødvendig opplæring dokumentert', { exact: false });
    await expect(nødvendigOpplæringLegend.parentElement).toBeDefined();
    if (nødvendigOpplæringLegend.parentElement != null) {
      const jaKnapp = within(nødvendigOpplæringLegend.parentElement).getByLabelText('Ja');
      await expect(jaKnapp).toBeInTheDocument();
      await userEvent.click(jaKnapp);

      const harSøkerHattOpplæringFieldset = canvas.getByText('Har søker hatt opplæring', {
        exact: false,
      }).parentElement;
      await expect(harSøkerHattOpplæringFieldset).toBeDefined();
      if (harSøkerHattOpplæringFieldset != null) {
        const neiKnapp = within(harSøkerHattOpplæringFieldset).getByLabelText('Nei');
        await userEvent.click(neiKnapp);

        await expect(
          canvas.getByText(
            sakKodeverkOppslag.avslagsårsaker(KodeverdiSomObjektAvslagsårsakKilde.IKKE_NØDVENDIG_OPPLÆRING).navn,
          ),
        ).toBeVisible();
        await expect(
          canvas.getByText(
            sakKodeverkOppslag.avslagsårsaker(KodeverdiSomObjektAvslagsårsakKilde.KURS_INNEHOLDER_IKKE_OPPLÆRING).navn,
          ),
        ).toBeVisible();
      }
    }
  },
};
