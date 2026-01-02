import type { Meta, StoryObj } from '@storybook/react';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import { IntlProvider } from 'react-intl';
import { useMemo } from 'react';
import { ProsessDefaultInitPanel } from './ProsessDefaultInitPanel.js';
import type { StandardProsessPanelProps } from './hooks/useStandardProsessPanelProps.js';
import type { ProsessPanelProps } from './types/panelTypes.js';
import { usePanelRegistrering } from './hooks/usePanelRegistrering.js';

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
  'PropsBased.Title': 'Props-basert Panel',
};

/**
 * Mock-komponent som simulerer et prosesspanel.
 */
function MockProsessPanel({ 
  title, 
  content, 
  standardProps,
  showPropsInfo = false,
}: { 
  title: string; 
  content: string;
  standardProps?: StandardProsessPanelProps;
  showPropsInfo?: boolean;
}) {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
      <h2>{title}</h2>
      <p>{content}</p>
      {showPropsInfo && standardProps && (
        <div style={{ marginTop: '16px', fontSize: '14px', color: '#666' }}>
          <h3>Standard Props:</h3>
          <ul>
            <li>Behandling ID: {standardProps.behandling?.id || 'N/A'}</li>
            <li>Fagsak: {standardProps.fagsak?.saksnummer || 'N/A'}</li>
            <li>Aksjonspunkter: {standardProps.aksjonspunkter?.length || 0}</li>
            <li>Read Only: {standardProps.isReadOnly ? 'Ja' : 'Nei'}</li>
            <li>Aksjonspunkt Open: {standardProps.isAksjonspunktOpen ? 'Ja' : 'Nei'}</li>
            <li>Status: {standardProps.status || 'N/A'}</li>
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
Komponenten bruker kun **props-basert tilnærming** hvor parent-komponenten (InitPanel) 
håndterer registrering med menyen.

### Bruksmønster

Panel definerer sin egen identitet og bruker usePanelRegistrering:

\`\`\`tsx
export function BeregningProsessStegInitPanel(props: ProsessPanelProps) {
  // 1. Definer panel-identitet som konstanter
  const PANEL_ID = 'beregning';
  const PANEL_TEKST = 'Beregning.Title';
  
  // 2. Beregn paneltype basert på data
  const panelType = useMemo(() => {
    // Logikk for å bestemme type
    return ProcessMenuStepType.warning;
  }, [data]);
  
  // 3. Registrer panel med menyen
  usePanelRegistrering(props, PANEL_ID, PANEL_TEKST, panelType);
  
  // 4. Render kun hvis valgt
  if (!props.erValgt) return null;
  
  // 5. Bruk ProsessDefaultInitPanel for å hente standard props og rendre legacy panel
  return (
    <ProsessDefaultInitPanel
      urlKode={PANEL_ID}
      tekstKode={PANEL_TEKST}
    >
      {(standardProps) => (
        <BeregningProsessIndex {...standardProps} />
      )}
    </ProsessDefaultInitPanel>
  );
}
\`\`\`

## Fordeler

- ✅ **Typesikkerhet**: TypeScript validerer props ved compile-time
- ✅ **Selvdokumenterende**: Paneler definerer sin egen identitet via konstanter
- ✅ **Ingen boilerplate**: Bare \`<BeregningPanel />\` i parent
- ✅ **Bedre testbarhet**: Mock callbacks direkte uten context
- ✅ **Klarere eierskap**: Panel eier sin ID, tekst og statuslogikk

## Ansvar

**ProsessDefaultInitPanel** er ansvarlig for:
- Henting av standard panelprops fra context
- Evaluering av synlighetslogikk (skalVisePanel)
- Rendering av legacy panelkomponent

**Parent-komponenten (InitPanel)** er ansvarlig for:
- Registrering med menyen via usePanelRegistrering
- Sjekke props.erValgt og returnere null hvis ikke valgt
- Oppdatere menystatus via onUpdateType callback

## v2-prinsipper

- Ingen manuell loading/error håndtering (håndteres av Suspense/ErrorBoundary)
- Antar at data alltid er tilgjengelig når komponenten rendres
- Bruker 'any' type for legacy-data for å unngå import av legacy-typer
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
 * Panel med default status
 * 
 * Parent-komponenten (InitPanel) håndterer registrering via usePanelRegistrering.
 */
export const DefaultStatus: Story = {
  args: {
    urlKode: 'default-status',
    tekstKode: 'DefaultStatus.Title',
    children: (standardProps: StandardProsessPanelProps) => (
      <MockProsessPanel
        title="Default Status"
        content="Dette panelet demonstrerer rendering."
        standardProps={standardProps}
      />
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Parent-komponenten (InitPanel) håndtere registrering og status.',
      },
    },
  },
};

/**
 * Kompleks eksempel med synlighetslogikk.
 * 
 * Demonstrerer skalVisePanel som er den eneste logikken som fortsatt håndteres
 * av ProsessDefaultInitPanel.
 */
export const KompleksEksempel: Story = {
  args: {
    urlKode: 'complex-example',
    tekstKode: 'DynamicStatus.Title',
    skalVisePanel: (data: StandardProsessPanelProps) => {
      // Vis kun hvis ikke read-only
      return !data.isReadOnly;
    },
    children: (standardProps: StandardProsessPanelProps) => (
      <MockProsessPanel
        title="Kompleks Eksempel"
        content="Dette panelet demonstrerer synlighetslogikk via skalVisePanel. Parent-komponenten håndterer registrering og status."
        standardProps={standardProps}
        showPropsInfo={true}
      />
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrerer synlighetslogikk via skalVisePanel (vises kun hvis ikke read-only). I props-basert tilnærming er dette den eneste logikken som håndteres av ProsessDefaultInitPanel.',
      },
    },
  },
};

/**
 * Props-basert eksempel med konstanter.
 * 
 * Demonstrerer moderne mønster hvor panel definerer sin egen identitet.
 */
function PropsBasedExamplePanel(props: ProsessPanelProps) {
  // 1. Definer panel-konstanter
  const PANEL_ID = 'props-based-example';
  const PANEL_TEKST = 'PropsBased.Title';

  // 2. Beregn paneltype fra data (i ekte panel ville dette være basert på faktisk data)
  const panelType = useMemo(() => {
    // Eksempel: Sjekk aksjonspunkter, vilkår, etc.
    return ProcessMenuStepType.success;
  }, []);

  // 3. Registrer med menyen
  usePanelRegistrering(props, PANEL_ID, PANEL_TEKST, panelType);

  // 4. Sjekk om panelet er valgt
  if (!props.erValgt) {
    return null;
  }

  // 5. Render innhold
  return (
    <ProsessDefaultInitPanel urlKode={PANEL_ID} tekstKode={PANEL_TEKST}>
      {(standardProps) => (
        <MockProsessPanel
          title="Props-basert Panel"
          content="Dette panelet bruker konstanter for identitet. Panelet definerer selv PANEL_ID og PANEL_TEKST, beregner sin egen type, og registrerer seg via usePanelRegistrering hook."
          standardProps={standardProps}
          showPropsInfo={true}
        />
      )}
    </ProsessDefaultInitPanel>
  );
}

export const PropsbasertMedKonstanter: Story = {
  args: {
    urlKode: 'props-based-example',
    tekstKode: 'PropsBased.Title',
    children: () => null, // Not used in this story
  },
  render: () => <PropsBasedExamplePanel />,
  parameters: {
    docs: {
      description: {
        story: `
Demonstrerer moderne props-basert tilnærming hvor:

1. **Panel definerer konstanter**: \`PANEL_ID\` og \`PANEL_TEKST\`
2. **Panel beregner sin type**: Basert på data (aksjonspunkter, vilkår, etc.)
3. **Panel registrerer seg**: Via \`usePanelRegistrering(props, PANEL_ID, PANEL_TEKST, panelType)\`
4. **Panel sjekker valg**: \`if (!props.erValgt) return null;\`
5. **Panel rendrer innhold**: Wrapper i \`ProsessDefaultInitPanel\`

Dette gir:
- ✅ Typesikkerhet (TypeScript validerer props)
- ✅ Selvdokumenterende (konstanter viser identitet)
- ✅ Ingen boilerplate i parent (\`<PropsBasedPanel />\`)
- ✅ Bedre testbarhet (mock callbacks direkte)
- ✅ Klarere eierskap (panel eier sin identitet)
        `,
      },
    },
  },
};
