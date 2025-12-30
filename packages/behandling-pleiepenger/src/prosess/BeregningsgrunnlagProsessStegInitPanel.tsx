import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { mapVilkar, transformBeregningValues } from '@fpsak-frontend/utils';
import { ProsessDefaultInitPanel } from '@k9-sak-web/gui/behandling/prosess/ProsessDefaultInitPanel.js';
import { usePanelRegistrering } from '@k9-sak-web/gui/behandling/prosess/hooks/usePanelRegistrering.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import { BeregningsgrunnlagProsessIndex } from '@navikt/ft-prosess-beregningsgrunnlag';
import '@navikt/ft-prosess-beregningsgrunnlag/dist/style.css';
import { useContext, useMemo } from 'react';

import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import { Behandling, KodeverkMedNavn } from '@k9-sak-web/types';
import { useQuery } from '@tanstack/react-query';
import { K9SakProsessApi } from './K9SakProsessApi';

const BEREGNING_AKSJONSPUNKT_KODER = [
  aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS,
  aksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
  aksjonspunktCodes.VURDER_VARIG_ENDRET_ARBEIDSSITUASJON,
  aksjonspunktCodes.FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE,
  aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
  aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
];

interface Props {
  api: K9SakProsessApi;
  behandling: Behandling;
  submitCallback: (data: any) => Promise<any>;
  formData: any;
  setFormData: (data: any) => void;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  isReadOnly: boolean;
}

/**
 * InitPanel for beregningsgrunnlag prosesssteg
 *
 * Wrapper for BeregningsgrunnlagProsessIndex som håndterer:
 * - Registrering med menyen via usePanelRegistrering
 * - Datahenting via RequestApi
 * - Rendering av legacy panelkomponent
 */
export function BeregningsgrunnlagProsessStegInitPanel(props: Props) {
  const context = useContext(ProsessPanelContext);
  // Definer panel-identitet som konstanter
  const PANEL_ID = prosessStegCodes.BEREGNINGSGRUNNLAG;
  const PANEL_TEKST = 'Behandlingspunkt.Beregning';

  const { data: aksjonspunkter } = useQuery({
    queryKey: ['aksjonspunkter', props.behandling?.uuid],
    queryFn: () => props.api.getAksjonspunkter(props.behandling.uuid),
    select: data => data.filter(ap => BEREGNING_AKSJONSPUNKT_KODER.some(kode => kode === ap.definisjon)),
  });

  const { data: vilkår } = useQuery({
    queryKey: ['vilkar', props.behandling.uuid],
    queryFn: () => props.api.getVilkår(props.behandling.uuid),
  });

  const { data: beregningreferanserTilVurdering = [] } = useQuery({
    queryKey: ['beregningreferanserTilVurdering', props.behandling.uuid],
    queryFn: () => props.api.getBeregningreferanserTilVurdering(props.behandling.uuid),
  });

  const { data: beregningsgrunnlag = [] } = useQuery({
    queryKey: ['beregningsgrunnlag', props.behandling.uuid],
    queryFn: () => props.api.getAlleBeregningsgrunnlag(props.behandling.uuid),
  });

  const { data: arbeidsgiverOpplysningerPerId = [] } = useQuery({
    queryKey: ['arbeidsgiverOpplysningerPerId', props.behandling.uuid],
    queryFn: () => props.api.getArbeidsgiverOpplysninger(props.behandling.uuid),
  });

  // Beregn paneltype basert på aksjonspunkter og vilkår (for menystatusindikator)
  const panelType = useMemo((): ProcessMenuStepType => {
    // Sjekk om det finnes åpne aksjonspunkter for beregning
    const harApentAksjonspunkt = aksjonspunkter?.some(
      ap => BEREGNING_AKSJONSPUNKT_KODER.some(kode => kode === ap.definisjon) && ap.status === 'OPPR' && !ap.erAktivt,
    );

    if (harApentAksjonspunkt) {
      return ProcessMenuStepType.warning;
    }

    // Sjekk vilkårstatus for beregningsgrunnlag
    const bgVilkar = vilkår?.find(v => v.vilkarType === vilkarType.BEREGNINGSGRUNNLAGVILKARET);

    if (bgVilkar) {
      // Sjekk perioder for vilkårstatus (samme logikk som finnStatus)
      const vilkarStatusCodes =
        bgVilkar.perioder?.filter(periode => periode.vurderesIBehandlingen).map(periode => periode.vilkarStatus) || [];

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
        BEREGNING_AKSJONSPUNKT_KODER.some(kode => kode === ap.definisjon),
      );

      if (relevanteAksjonspunkter.length > 0) {
        // Hvis det finnes åpne aksjonspunkter, vis default (ikke vurdert)
        const harApneAksjonspunkter = relevanteAksjonspunkter.some(ap => ap.status === 'OPPR');
        if (harApneAksjonspunkter) {
          return ProcessMenuStepType.default;
        }
        // Hvis aksjonspunkter er lukket, vis success
        return ProcessMenuStepType.success;
      }
    }

    // Default tilstand
    return ProcessMenuStepType.default;
  }, [aksjonspunkter, vilkår]);

  const erValgt = context?.erValgt(PANEL_ID);
  // Registrer panel med menyen
  usePanelRegistrering({ ...context, erValgt }, PANEL_ID, PANEL_TEKST, panelType);

  // Render kun hvis panelet er valgt (injisert av ProsessMeny)
  if (!erValgt || !beregningsgrunnlag) {
    return null;
  }

  return (
    // Bruker ProsessDefaultInitPanel for å hente standard props og rendre legacy panel
    <ProsessDefaultInitPanel urlKode={prosessStegCodes.BEREGNINGSGRUNNLAG} tekstKode="Behandlingspunkt.Beregning">
      {() => {
        const bgVilkaret = vilkår?.find(v => v.vilkarType === vilkarType.BEREGNINGSGRUNNLAGVILKARET);
        if (!bgVilkaret) {
          return null;
        }
        return (
          <BeregningsgrunnlagProsessIndex
            beregningsgrunnlagsvilkar={mapVilkar(bgVilkaret, beregningreferanserTilVurdering)}
            beregningsgrunnlagListe={beregningsgrunnlag}
            arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
            submitCallback={submitData => props.submitCallback(transformBeregningValues(submitData, true))}
            formData={props.formData}
            kodeverkSamling={props.alleKodeverk}
            setFormData={props.setFormData}
            readOnlySubmitButton={false}
            isReadOnly={props.isReadOnly}
          />
        );
      }}
    </ProsessDefaultInitPanel>
  );
}
