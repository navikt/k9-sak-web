import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useMemo } from 'react';
import { IntlProvider } from 'react-intl';
import { usePanelRegistrering } from './hooks/usePanelRegistrering.js';
import { ProsessMeny } from './ProsessMeny.js';
import type { ProsessPanelProps } from './types/panelTypes.js';

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
 * Mock InitPanel-wrapper som demonstrerer props-basert tilnærming.
 *
 * Dette er mønsteret som brukes i ekte paneler:
 * 1. Panelet definerer PANEL_ID og PANEL_TEKST som konstanter
 * 2. Panelet beregner sin egen panelType basert på data
 * 3. Panelet bruker usePanelRegistrering for å registrere seg
 * 4. Panelet sjekker props.erValgt før rendering
 */
function MockInitPanel({
  panelId,
  panelTekst,
  title,
  content,
  type = ProcessMenuStepType.default,
  usePartialStatus = false,
  skalVisePanel = () => true,
  ...props
}: ProsessPanelProps & {
  panelId: string;
  panelTekst: string;
  title: string;
  content: string;
  type?: ProcessMenuStepType;
  usePartialStatus?: boolean;
  skalVisePanel?: () => boolean;
}) {
  // Beregn paneltype (i ekte paneler ville dette være basert på data)
  const panelType = useMemo(() => type, [type]);

  // Registrer med menyen
  usePanelRegistrering(props, panelId, panelTekst, panelType, usePartialStatus);

  // Sjekk synlighet
  if (!skalVisePanel()) {
    return null;
  }

  // Render kun hvis valgt
  if (!props.erValgt) {
    return null;
  }

  return <MockProsessPanel title={title} content={content} />;
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
Komponenten bruker **props-basert registrering** for typesikkerhet og klarhet:

- **Typesikkerhet**: TypeScript validerer at children har riktige props ved compile-time
- **Automatisk injeksjon**: ProsessMeny injiserer callbacks (onRegister, onUnregister, onUpdateType, erValgt) til alle children
- **Selvdokumenterende**: Paneler definerer sin egen identitet via konstanter
- **Ingen boilerplate**: Bare \`<VarselPanel />\` - ingen props nødvendig i parent

## Hvordan det Fungerer

1. **Panel definerer konstanter**:
\`\`\`tsx
const PANEL_ID = 'beregning';
const PANEL_TEKST = 'Beregning.Title';
\`\`\`

2. **Panel beregner sin type**:
\`\`\`tsx
const panelType = useMemo(() => {
  if (harAksjonspunkt) return ProcessMenuStepType.warning;
  return ProcessMenuStepType.default;
}, [data]);
\`\`\`

3. **Panel registrerer seg**:
\`\`\`tsx
usePanelRegistrering(props, PANEL_ID, PANEL_TEKST, panelType);
\`\`\`

4. **Panel sjekker om det er valgt**:
\`\`\`tsx
if (!props.erValgt) return null;
\`\`\`

## Bruk

\`\`\`tsx
<ProsessMeny>
  <VarselProsessStegInitPanel />
  <BeregningProsessStegInitPanel />
  <VedtakProsessStegInitPanel />
</ProsessMeny>
\`\`\`

Ingen props nødvendig - paneler er selvdokumenterende.
        `,
      },
    },
  },
} satisfies Meta<typeof ProsessMeny>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Standard visning med flere paneler med forskjellige statustyper.
 *
 * Demonstrerer situasjoner hvor paneler:
 * - Definerer sin egen identitet (panelId, panelTekst)
 * - Beregner sin egen type (warning, success, danger, default)
 * - Registrerer seg via usePanelRegistrering hook
 * - Sjekker props.erValgt før rendering
 */
export const MedFlerePaneler: Story = {
  args: {
    children: <></>,
    steg: [],
  },
  render: () => (
    <ProsessMeny steg={[]}>
      <MockInitPanel
        key="varsel"
        panelId="varsel"
        panelTekst="Varsel.Title"
        title="Varsel om revurdering"
        content="Dette panelet viser varsel om revurdering."
        type={ProcessMenuStepType.default}
      />
      <MockInitPanel
        key="beregning"
        panelId="beregning"
        panelTekst="Beregning.Title"
        title="Beregning"
        content="Dette panelet har et åpent aksjonspunkt som krever oppmerksomhet."
        type={ProcessMenuStepType.warning}
      />
      <MockInitPanel
        key="vilkar"
        panelId="vilkar"
        panelTekst="Vilkar.Title"
        title="Vilkår"
        content="Alle vilkår er oppfylt for dette panelet."
        type={ProcessMenuStepType.success}
      />
      <MockInitPanel
        key="vedtak"
        panelId="vedtak"
        panelTekst="Vedtak.Title"
        title="Vedtak"
        content="Dette panelet har problemer som må løses."
        type={ProcessMenuStepType.danger}
      />
    </ProsessMeny>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Viser meny med fire paneler med forskjellige statustyper: default, warning, success og danger. Paneler bruker props-basert registrering med konstanter for identitet.',
      },
    },
  },
};

