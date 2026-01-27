import type { k9_sak_kontrakt_behandling_BehandlingDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { useStandardProsessPanelPropsContextOptional } from '../context/StandardProsessPanelPropsContext.js';

/**
 * Standard props interface for prosesspaneler.
 * Alle prosesspaneler mottar disse via useStandardProsessPanelProps hook.
 */
export interface StandardProsessPanelProps {
  /** Behandling-objekt (legacy type) */
  behandling: any;

  /** Fagsak-objekt (legacy type) */
  fagsak: any;

  /** Liste av aksjonspunkter (legacy type) */
  aksjonspunkter: any[];

  /** Liste av vilkår (legacy type) */
  vilkar?: any[];

  /** Alle kodeverk med navn (legacy type) */
  alleKodeverk: any;

  /** Callback for å submitte aksjonspunkt */
  submitCallback: (aksjonspunktModels: any[]) => Promise<any>;

  /** Callback for å forhåndsvise dokument */
  previewCallback?: (data: any) => Promise<any>;

  /** Callback for å forhåndsvise tilbakekrevingsbrev */
  previewFptilbakeCallback?: (
    mottaker: string,
    brevmalkode: string,
    fritekst: string,
    saksnummer: string,
  ) => Promise<any>;

  /** Om panelet er read-only */
  isReadOnly: boolean;

  /** Om det finnes åpne aksjonspunkter for dette panelet */
  isAksjonspunktOpen: boolean;

  /** Status for panelet (f.eks. vilkårstatus) */
  status: string;

  /** Rettigheter-objekt (legacy type) */
  rettigheter?: any;

  /** Feature toggles (legacy type) */
  featureToggles?: any;

  /** Form data for Redux forms (legacy type) */
  formData?: any;

  /** Callback to update form data (legacy type) */
  setFormData?: (data: any) => void;

  /** Arbeidsgiver opplysninger per ID (legacy type) */
  arbeidsgiverOpplysningerPerId?: any;
  hentBehandling?: (params?: any, keepData?: boolean) => Promise<k9_sak_kontrakt_behandling_BehandlingDto>;
  erOverstyrer: boolean;
  lagreDokumentdata?: (
    params?: any,
    keepData?: boolean | undefined,
  ) => Promise<k9_sak_kontrakt_behandling_BehandlingDto>;
  hentFritekstbrevHtmlCallback?: (parameters: any) => Promise<any>;
}

/**
 * Hook som gir tilgang til standard props for prosesspaneler.
 *
 * Henter data fra StandardProsessPanelPropsContext som settes opp av legacy behandlingscontainer.
 * Dette lar v2-komponenter jobbe med legacy-data uten å importere legacy-kode.
 *
 * MERK: Denne hooken forventer at StandardProsessPanelPropsProvider er satt opp rundt ProsessMeny.
 * Hvis brukt utenfor provider (f.eks. i Storybook), returneres mock data.
 *
 * @returns StandardProsessPanelProps med all nødvendig data for prosesspaneler
 *
 * @example
 * ```typescript
 * function MyProsessStegInitPanel() {
 *   const standardProps = useStandardProsessPanelProps();
 *
 *   return (
 *     <ProsessDefaultInitPanel
 *       urlKode="my-step"
 *       tekstKode="MyStep.Title"
 *     >
 *       {(props) => <MyStepPanel {...props} />}
 *     </ProsessDefaultInitPanel>
 *   );
 * }
 * ```
 */
export function useStandardProsessPanelProps(): StandardProsessPanelProps {
  // Hent data fra context (optional for å støtte Storybook)
  const context = useStandardProsessPanelPropsContextOptional();

  // Hvis context finnes, bruk den
  if (context) {
    return {
      behandling: context.behandling,
      fagsak: context.fagsak,
      aksjonspunkter: context.aksjonspunkter,
      vilkar: context.vilkar,
      alleKodeverk: context.alleKodeverk,
      submitCallback: context.submitCallback,
      previewCallback: context.previewCallback,
      previewFptilbakeCallback: context.previewFptilbakeCallback,
      isReadOnly: context.isReadOnly,
      isAksjonspunktOpen: false, // TODO: Beregn basert på aksjonspunkter
      status: 'default', // TODO: Beregn basert på vilkår/status
      rettigheter: context.rettigheter,
      featureToggles: context.featureToggles,
      formData: context.formData,
      setFormData: context.setFormData,
      arbeidsgiverOpplysningerPerId: context.arbeidsgiverOpplysningerPerId,
      hentBehandling: context.hentBehandling,
      erOverstyrer: context.erOverstyrer,
      lagreDokumentdata: context.lagreDokumentdata,
      hentFritekstbrevHtmlCallback: context.hentFritekstbrevHtmlCallback,
    };
  }

  // Fallback: Mock data for Storybook/testing
  console.warn(
    'useStandardProsessPanelProps: Ingen StandardProsessPanelPropsProvider funnet. Bruker mock data. ' +
      'Dette er OK i Storybook, men indikerer en feil i produksjon.',
  );

  return {
    behandling: { id: 1, type: { kode: 'BT-004' }, status: { kode: 'OPPRETTET' }, versjon: 1 },
    fagsak: { saksnummer: '123456', sakstype: { kode: 'PSB' } },
    aksjonspunkter: [],
    vilkar: [],
    alleKodeverk: {},
    submitCallback: async () => {
      console.log('submitCallback called (mock implementation)');
    },
    previewCallback: async () => {
      console.log('previewCallback called (mock implementation)');
    },
    isReadOnly: false,
    isAksjonspunktOpen: false,
    status: 'default',
    rettigheter: {},
    featureToggles: {},
    formData: {},
    setFormData: () => {
      console.log('setFormData called (mock implementation)');
    },
    erOverstyrer: false,
  };
}
