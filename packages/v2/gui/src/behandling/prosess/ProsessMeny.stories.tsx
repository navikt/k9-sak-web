import type { Meta, StoryObj } from '@storybook/react';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import { IntlProvider } from 'react-intl';
import { ProsessMeny } from './ProsessMeny.js';
import { ProsessDefaultInitPanel } from './ProsessDefaultInitPanel.js';
import type { StandardProsessPanelProps } from './hooks/useStandardProsessPanelProps.js';

// Mock messages for Storybook
const messages = {
  'Varsel.Title': 'Varsel om revurdering',
  'Beregning.Title': 'Beregning',
  'Vilkar.Title': 'Vilkår',
  'Vedtak.Title': 'Vedtak',
  'Inngangsvilkar.Title': 'Inngangsvilkår',
  'Uttak.Title': 'Uttak',
  'Default.Title': 'Default',
  'Warning.Title': 'Advarsel',
  'Success.Title': 'Suksess',
  'Danger.Title': 'Fare',
  'Skjult.Title': 'Skjult',
};

/**
 * Mock-komponent som simulerer et prosesspanel.
 */
function MockProsessPanel({ title, content }: { title: string; content: string }) {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
      <h2>{title}</h2>
      <p>{content}</p>
    </div>
  );
}

/**
 * Mock InitPanel-wrapper som bruker ProsessDefaultInitPanel.
 */
function MockInitPanel({
  urlKode,
  tekstKode,
  title,
  content,
  type = ProcessMenuStepType.default,
  usePartialStatus = false,
  skalVisePanel,
}: {
  urlKode: string;
  tekstKode: string;
  title: string;
  content: string;
  type?: ProcessMenuStepType;
  usePartialStatus?: boolean;
  skalVisePanel?: (data: StandardProsessPanelProps) => boolean;
}) {
  return (
    <ProsessDefaultInitPanel
      urlKode={urlKode}
      tekstKode={tekstKode}
      getMenyType={() => type}
      usePartialStatus={usePartialStatus}
      skalVisePanel={skalVisePanel}
    >
      {() => <MockProsessPanel title={title} content={content} />}
    </ProsessDefaultInitPanel>
  );
}

const meta = {
  title: 'v2/behandling/prosess/ProsessMeny',
  component: ProsessMeny,
  decorators: [
    Story => (
      <IntlProvider locale="nb-NO" messages={messages}>
        <Story />
      </IntlProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
ProsessMeny er en v2-komponent som viser en meny med prosesspaneler.

Komponenten:
- Aksepterer InitPanel-komponenter som children
- Samler panelregistreringer via React context
- Rendrer ProcessMenu-komponent fra @navikt/ft-plattform-komponenter
- Håndterer panelvalg og URL-synkronisering
- Rendrer kun det valgte panelet

Brukes slik:
\`\`\`tsx
<ProsessMeny>
  <VarselProsessStegInitPanel />
  <BeregningProsessStegInitPanel />
  <VedtakProsessStegInitPanel />
</ProsessMeny>
\`\`\`
        `,
      },
    },
  },
} satisfies Meta<typeof ProsessMeny>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Standard visning med flere paneler med forskjellige statustyper.
 */
export const MedFlerePaneler: Story = {
  args: {
    children: (
      <>
        <MockInitPanel
          urlKode="varsel"
          tekstKode="Varsel.Title"
          title="Varsel om revurdering"
          content="Dette panelet viser varsel om revurdering."
          type={ProcessMenuStepType.default}
        />
        <MockInitPanel
          urlKode="beregning"
          tekstKode="Beregning.Title"
          title="Beregning"
          content="Dette panelet har et åpent aksjonspunkt som krever oppmerksomhet."
          type={ProcessMenuStepType.warning}
        />
        <MockInitPanel
          urlKode="vilkar"
          tekstKode="Vilkar.Title"
          title="Vilkår"
          content="Alle vilkår er oppfylt for dette panelet."
          type={ProcessMenuStepType.success}
        />
        <MockInitPanel
          urlKode="vedtak"
          tekstKode="Vedtak.Title"
          title="Vedtak"
          content="Dette panelet har problemer som må løses."
          type={ProcessMenuStepType.danger}
        />
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Viser meny med fire paneler med forskjellige statustyper: default, warning, success og danger.',
      },
    },
  },
};

