import type { Meta, StoryObj } from '@storybook/react';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import { ProsessDefaultInitPanel } from './ProsessDefaultInitPanel.js';
import { ProsessMenyProvider } from './context/ProsessMenyContext.js';
import type { StandardProsessPanelProps } from './hooks/useStandardProsessPanelProps.js';

/**
 * Mock-komponent som simulerer et legacy prosesspanel.
 */
function MockLegacyPanel(props: StandardProsessPanelProps) {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
      <h2>Legacy Prosesspanel</h2>
      <div style={{ marginTop: '16px' }}>
        <h3>Mottatte props:</h3>
        <pre style={{ backgroundColor: '#fff', padding: '12px', borderRadius: '4px', overflow: 'auto' }}>
          {JSON.stringify(
            {
              behandling: props.behandling ? 'Behandling-objekt' : 'Ikke satt',
              fagsak: props.fagsak ? 'Fagsak-objekt' : 'Ikke satt',
              aksjonspunkter: `${props.aksjonspunkter?.length || 0} aksjonspunkter`,
              kodeverk: props.kodeverk ? 'Kodeverk-objekt' : 'Ikke satt',
              isReadOnly: props.isReadOnly,
              isAksjonspunktOpen: props.isAksjonspunktOpen,
              status: props.status,
            },
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
}

const meta = {
  title: 'v2/behandling/prosess/ProsessDefaultInitPanel',
  component: ProsessDefaultInitPanel,
  decorators: [
    Story => (
      <ProsessMenyProvider>
        <div style={{ padding: '20px' }}>
          <Story />
        </div>
      </ProsessMenyProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: `
ProsessDefaultInitPanel er en v2 wrapper-komponent for prosesspaneler.

Komponenten håndterer:
- Henting av standard panelprops via useStandardProsessPanelProps
- Evaluering av synlighetslogikk via skalVisePanel
- Beregning av menystatus via getMenyType
- Registrering med prosessmenyen via useProsessMenyRegistrerer
- Rendering av legacy panelkomponent via children render prop

Følger v2-prinsipper:
- Ingen manuell loading/error håndtering (håndteres av Suspense/ErrorBoundary)
- Antar at data alltid er tilgjengelig når komponenten rendres
- Bruker 'any' type for legacy-data for å unngå import av legacy-typer

Brukes slik:
\`\`\`tsx
<ProsessDefaultInitPanel
  urlKode="beregning"
  tekstKode="Beregning.Title"
  getMenyType={(data) => 
    data.aksjonspunkter.some(ap => ap.status === 'OPPR') 
      ? ProcessMenuStepType.warning 
      : ProcessMenuStepType.default
  }
>
  {(standardProps) => (
    <BeregningProsessStegPanel {...standardProps} />
  )}
</ProsessDefaultInitPanel>
\`\`\`
        `,
      },
    },
  },
} satisfies Meta<typeof ProsessDefaultInitPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Standard visning med mock panel.
 */
export const Standard: Story = {
  args: {
    urlKode: 'beregning',
    tekstKode: 'Beregning.Title',
    children: (props: StandardProsessPanelProps) => <MockLegacyPanel {...props} />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Standard visning av ProsessDefaultInitPanel med et mock legacy panel.',
      },
    },
  },
};

/**
 * Panel med warning status.
 */
export const MedWarningStatus: Story = {
  args: {
    urlKode: 'beregning',
    tekstKode: 'Beregning.Title',
    getMenyType: () => ProcessMenuStepType.warning,
    children: (props: StandardProsessPanelProps) => (
      <div style={{ padding: '20px', backgroundColor: '#fff3cd', borderRadius: '4px', border: '1px solid #ffc107' }}>
        <h2>⚠️ Panel med åpent aksjonspunkt</h2>
        <p>Dette panelet har et åpent aksjonspunkt som krever oppmerksomhet.</p>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Panel som beregner warning status via getMenyType-funksjonen.',
      },
    },
  },
};

/**
 * Panel med success status.
 */
export const MedSuccessStatus: Story = {
  args: {
    urlKode: 'vilkar',
    tekstKode: 'Vilkar.Title',
    getMenyType: () => ProcessMenuStepType.success,
    children: (props: StandardProsessPanelProps) => (
      <div style={{ padding: '20px', backgroundColor: '#d4edda', borderRadius: '4px', border: '1px solid #28a745' }}>
        <h2>✓ Vilkår oppfylt</h2>
        <p>Alle vilkår er oppfylt for dette panelet.</p>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Panel med success status - alle vilkår er oppfylt.',
      },
    },
  },
};

/**
 * Panel med danger status.
 */
export const MedDangerStatus: Story = {
  args: {
    urlKode: 'vedtak',
    tekstKode: 'Vedtak.Title',
    getMenyType: () => ProcessMenuStepType.danger,
    children: (props: StandardProsessPanelProps) => (
      <div style={{ padding: '20px', backgroundColor: '#f8d7da', borderRadius: '4px', border: '1px solid #dc3545' }}>
        <h2>✗ Vilkår ikke oppfylt</h2>
        <p>Dette panelet har problemer som må løses.</p>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Panel med danger status - vilkår er ikke oppfylt.',
      },
    },
  },
};

