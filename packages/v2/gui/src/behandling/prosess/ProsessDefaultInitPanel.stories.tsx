import type { Meta, StoryObj } from '@storybook/react';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import { IntlProvider } from 'react-intl';
import { ProsessDefaultInitPanel } from './ProsessDefaultInitPanel.js';
import type { StandardProsessPanelProps } from './hooks/useStandardProsessPanelProps.js';

// Mock messages for Storybook
const messages = {
  'MockPanel.Title': 'Mock Panel',
  'VisiblePanel.Title': 'Synlig Panel',
  'HiddenPanel.Title': 'Skjult Panel',
  'ConditionalPanel.Title': 'Betinget Panel',
  'DefaultStatus.Title': 'Default Status',
  'WarningStatus.Title': 'Warning Status',
  'SuccessStatus.Title': 'Success Status',
  'DangerStatus.Title': 'Danger Status',
  'DynamicStatus.Title': 'Dynamisk Status',
};

/**
 * Mock-komponent som simulerer et prosesspanel.
 */
function MockProsessPanel({ 
  title, 
  content, 
  standardProps 
}: { 
  title: string; 
  content: string;
  standardProps?: StandardProsessPanelProps;
}) {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
      <h2>{title}</h2>
      <p>{content}</p>
      {standardProps && (
        <div style={{ marginTop: '16px', fontSize: '14px', color: '#666' }}>
          <h3>Standard Props:</h3>
          <ul>
            <li>Behandling ID: {standardProps.behandling?.id}</li>
            <li>Fagsak: {standardProps.fagsak?.saksnummer}</li>
            <li>Aksjonspunkter: {standardProps.aksjonspunkter?.length || 0}</li>
            <li>Read Only: {standardProps.isReadOnly ? 'Ja' : 'Nei'}</li>
            <li>Aksjonspunkt Open: {standardProps.isAksjonspunktOpen ? 'Ja' : 'Nei'}</li>
            <li>Status: {standardProps.status}</li>
          </ul>
        </div>
      )}
    </div>
  );
}

const meta = {
  title: 'v2/behandling/prosess/ProsessDefaultInitPanel',
  component: ProsessDefaultInitPanel,
  decorators: [
    Story => (
      <IntlProvider locale="nb-NO" messages={messages}>
        <Story />
      </IntlProvider>
    ),
  ],
  parameters: {
    layout: 'padded',
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
 * Demonstrerer hvordan wrapper-komponenten fungerer med et enkelt panel.
 */
export const MedMockPanel: Story = {
  args: {
    urlKode: 'mock-panel',
    tekstKode: 'MockPanel.Title',
    children: (standardProps: StandardProsessPanelProps) => (
      <MockProsessPanel
        title="Mock Prosesspanel"
        content="Dette er et mock-panel som viser hvordan ProsessDefaultInitPanel wrapper fungerer."
        standardProps={standardProps}
      />
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Viser wrapper med et enkelt mock-panel. Panelet mottar standard props fra useStandardProsessPanelProps.',
      },
    },
  },
};

/**
 * Panel som alltid er synlig (ingen skalVisePanel funksjon).
 */
export const AlltidSynlig: Story = {
  args: {
    urlKode: 'visible-panel',
    tekstKode: 'VisiblePanel.Title',
    children: (standardProps: StandardProsessPanelProps) => (
      <MockProsessPanel
        title="Alltid Synlig Panel"
        content="Dette panelet er alltid synlig fordi skalVisePanel ikke er oppgitt."
        standardProps={standardProps}
      />
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Panel uten skalVisePanel-funksjon er alltid synlig.',
      },
    },
  },
};

/**
 * Panel med synlighetslogikk som returnerer true.
 */
export const SynligMedBetingelse: Story = {
  args: {
    urlKode: 'conditional-visible',
    tekstKode: 'ConditionalPanel.Title',
    skalVisePanel: () => true,
    children: (standardProps: StandardProsessPanelProps) => (
      <MockProsessPanel
        title="Betinget Synlig Panel"
        content="Dette panelet er synlig fordi skalVisePanel returnerer true."
        standardProps={standardProps}
      />
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Panel med skalVisePanel som returnerer true vises normalt.',
      },
    },
  },
};

/**
 * Panel med synlighetslogikk som returnerer false.
 * Dette panelet skal ikke vises i det hele tatt.
 */
export const SkjultMedBetingelse: Story = {
  args: {
    urlKode: 'conditional-hidden',
    tekstKode: 'HiddenPanel.Title',
    skalVisePanel: () => false,
    children: (standardProps: StandardProsessPanelProps) => (
      <MockProsessPanel
        title="Skjult Panel"
        content="Dette panelet skal ikke vises fordi skalVisePanel returnerer false."
        standardProps={standardProps}
      />
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Panel med skalVisePanel som returnerer false vises ikke. Du skal ikke se noe innhold her.',
      },
    },
  },
};

/**
 * Panel med synlighetslogikk basert på aksjonspunkter.
 */
export const SynligBasertPaAksjonspunkter: Story = {
  args: {
    urlKode: 'aksjonspunkt-visible',
    tekstKode: 'ConditionalPanel.Title',
    skalVisePanel: (data: StandardProsessPanelProps) => {
      // Vis kun hvis det finnes aksjonspunkter
      return data.aksjonspunkter && data.aksjonspunkter.length > 0;
    },
    children: (standardProps: StandardProsessPanelProps) => (
      <MockProsessPanel
        title="Synlig Basert på Aksjonspunkter"
        content={`Dette panelet vises kun hvis det finnes aksjonspunkter. Antall: ${standardProps.aksjonspunkter?.length || 0}`}
        standardProps={standardProps}
      />
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Panel som vises kun hvis det finnes aksjonspunkter. I denne storyen er det ingen aksjonspunkter, så panelet er skjult.',
      },
    },
  },
};

