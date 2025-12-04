import { useMemo } from 'react';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { konverterKodeverkTilKode, mapVilkar, transformBeregningValues } from '@fpsak-frontend/utils';
import { ProsessDefaultInitPanel } from '@k9-sak-web/gui/behandling/prosess/ProsessDefaultInitPanel.js';
import { usePanelRegistrering } from '@k9-sak-web/gui/behandling/prosess/hooks/usePanelRegistrering.js';
import { useStandardProsessPanelProps } from '@k9-sak-web/gui/behandling/prosess/hooks/useStandardProsessPanelProps.js';
import { useErValgtPanel } from '@k9-sak-web/gui/behandling/prosess/context/ValgtPanelContext.js';
import type { ProsessPanelProps } from '@k9-sak-web/gui/behandling/prosess/types/panelTypes.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import { BeregningsgrunnlagProsessIndex } from '@navikt/ft-prosess-beregningsgrunnlag';
import '@navikt/ft-prosess-beregningsgrunnlag/dist/style.css';

import { PleiepengerBehandlingApiKeys, restApiPleiepengerHooks } from '../data/pleiepengerBehandlingApi';

/**
 * InitPanel for beregningsgrunnlag prosesssteg
 * 
 * Wrapper for BeregningsgrunnlagProsessIndex som håndterer:
 * - Registrering med menyen via usePanelRegistrering
 * - Datahenting via RequestApi
 * - Rendering av legacy panelkomponent
 */
export function BeregningsgrunnlagProsessStegInitPanel(props: ProsessPanelProps) {
  // Definer panel-identitet som konstanter
  const PANEL_ID = prosessStegCodes.BEREGNINGSGRUNNLAG;
  const PANEL_TEKST = 'Behandlingspunkt.Beregning';

  // Hent arbeidsgiverOpplysningerPerId fra context (kommer fra parent props)
  const { arbeidsgiverOpplysningerPerId, aksjonspunkter, vilkar } = useStandardProsessPanelProps();

  // Hent data ved bruk av eksisterende RequestApi-mønster
  const restApiData = restApiPleiepengerHooks.useMultipleRestApi<{
    beregningsgrunnlag: any;
    beregningreferanserTilVurdering: any;
  }>(
    [
      { key: PleiepengerBehandlingApiKeys.BEREGNINGSGRUNNLAG },
      { key: PleiepengerBehandlingApiKeys.BEREGNINGREFERANSER_TIL_VURDERING },
    ],
    { keepData: true, suspendRequest: false, updateTriggers: [] },
  );

  // Aksjonspunktkoder som er relevante for beregning
  const BEREGNING_AKSJONSPUNKT_KODER = [
    aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS,
    aksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
    aksjonspunktCodes.VURDER_VARIG_ENDRET_ARBEIDSSITUASJON,
    aksjonspunktCodes.FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE,
    aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
    aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
  ];

  // Beregn paneltype basert på aksjonspunkter og vilkår (for menystatusindikator)
  const panelType = useMemo((): ProcessMenuStepType => {
    // Sjekk om det finnes åpne aksjonspunkter for beregning
    const harApentAksjonspunkt = aksjonspunkter?.some(
      ap => BEREGNING_AKSJONSPUNKT_KODER.includes(ap.definisjon?.kode) && ap.status?.kode === 'OPPR' && !ap.erAktivt
    );
    
    if (harApentAksjonspunkt) {
      return ProcessMenuStepType.warning;
    }

    // Sjekk vilkårstatus for beregningsgrunnlag
    const bgVilkar = vilkar?.find(v => v.vilkarType?.kode === vilkarType.BEREGNINGSGRUNNLAGVILKARET);
    
    if (bgVilkar) {
      // Sjekk perioder for vilkårstatus (samme logikk som finnStatus)
      const vilkarStatusCodes = bgVilkar.perioder
        ?.filter(periode => periode.vurderesIBehandlingen)
        .map(periode => periode.vilkarStatus?.kode) || [];
      
      // Hvis alle perioder er IKKE_VURDERT, vis default
      if (vilkarStatusCodes.every(vsc => vsc === 'IKKE_VURDERT')) {
        return ProcessMenuStepType.default;
      }
      
      // Hvis noen perioder er OPPFYLT, vis success
      if (vilkarStatusCodes.some(vsc => vsc === 'OPPFYLT')) {
        return ProcessMenuStepType.success;
      }
      
      // Ellers (alle IKKE_OPPFYLT), vis danger
      return ProcessMenuStepType.danger;
    }
    
    // Hvis ingen vilkår, sjekk aksjonspunkter
    if (aksjonspunkter && aksjonspunkter.length > 0) {
      const relevanteAksjonspunkter = aksjonspunkter.filter(ap =>
        BEREGNING_AKSJONSPUNKT_KODER.includes(ap.definisjon?.kode)
      );
      
      if (relevanteAksjonspunkter.length > 0) {
        // Hvis det finnes åpne aksjonspunkter, vis default (ikke vurdert)
        const harApneAksjonspunkter = relevanteAksjonspunkter.some(ap => ap.status?.kode === 'OPPR');
        if (harApneAksjonspunkter) {
          return ProcessMenuStepType.default;
        }
        // Hvis aksjonspunkter er lukket, vis success
        return ProcessMenuStepType.success;
      }
    }
    
    // Default tilstand
    return ProcessMenuStepType.default;
  }, [aksjonspunkter, vilkar]);

  // Registrer panel med menyen
  usePanelRegistrering(props, PANEL_ID, PANEL_TEKST, panelType);

  // Sjekk om dette panelet er valgt via context (unngår race conditions med props)
  const erValgt = useErValgtPanel(PANEL_ID);

  // Render kun hvis panelet er valgt
  if (!erValgt) {
    return null;
  }

  // Ikke vis panelet hvis data ikke er lastet ennå
  // TODO: Bruk Suspense for datahenting i fremtiden
  const data = restApiData.data;
  if (!data) {
    return null;
  }

  return (
    // Bruker ProsessDefaultInitPanel for å hente standard props og rendre legacy panel
    <ProsessDefaultInitPanel urlKode={prosessStegCodes.BEREGNINGSGRUNNLAG} tekstKode="Behandlingspunkt.Beregning">
      {standardProps => {
        // Legacy komponent krever deep copy og kodeverkkonvertering
        const deepCopyProps = JSON.parse(JSON.stringify(standardProps));
        konverterKodeverkTilKode(deepCopyProps);
        
        // Finn beregningsgrunnlagvilkåret
        const bgVilkaret = deepCopyProps.vilkar.find(v => v.vilkarType === vilkarType.BEREGNINGSGRUNNLAGVILKARET);

        return (
          <BeregningsgrunnlagProsessIndex
            {...standardProps}
            beregningsgrunnlagsvilkar={mapVilkar(bgVilkaret, data.beregningreferanserTilVurdering)}
            beregningsgrunnlagListe={deepCopyProps.beregningsgrunnlag || data.beregningsgrunnlag}
            arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
            submitCallback={submitData => standardProps.submitCallback(transformBeregningValues(submitData, true))}
            formData={standardProps.formData}
            kodeverkSamling={deepCopyProps.alleKodeverk}
            setFormData={standardProps.setFormData}
          />
        );
      }}
    </ProsessDefaultInitPanel>
  );
}