/**
 * Panel med partial status.
 */
export const MedPartialStatus: Story = {
  args: {
    urlKode: 'inngangsvilkar',
    tekstKode: 'Inngangsvilkar.Title',
    getMenyType: () => ProcessMenuStepType.warning,
    usePartialStatus: true,
    children: (props: StandardProsessPanelProps) => (
      <div style={{ padding: '20px', backgroundColor: '#fff3cd', borderRadius: '4px', border: '1px solid #ffc107' }}>
        <h2>Delvis fullført</h2>
        <p>Noen vilkår er oppfylt, andre ikke.</p>
        <ul>
          <li>✓ Medlemskap: Oppfylt</li>
          <li>✗ Opptjening: Ikke oppfylt</li>
          <li>⏳ Sykdom: Under vurdering</li>
        </ul>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Panel med delvis fullføringsstatus (usePartialStatus=true).',
      },
    },
  },
};

/**
 * Panel med synlighetslogikk - synlig.
 */
export const SynligPanel: Story = {
  args: {
    urlKode: 'beregning',
    tekstKode: 'Beregning.Title',
    skalVisePanel: () => true,
    children: (props: StandardProsessPanelProps) => (
      <div style={{ padding: '20px', backgroundColor: '#d1ecf1', borderRadius: '4px', border: '1px solid #17a2b8' }}>
        <h2>Synlig panel</h2>
        <p>Dette panelet er synlig fordi skalVisePanel returnerer true.</p>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Panel som er synlig basert på skalVisePanel-funksjonen.',
      },
    },
  },
};

/**
 * Panel med synlighetslogikk - skjult.
 */
export const SkjultPanel: Story = {
  args: {
    urlKode: 'skjult',
    tekstKode: 'Skjult.Title',
    skalVisePanel: () => false,
    children: (props: StandardProsessPanelProps) => (
      <div style={{ padding: '20px', backgroundColor: '#f8d7da', borderRadius: '4px', border: '1px solid #dc3545' }}>
        <h2>Dette skal ikke vises</h2>
        <p>Hvis du ser dette, er noe galt med synlighetslogikken.</p>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Panel som er skjult fordi skalVisePanel returnerer false. Du skal ikke se panelinnholdet.',
      },
    },
  },
};

/**
 * Panel med kompleks synlighetslogikk.
 */
export const KompleksSynlighetslogikk: Story = {
  args: {
    urlKode: 'optional',
    tekstKode: 'Optional.Title',
    skalVisePanel: (data: StandardProsessPanelProps) => {
      // Eksempel: Vis kun hvis det finnes aksjonspunkter
      return data.aksjonspunkter && data.aksjonspunkter.length > 0;
    },
    children: (props: StandardProsessPanelProps) => (
      <div style={{ padding: '20px', backgroundColor: '#e2e3e5', borderRadius: '4px', border: '1px solid #6c757d' }}>
        <h2>Betinget synlig panel</h2>
        <p>Dette panelet vises kun hvis det finnes aksjonspunkter.</p>
        <p>Antall aksjonspunkter: {props.aksjonspunkter?.length || 0}</p>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Panel med kompleks synlighetslogikk basert på aksjonspunkter. I denne storyen er det ingen aksjonspunkter, så panelet er skjult.',
      },
    },
  },
};

/**
 * Panel med dynamisk statusberegning.
 */
export const DynamiskStatusberegning: Story = {
  args: {
    urlKode: 'vilkar',
    tekstKode: 'Vilkar.Title',
    getMenyType: (data: StandardProsessPanelProps) => {
      // Eksempel på dynamisk statusberegning
      if (data.aksjonspunkter && data.aksjonspunkter.length > 0) {
        return ProcessMenuStepType.warning;
      }
      if (data.status === 'OPPFYLT') {
        return ProcessMenuStepType.success;
      }
      if (data.status === 'IKKE_OPPFYLT') {
        return ProcessMenuStepType.danger;
      }
      return ProcessMenuStepType.default;
    },
    children: (props: StandardProsessPanelProps) => (
      <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <h2>Panel med dynamisk status</h2>
        <p>Status beregnes basert på aksjonspunkter og vilkårstatus.</p>
        <ul>
          <li>Aksjonspunkter: {props.aksjonspunkter?.length || 0}</li>
          <li>Status: {props.status}</li>
          <li>
            Beregnet menytype:{' '}
            {props.aksjonspunkter?.length > 0
              ? 'warning'
              : props.status === 'OPPFYLT'
                ? 'success'
                : props.status === 'IKKE_OPPFYLT'
                  ? 'danger'
                  : 'default'}
          </li>
        </ul>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Panel som beregner status dynamisk basert på aksjonspunkter og vilkårstatus.',
      },
    },
  },
};