/**
 * Visning med delvis fullførte paneler.
 */
export const MedPartialStatus: Story = {
  args: {
    children: (
      <>
        <MockInitPanel
          urlKode="inngangsvilkar"
          tekstKode="Inngangsvilkar.Title"
          title="Inngangsvilkår"
          content="Noen vilkår er oppfylt, andre ikke."
          type={ProcessMenuStepType.warning}
          usePartialStatus={true}
        />
        <MockInitPanel
          urlKode="beregning"
          tekstKode="Beregning.Title"
          title="Beregning"
          content="Beregning er delvis fullført."
          type={ProcessMenuStepType.default}
          usePartialStatus={true}
        />
        <MockInitPanel
          urlKode="vedtak"
          tekstKode="Vedtak.Title"
          title="Vedtak"
          content="Vedtak er ikke startet."
          type={ProcessMenuStepType.default}
        />
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Viser paneler med delvis fullføringsstatus (usePartialStatus=true).',
      },
    },
  },
};

/**
 * Visning med kun ett panel.
 */
export const MedEttPanel: Story = {
  args: {
    children: (
      <MockInitPanel
        urlKode="varsel"
        tekstKode="Varsel.Title"
        title="Varsel om revurdering"
        content="Dette er det eneste panelet i menyen."
        type={ProcessMenuStepType.default}
      />
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Viser meny med kun ett panel.',
      },
    },
  },
};

/**
 * Visning med betinget synlige paneler.
 */
export const MedBetingetSynlighet: Story = {
  args: {
    children: (
      <>
        <MockInitPanel
          urlKode="varsel"
          tekstKode="Varsel.Title"
          title="Varsel om revurdering"
          content="Dette panelet er alltid synlig."
          type={ProcessMenuStepType.default}
        />
        <MockInitPanel
          urlKode="beregning"
          tekstKode="Beregning.Title"
          title="Beregning"
          content="Dette panelet er synlig."
          type={ProcessMenuStepType.warning}
          skalVisePanel={() => true}
        />
        <MockInitPanel
          urlKode="skjult"
          tekstKode="Skjult.Title"
          title="Skjult panel"
          content="Dette panelet skal ikke vises."
          type={ProcessMenuStepType.default}
          skalVisePanel={() => false}
        />
        <MockInitPanel
          urlKode="vedtak"
          tekstKode="Vedtak.Title"
          title="Vedtak"
          content="Dette panelet er synlig."
          type={ProcessMenuStepType.default}
        />
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Viser hvordan paneler kan skjules basert på skalVisePanel-funksjonen. Det tredje panelet er skjult.',
      },
    },
  },
};

/**
 * Visning med alle statustyper.
 */
export const AlleStatustyper: Story = {
  args: {
    children: (
      <>
        <MockInitPanel
          urlKode="default"
          tekstKode="Default.Title"
          title="Default status"
          content="Panel med default status (grå)."
          type={ProcessMenuStepType.default}
        />
        <MockInitPanel
          urlKode="warning"
          tekstKode="Warning.Title"
          title="Warning status"
          content="Panel med warning status (gul/oransje) - krever oppmerksomhet."
          type={ProcessMenuStepType.warning}
        />
        <MockInitPanel
          urlKode="success"
          tekstKode="Success.Title"
          title="Success status"
          content="Panel med success status (grønn) - fullført."
          type={ProcessMenuStepType.success}
        />
        <MockInitPanel
          urlKode="danger"
          tekstKode="Danger.Title"
          title="Danger status"
          content="Panel med danger status (rød) - har problemer."
          type={ProcessMenuStepType.danger}
        />
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrerer alle fire statustyper: default, warning, success og danger.',
      },
    },
  },
};
