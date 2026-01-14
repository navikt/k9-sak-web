import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { mapVilkar, transformBeregningValues } from '@fpsak-frontend/utils';
import { usePanelRegistrering } from '@k9-sak-web/gui/behandling/prosess/hooks/usePanelRegistrering.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import { BeregningsgrunnlagProsessIndex } from '@navikt/ft-prosess-beregningsgrunnlag';
import '@navikt/ft-prosess-beregningsgrunnlag/dist/style.css';
import { useContext, useMemo } from 'react';

import { k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import { ProsessStegIkkeVurdert } from '@k9-sak-web/gui/behandling/prosess/ProsessStegIkkeVurdert.js';
import { Behandling, KodeverkMedNavn } from '@k9-sak-web/types';
import { useSuspenseQueries } from '@tanstack/react-query';
import { K9SakProsessApi } from './api/K9SakProsessApi';

const BEREGNING_AKSJONSPUNKT_KODER = [
  aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS,
  aksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
  aksjonspunktCodes.VURDER_VARIG_ENDRET_ARBEIDSSITUASJON,
  aksjonspunktCodes.FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE,
  aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
  aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
];

// Definer panel-identitet som konstanter
const PANEL_ID = prosessStegCodes.BEREGNINGSGRUNNLAG;
const PANEL_TEKST = 'Behandlingspunkt.Beregning';

interface Props {
  api: K9SakProsessApi;
  behandling: Behandling;
  submitCallback: (data: any, aksjonspunkt: k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto[]) => Promise<any>;
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

  // Hent alle data parallelt med useSuspenseQueries
  const [
    { data: aksjonspunkter },
    { data: vilkår },
    { data: beregningreferanserTilVurdering = [] },
    { data: beregningsgrunnlag },
    { data: arbeidsgiverOpplysningerPerId = [] },
  ] = useSuspenseQueries({
    queries: [
      {
        queryKey: ['aksjonspunkter', props.behandling?.uuid, props.behandling?.versjon],
        queryFn: () => props.api.getAksjonspunkter(props.behandling.uuid),
        select: (data: k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto[]) =>
          data.filter(ap => BEREGNING_AKSJONSPUNKT_KODER.some(kode => kode === ap.definisjon)),
      },
      {
        queryKey: ['vilkar', props.behandling.uuid, props.behandling.versjon],
        queryFn: () => props.api.getVilkår(props.behandling.uuid),
      },
      {
        queryKey: ['beregningreferanserTilVurdering', props.behandling.uuid, props.behandling.versjon],
        queryFn: () => props.api.getBeregningreferanserTilVurdering(props.behandling.uuid),
      },
      {
        queryKey: ['beregningsgrunnlag', props.behandling.uuid, props.behandling.versjon],
        queryFn: () => props.api.getAlleBeregningsgrunnlag(props.behandling.uuid),
      },
      {
        queryKey: ['arbeidsgiverOpplysningerPerId', props.behandling.uuid, props.behandling.versjon],
        queryFn: () => props.api.getArbeidsgiverOpplysninger(props.behandling.uuid),
      },
    ],
  });

  // Beregn paneltype basert på aksjonspunkter og vilkår (for menystatusindikator)
  const panelType = useMemo((): ProcessMenuStepType => {
    // Sjekk om det finnes åpne aksjonspunkter for beregning
    const harApentAksjonspunkt = aksjonspunkter?.some(ap => ap.status === 'OPPR' && !ap.erAktivt);

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
      if (aksjonspunkter.length > 0) {
        // Hvis det finnes åpne aksjonspunkter, vis default (ikke vurdert)
        const harApneAksjonspunkter = aksjonspunkter.some(ap => ap.status === 'OPPR');
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

  usePanelRegistrering({ ...context, erValgt }, PANEL_ID, PANEL_TEKST, panelType);

  const erStegVurdert = panelType !== ProcessMenuStepType.default;

  const bgVilkaret = vilkår?.find(v => v.vilkarType === vilkarType.BEREGNINGSGRUNNLAGVILKARET);

  const handleSubmit = async (data: any) => {
    return props.submitCallback(data, aksjonspunkter);
  };

  // Render kun hvis panelet er valgt (injisert av ProsessMeny)
  if (!erValgt || !bgVilkaret) {
    return null;
  }

  if (!erStegVurdert) {
    return <ProsessStegIkkeVurdert />;
  }

  return (
    <BeregningsgrunnlagProsessIndex
      beregningsgrunnlagsvilkar={mapVilkar(bgVilkaret, beregningreferanserTilVurdering)}
      beregningsgrunnlagListe={beregningsgrunnlag}
      arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      submitCallback={submitData => handleSubmit(transformBeregningValues(submitData, true))}
      formData={props.formData}
      kodeverkSamling={props.alleKodeverk}
      setFormData={props.setFormData}
      readOnlySubmitButton={false}
      isReadOnly={props.isReadOnly}
    />
  );
}