/**
 * Visning med delvis fullførte paneler.
 *
 * Demonstrerer usePartialStatus-flagget som viser delvis fullføringsindikator.
 */
export const MedPartialStatus: Story = {
  args: {
    children: <></>,
    steg: [],
  },
  render: () => (
    <ProsessMeny steg={[]}>
      <MockInitPanel
        key="inngangsvilkar"
        panelId="inngangsvilkar"
        panelTekst="Inngangsvilkar.Title"
        title="Inngangsvilkår"
        content="Noen vilkår er oppfylt, andre ikke."
        type={ProcessMenuStepType.warning}
        usePartialStatus={true}
      />
      <MockInitPanel
        key="beregning"
        panelId="beregning"
        panelTekst="Beregning.Title"
        title="Beregning"
        content="Beregning er delvis fullført."
        type={ProcessMenuStepType.default}
        usePartialStatus={true}
      />
      <MockInitPanel
        key="vedtak"
        panelId="vedtak"
        panelTekst="Vedtak.Title"
        title="Vedtak"
        content="Vedtak er ikke startet."
        type={ProcessMenuStepType.default}
      />
    </ProsessMeny>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Viser paneler med delvis fullføringsstatus (usePartialStatus=true). Props-basert tilnærming lar paneler definere sin egen partial status.',
      },
    },
  },
};

/**
 * Visning med kun ett panel.
 */
export const MedEttPanel: Story = {
  args: {
    children: <></>,
    steg: [],
  },
  render: () => (
    <ProsessMeny steg={[]}>
      <MockInitPanel
        key="varsel"
        panelId="varsel"
        panelTekst="Varsel.Title"
        title="Varsel om revurdering"
        content="Dette er det eneste panelet i menyen."
        type={ProcessMenuStepType.default}
      />
    </ProsessMeny>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Viser meny med kun ett panel. Props-basert tilnærming skalerer fra ett til mange paneler.',
      },
    },
  },
};

/**
 * Visning med betinget synlige paneler.
 *
 * Demonstrerer hvordan paneler kan kontrollere sin egen synlighet.
 * Panelet returnerer null hvis det ikke skal vises.
 */
export const MedBetingetSynlighet: Story = {
  args: {
    children: <></>,
    steg: [],
  },
  render: () => (
    <ProsessMeny steg={[]}>
      <MockInitPanel
        key="varsel"
        panelId="varsel"
        panelTekst="Varsel.Title"
        title="Varsel om revurdering"
        content="Dette panelet er alltid synlig."
        type={ProcessMenuStepType.default}
      />
      <MockInitPanel
        key="beregning"
        panelId="beregning"
        panelTekst="Beregning.Title"
        title="Beregning"
        content="Dette panelet er synlig."
        type={ProcessMenuStepType.warning}
        skalVisePanel={() => true}
      />
      <MockInitPanel
        key="skjult"
        panelId="skjult"
        panelTekst="Skjult.Title"
        title="Skjult panel"
        content="Dette panelet skal ikke vises."
        type={ProcessMenuStepType.default}
        skalVisePanel={() => false}
      />
      <MockInitPanel
        key="vedtak"
        panelId="vedtak"
        panelTekst="Vedtak.Title"
        title="Vedtak"
        content="Dette panelet er synlig."
        type={ProcessMenuStepType.default}
      />
    </ProsessMeny>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Viser hvordan paneler kan skjules basert på betingelser. Det tredje panelet returnerer null og vises ikke i menyen. Props-basert tilnærming gir paneler full kontroll over sin synlighet.',
      },
    },
  },
};

/**
 * Visning med alle statustyper.
 *
 * Demonstrerer hvordan paneler beregner og kommuniserer sin status til menyen.
 * Hver panel beregner sin egen type basert på data.
 */
export const AlleStatustyper: Story = {
  args: {
    children: <></>,
    steg: [],
  },
  render: () => (
    <ProsessMeny steg={[]}>
      <MockInitPanel
        key="default"
        panelId="default"
        panelTekst="Default.Title"
        title="Default status"
        content="Panel med default status (grå)."
        type={ProcessMenuStepType.default}
      />
      <MockInitPanel
        key="warning"
        panelId="warning"
        panelTekst="Warning.Title"
        title="Warning status"
        content="Panel med warning status (gul/oransje) - krever oppmerksomhet."
        type={ProcessMenuStepType.warning}
      />
      <MockInitPanel
        key="success"
        panelId="success"
        panelTekst="Success.Title"
        title="Success status"
        content="Panel med success status (grønn) - fullført."
        type={ProcessMenuStepType.success}
      />
      <MockInitPanel
        key="danger"
        panelId="danger"
        panelTekst="Danger.Title"
        title="Danger status"
        content="Panel med danger status (rød) - har problemer."
        type={ProcessMenuStepType.danger}
      />
    </ProsessMeny>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrerer alle fire statustyper: default, warning, success og danger. Props-basert tilnærming lar paneler beregne sin egen status reaktivt basert på data.',
      },
    },
  },
};
