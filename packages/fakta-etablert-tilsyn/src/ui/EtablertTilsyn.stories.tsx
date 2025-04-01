/* eslint-disable no-console */
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor } from '@storybook/test';
import { handlers } from '../../mock/api-mock';
import { mockUrlPrepend } from '../../mock/constants';
import EtablertTilsynContainer from './EtablertTilsynContainer';

const meta = {
  title: 'fakta/fakta-etablert-tilsyn',
  component: EtablertTilsynContainer,
  args: {
    data: {
      readOnly: false,
      endpoints: {
        tilsyn: `${mockUrlPrepend}/mock/tilsyn`,
        sykdom: `${mockUrlPrepend}/mock/sykdom`,
        sykdomInnleggelse: `${mockUrlPrepend}/mock/sykdomInnleggelse`,
      },
      httpErrorHandler: fn(),
      lagreBeredskapvurdering: fn(),
      lagreNattevåkvurdering: fn(),
      harAksjonspunktForBeredskap: true,
      harAksjonspunktForNattevåk: true,
    },
  },
  parameters: {
    test: {
      dangerouslyIgnoreUnhandledErrors: true,
    },
  },
} satisfies Meta<typeof EtablertTilsynContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EtablertTilsyn: Story = {
  parameters: {
    msw: {
      handlers,
    },
  },
  play: async ({ canvas, step, args }) => {
    await step('skal ha skjema for håndtering av beredskap', async () => {
      await userEvent.click(canvas.getByRole('tab', { name: 'Beredskap' }));
      await waitFor(async () => {
        await expect(canvas.getByText('Vurdering av beredskap')).toBeInTheDocument();
      });
      await userEvent.type(
        canvas.getByRole('textbox', {
          name: 'Gjør en vurdering av om det er behov for beredskap etter § 9-11, tredje ledd.',
        }),
        'test',
      );
      await expect(canvas.queryByLabelText('Fra')).not.toBeInTheDocument();
      await expect(canvas.queryByLabelText('Til')).not.toBeInTheDocument();
      await userEvent.click(canvas.getByText('Ja, i deler av perioden'));
      await expect(canvas.getByLabelText('Fra')).toBeInTheDocument();
      await expect(canvas.getByLabelText('Til')).toBeInTheDocument();
      await userEvent.click(canvas.getByText('Bekreft og fortsett'));
      await waitFor(() =>
        expect(args.data.lagreBeredskapvurdering).toHaveBeenCalledWith({
          vurderinger: [
            {
              begrunnelse: 'test',
              kilde: '',
              periode: {
                fom: '2021-07-11',
                tom: '2021-07-12',
              },
              resultat: 'OPPFYLT',
            },
          ],
        }),
      );
    });

    await step('skal ha skjema for håndtering av nattevåk', async () => {
      await userEvent.click(canvas.getByRole('tab', { name: 'Nattevåk' }));
      await waitFor(async () => {
        await expect(canvas.getByText('Vurdering av nattevåk')).toBeInTheDocument();
      });
      await userEvent.type(
        canvas.getByRole('textbox', {
          name: 'Gjør en vurdering av om det er behov for nattevåk etter § 9-11, tredje ledd.',
        }),
        'test',
      );
      await expect(canvas.queryByLabelText('Fra')).not.toBeInTheDocument();
      await expect(canvas.queryByLabelText('Til')).not.toBeInTheDocument();
      await userEvent.click(canvas.getByText('Ja, i deler av perioden'));
      await expect(canvas.getByLabelText('Fra')).toBeInTheDocument();
      await expect(canvas.getByLabelText('Til')).toBeInTheDocument();
      await userEvent.click(canvas.getByText('Bekreft og fortsett'));
      await waitFor(() =>
        expect(args.data.lagreNattevåkvurdering).toHaveBeenCalledWith({
          vurderinger: [
            {
              begrunnelse: 'test',
              kilde: '',
              periode: {
                fom: '2021-07-11',
                tom: '2021-07-12',
              },
              resultat: 'OPPFYLT',
            },
          ],
        }),
      );
    });
  },
};