/**
 * Panel med default status (ingen getMenyType funksjon).
 */
export const DefaultStatus: Story = {
  args: {
    urlKode: 'default-status',
    tekstKode: 'DefaultStatus.Title',
    children: (standardProps: StandardProsessPanelProps) => (
      <MockProsessPanel
        title="Default Status"
        content="Dette panelet har default status fordi getMenyType ikke er oppgitt."
        standardProps={standardProps}
      />
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Panel uten getMenyType-funksjon får automatisk ProcessMenuStepType.default.',
      },
    },
  },
};

/**
 * Panel med warning status.
 */
export const WarningStatus: Story = {
  args: {
    urlKode: 'warning-status',
    tekstKode: 'WarningStatus.Title',
    getMenyType: () => ProcessMenuStepType.warning,
    children: (standardProps: StandardProsessPanelProps) => (
      <MockProsessPanel
        title="Warning Status"
        content="Dette panelet har warning status (gul/oransje) - krever oppmerksomhet."
        standardProps={standardProps}
      />
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Panel med ProcessMenuStepType.warning indikerer at det krever oppmerksomhet.',
      },
    },
  },
};

/**
 * Panel med success status.
 */
export const SuccessStatus: Story = {
  args: {
    urlKode: 'success-status',
    tekstKode: 'SuccessStatus.Title',
    getMenyType: () => ProcessMenuStepType.success,
    children: (standardProps: StandardProsessPanelProps) => (
      <MockProsessPanel
        title="Success Status"
        content="Dette panelet har success status (grønn) - fullført."
        standardProps={standardProps}
      />
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Panel med ProcessMenuStepType.success indikerer at det er fullført.',
      },
    },
  },
};

/**
 * Panel med danger status.
 */
export const DangerStatus: Story = {
  args: {
    urlKode: 'danger-status',
    tekstKode: 'DangerStatus.Title',
    getMenyType: () => ProcessMenuStepType.danger,
    children: (standardProps: StandardProsessPanelProps) => (
      <MockProsessPanel
        title="Danger Status"
        content="Dette panelet har danger status (rød) - har problemer."
        standardProps={standardProps}
      />
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Panel med ProcessMenuStepType.danger indikerer at det har problemer som må løses.',
      },
    },
  },
};

/**
 * Panel med dynamisk statusberegning basert på aksjonspunkter.
 */
export const DynamiskStatusBeregning: Story = {
  args: {
    urlKode: 'dynamic-status',
    tekstKode: 'DynamicStatus.Title',
    getMenyType: (data: StandardProsessPanelProps) => {
      // Beregn status basert på aksjonspunkter
      if (data.aksjonspunkter && data.aksjonspunkter.length > 0) {
        const harApenAksjonspunkt = data.aksjonspunkter.some(
          (ap: any) => ap.status === 'OPPR'
        );
        if (harApenAksjonspunkt) {
          return ProcessMenuStepType.warning;
        }
        return ProcessMenuStepType.success;
      }
      return ProcessMenuStepType.default;
    },
    children: (standardProps: StandardProsessPanelProps) => (
      <MockProsessPanel
        title="Dynamisk Status"
        content={`Status beregnes dynamisk basert på aksjonspunkter. Antall: ${standardProps.aksjonspunkter?.length || 0}`}
        standardProps={standardProps}
      />
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Panel som beregner status dynamisk basert på aksjonspunkter. I denne storyen er det ingen aksjonspunkter, så status er default.',
      },
    },
  },
};

/**
 * Panel med delvis fullføringsstatus.
 */
export const MedPartialStatus: Story = {
  args: {
    urlKode: 'partial-status',
    tekstKode: 'DynamicStatus.Title',
    getMenyType: () => ProcessMenuStepType.warning,
    usePartialStatus: true,
    children: (standardProps: StandardProsessPanelProps) => (
      <MockProsessPanel
        title="Delvis Fullført"
        content="Dette panelet er delvis fullført (usePartialStatus=true)."
        standardProps={standardProps}
      />
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Panel med usePartialStatus=true viser delvis fullføringsindikator i menyen.',
      },
    },
  },
};

/**
 * Kompleks eksempel med både synlighet og statusberegning.
 */
export const KompleksEksempel: Story = {
  args: {
    urlKode: 'complex-example',
    tekstKode: 'DynamicStatus.Title',
    skalVisePanel: (data: StandardProsessPanelProps) => {
      // Vis kun hvis ikke read-only
      return !data.isReadOnly;
    },
    getMenyType: (data: StandardProsessPanelProps) => {
      // Beregn status basert på flere faktorer
      if (data.isAksjonspunktOpen) {
        return ProcessMenuStepType.warning;
      }
      if (data.status === 'success') {
        return ProcessMenuStepType.success;
      }
      if (data.status === 'danger') {
        return ProcessMenuStepType.danger;
      }
      return ProcessMenuStepType.default;
    },
    children: (standardProps: StandardProsessPanelProps) => (
      <MockProsessPanel
        title="Kompleks Eksempel"
        content="Dette panelet demonstrerer både synlighetslogikk og dynamisk statusberegning."
        standardProps={standardProps}
      />
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Kompleks eksempel som kombinerer synlighetslogikk (vises kun hvis ikke read-only) og dynamisk statusberegning basert på flere faktorer.',
      },
    },
  },
};
