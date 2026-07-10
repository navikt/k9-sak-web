/* eslint-disable no-console */
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, fn, userEvent, waitFor, within } from 'storybook/test';
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
      httpErrorHandler: () => {},
      lagreBeredskapvurdering: fn(),
      lagreNattevåkvurdering: fn(),
      harUløstAksjonspunktForBeredskap: true,
      harUløstAksjonspunktForNattevåk: true,
      harLøstAksjonspunktForBeredskap: false,
      harLøstAksjonspunktForNattevåk: false,
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
      const submitButton = canvas.getByText('Bekreft og fortsett');
      const form = submitButton.closest('form');
      await fireEvent.submit(form!);
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
      const submitButton = canvas.getByText('Bekreft og fortsett');
      const form = submitButton.closest('form');
      await fireEvent.submit(form!);
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

EtablertTilsyn.parameters = {
  msw: {
    handlers,
  },
};

export const UtenAksjonspunkter: Story = {
  args: {
    data: {
      readOnly: false,
      endpoints: {
        tilsyn: `${mockUrlPrepend}/mock/tilsyn`,
        sykdom: `${mockUrlPrepend}/mock/sykdom`,
        sykdomInnleggelse: `${mockUrlPrepend}/mock/sykdomInnleggelse`,
      },
      httpErrorHandler: () => {},
      lagreBeredskapvurdering: fn(),
      lagreNattevåkvurdering: fn(),
      harUløstAksjonspunktForBeredskap: false,
      harUløstAksjonspunktForNattevåk: false,
      harLøstAksjonspunktForBeredskap: false,
      harLøstAksjonspunktForNattevåk: false,
    },
  },
  parameters: {
    msw: {
      handlers,
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('skal ikke vise submit-knapp for beredskap uten aksjonspunkt', async () => {
      await userEvent.click(canvas.getByRole('tab', { name: 'Beredskap' }));
      await waitFor(async () => {
        await expect(
          canvas.getByRole('textbox', {
            name: 'Gjør en vurdering av om det er behov for beredskap etter § 9-11, tredje ledd.',
          }),
        ).toBeDisabled();
      });
      await expect(canvas.queryByText('Bekreft og fortsett')).not.toBeInTheDocument();
    });

    await step('skal ikke vise submit-knapp for nattevåk uten aksjonspunkt', async () => {
      await userEvent.click(canvas.getByRole('tab', { name: 'Nattevåk' }));
      await waitFor(async () => {
        await expect(
          canvas.getByRole('textbox', {
            name: 'Gjør en vurdering av om det er behov for nattevåk etter § 9-11, tredje ledd.',
          }),
        ).toBeDisabled();
      });
      await expect(canvas.queryByText('Bekreft og fortsett')).not.toBeInTheDocument();
    });
  },
};

export const BareNattevåkAksjonspunkt: Story = {
  args: {
    data: {
      readOnly: false,
      endpoints: {
        tilsyn: `${mockUrlPrepend}/mock/tilsyn`,
        sykdom: `${mockUrlPrepend}/mock/sykdom`,
        sykdomInnleggelse: `${mockUrlPrepend}/mock/sykdomInnleggelse`,
      },
      httpErrorHandler: () => {},
      lagreBeredskapvurdering: fn(),
      lagreNattevåkvurdering: fn(),
      harUløstAksjonspunktForBeredskap: false,
      harUløstAksjonspunktForNattevåk: true,
      harLøstAksjonspunktForBeredskap: false,
      harLøstAksjonspunktForNattevåk: false,
    },
  },
  parameters: {
    msw: {
      handlers,
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('skal ikke vise submit-knapp for beredskap uten aksjonspunkt', async () => {
      await userEvent.click(canvas.getByRole('tab', { name: 'Beredskap' }));
      await waitFor(async () => {
        await expect(
          canvas.getByRole('textbox', {
            name: 'Gjør en vurdering av om det er behov for beredskap etter § 9-11, tredje ledd.',
          }),
        ).toBeDisabled();
      });
      await expect(canvas.queryByText('Bekreft og fortsett')).not.toBeInTheDocument();
    });

    await step('skal vise submit-knapp for nattevåk med aksjonspunkt', async () => {
      await userEvent.click(canvas.getByRole('tab', { name: 'Nattevåk' }));
      await waitFor(async () => {
        await expect(
          canvas.getByRole('textbox', {
            name: 'Gjør en vurdering av om det er behov for nattevåk etter § 9-11, tredje ledd.',
          }),
        ).not.toBeDisabled();
      });
      await expect(canvas.getByText('Bekreft og fortsett')).toBeInTheDocument();
    });
  },
};

export const BareBeredskapAksjonspunkt: Story = {
  args: {
    data: {
      readOnly: false,
      endpoints: {
        tilsyn: `${mockUrlPrepend}/mock/tilsyn`,
        sykdom: `${mockUrlPrepend}/mock/sykdom`,
        sykdomInnleggelse: `${mockUrlPrepend}/mock/sykdomInnleggelse`,
      },
      httpErrorHandler: () => {},
      lagreBeredskapvurdering: fn(),
      lagreNattevåkvurdering: fn(),
      harUløstAksjonspunktForBeredskap: true,
      harUløstAksjonspunktForNattevåk: false,
      harLøstAksjonspunktForBeredskap: false,
      harLøstAksjonspunktForNattevåk: false,
    },
  },
  parameters: {
    msw: {
      handlers,
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('skal vise submit-knapp for beredskap med aksjonspunkt', async () => {
      await userEvent.click(canvas.getByRole('tab', { name: 'Beredskap' }));
      await waitFor(async () => {
        await expect(
          canvas.getByRole('textbox', {
            name: 'Gjør en vurdering av om det er behov for beredskap etter § 9-11, tredje ledd.',
          }),
        ).not.toBeDisabled();
      });
      await expect(canvas.getByText('Bekreft og fortsett')).toBeInTheDocument();
    });

    await step('skal ikke vise submit-knapp for nattevåk uten aksjonspunkt', async () => {
      await userEvent.click(canvas.getByRole('tab', { name: 'Nattevåk' }));
      await waitFor(async () => {
        await expect(
          canvas.getByRole('textbox', {
            name: 'Gjør en vurdering av om det er behov for nattevåk etter § 9-11, tredje ledd.',
          }),
        ).toBeDisabled();
      });
      await expect(canvas.queryByText('Bekreft og fortsett')).not.toBeInTheDocument();
    });
  },
};

export const BeredskapFerdigVurdert: Story = {
  args: {
    data: {
      readOnly: false,
      endpoints: {
        tilsyn: `${mockUrlPrepend}/mock/tilsyn-ferdig-vurdert`,
        sykdom: `${mockUrlPrepend}/mock/sykdom`,
        sykdomInnleggelse: `${mockUrlPrepend}/mock/sykdomInnleggelse`,
      },
      httpErrorHandler: () => {},
      lagreBeredskapvurdering: data => console.log('Lagrer beredskap:', data),
      lagreNattevåkvurdering: data => console.log('Lagrer nattevåk:', data),
      harUløstAksjonspunktForBeredskap: true,
      harUløstAksjonspunktForNattevåk: false,
      harLøstAksjonspunktForBeredskap: false,
      harLøstAksjonspunktForNattevåk: false,
    },
  },
  parameters: {
    msw: {
      handlers,
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('skal vise fortsett-knapp når beredskap er ferdig vurdert', async () => {
      await userEvent.click(canvas.getByRole('tab', { name: 'Beredskap' }));
      await waitFor(async () => {
        await expect(
          canvas.getByText('Behov for beredskap er ferdig vurdert og du kan gå videre i vurderingen.'),
        ).toBeInTheDocument();
      });
      await expect(canvas.getByRole('button', { name: 'Fortsett' })).toBeInTheDocument();
    });
  },
};

export const LøstAksjonspunktBeredskap: Story = {
  args: {
    data: {
      readOnly: false,
      endpoints: {
        tilsyn: `${mockUrlPrepend}/mock/tilsyn-ferdig-vurdert`,
        sykdom: `${mockUrlPrepend}/mock/sykdom`,
        sykdomInnleggelse: `${mockUrlPrepend}/mock/sykdomInnleggelse`,
      },
      httpErrorHandler: () => {},
      lagreBeredskapvurdering: fn(),
      lagreNattevåkvurdering: fn(),
      harUløstAksjonspunktForBeredskap: false,
      harUløstAksjonspunktForNattevåk: false,
      harLøstAksjonspunktForBeredskap: true,
      harLøstAksjonspunktForNattevåk: false,
    },
  },
  parameters: {
    msw: {
      handlers,
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('skal starte på Etablert tilsyn-fanen (ikke beredskap) når aksjonspunkt er løst', async () => {
      await waitFor(async () => {
        await expect(canvas.getByRole('tab', { name: 'Etablert tilsyn' })).toHaveAttribute('aria-selected', 'true');
      });
    });

    await step('skal vise rediger-knapp for ferdig vurderte perioder', async () => {
      await userEvent.click(canvas.getByRole('tab', { name: 'Beredskap' }));
      await waitFor(async () => {
        await expect(canvas.getByText('Alle perioder')).toBeInTheDocument();
      });
      await userEvent.click(canvas.getAllByRole('button')[0]);
      await waitFor(async () => {
        await expect(canvas.getByText('Vurdering av beredskap')).toBeInTheDocument();
      });
      await expect(canvas.getByRole('button', { name: 'Rediger vurdering' })).toBeInTheDocument();
    });

    await step('skal ikke vise fortsett-knapp når aksjonspunkt er løst', async () => {
      await expect(canvas.queryByRole('button', { name: 'Fortsett' })).not.toBeInTheDocument();
    });
  },
};

export const LøstAksjonspunktNattevåk: Story = {
  args: {
    data: {
      readOnly: false,
      endpoints: {
        tilsyn: `${mockUrlPrepend}/mock/tilsyn-ferdig-vurdert`,
        sykdom: `${mockUrlPrepend}/mock/sykdom`,
        sykdomInnleggelse: `${mockUrlPrepend}/mock/sykdomInnleggelse`,
      },
      httpErrorHandler: () => {},
      lagreBeredskapvurdering: fn(),
      lagreNattevåkvurdering: fn(),
      harUløstAksjonspunktForBeredskap: false,
      harUløstAksjonspunktForNattevåk: false,
      harLøstAksjonspunktForBeredskap: false,
      harLøstAksjonspunktForNattevåk: true,
    },
  },
  parameters: {
    msw: {
      handlers,
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('skal starte på Etablert tilsyn-fanen (ikke nattevåk) når aksjonspunkt er løst', async () => {
      await waitFor(async () => {
        await expect(canvas.getByRole('tab', { name: 'Etablert tilsyn' })).toHaveAttribute('aria-selected', 'true');
      });
    });

    await step('skal ikke vise varselikon på nattevåk-fane når aksjonspunkt er løst', async () => {
      const nattevåkTab = canvas.getByRole('tab', { name: 'Nattevåk' });
      void expect(nattevåkTab.querySelector('svg')).toBeNull();
    });
  },
};

export const VarseltrekantVedUløstAksjonspunkt: Story = {
  args: {
    data: {
      readOnly: false,
      endpoints: {
        tilsyn: `${mockUrlPrepend}/mock/tilsyn`,
        sykdom: `${mockUrlPrepend}/mock/sykdom`,
        sykdomInnleggelse: `${mockUrlPrepend}/mock/sykdomInnleggelse`,
      },
      httpErrorHandler: () => {},
      lagreBeredskapvurdering: fn(),
      lagreNattevåkvurdering: fn(),
      harUløstAksjonspunktForBeredskap: true,
      harUløstAksjonspunktForNattevåk: true,
      harLøstAksjonspunktForBeredskap: false,
      harLøstAksjonspunktForNattevåk: false,
    },
  },
  parameters: {
    msw: {
      handlers,
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('skal vise varselikon på beredskap-fane ved uløst aksjonspunkt', async () => {
      await waitFor(async () => {
        const beredskapTab = canvas.getByRole('tab', { name: 'Beredskap' });
        await expect(beredskapTab.querySelector('svg')).toBeInTheDocument();
      });
    });

    await step('skal vise varselikon på nattevåk-fane ved uløst aksjonspunkt', async () => {
      const nattevåkTab = canvas.getByRole('tab', { name: 'Nattevåk' });
      await expect(nattevåkTab.querySelector('svg')).toBeInTheDocument();
    });

    await step('skal auto-velge beredskap-fane som default ved uløst aksjonspunkt', async () => {
      await expect(canvas.getByRole('tab', { name: 'Beredskap' })).toHaveAttribute('aria-selected', 'true');
    });
  },
};

export const IngenRedigeringUtenAksjonspunkt: Story = {
  args: {
    data: {
      readOnly: false,
      endpoints: {
        tilsyn: `${mockUrlPrepend}/mock/tilsyn-ferdig-vurdert`,
        sykdom: `${mockUrlPrepend}/mock/sykdom`,
        sykdomInnleggelse: `${mockUrlPrepend}/mock/sykdomInnleggelse`,
      },
      httpErrorHandler: () => {},
      lagreBeredskapvurdering: fn(),
      lagreNattevåkvurdering: fn(),
      harUløstAksjonspunktForBeredskap: false,
      harUløstAksjonspunktForNattevåk: false,
      harLøstAksjonspunktForBeredskap: false,
      harLøstAksjonspunktForNattevåk: false,
    },
  },
  parameters: {
    msw: {
      handlers,
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('skal ikke vise rediger-knapp for beredskap uten aksjonspunkt', async () => {
      await userEvent.click(canvas.getByRole('tab', { name: 'Beredskap' }));
      await waitFor(async () => {
        await expect(canvas.getByText('Alle perioder')).toBeInTheDocument();
      });
      await userEvent.click(canvas.getAllByRole('button')[0]);
      await waitFor(async () => {
        await expect(canvas.getByText('Vurdering av beredskap')).toBeInTheDocument();
      });
      await expect(canvas.queryByRole('button', { name: 'Rediger vurdering' })).not.toBeInTheDocument();
    });

    await step('skal ikke vise fortsett-knapp for beredskap uten aksjonspunkt', async () => {
      await expect(canvas.queryByRole('button', { name: 'Fortsett' })).not.toBeInTheDocument();
    });
  },
};
