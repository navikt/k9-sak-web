import { mapVilkar, transformBeregningValues } from '@fpsak-frontend/utils';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import {
  k9_kodeverk_vilkår_VilkårType,
  k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import { ProsessStegIkkeVurdert } from '@k9-sak-web/gui/behandling/prosess/ProsessStegIkkeVurdert.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { Behandling } from '@k9-sak-web/types';
import { BeregningsgrunnlagProsessIndex } from '@navikt/ft-prosess-beregningsgrunnlag';
import '@navikt/ft-prosess-beregningsgrunnlag/dist/style.css';
import { useSuspenseQueries } from '@tanstack/react-query';
import { ComponentProps, useContext, useMemo, use } from 'react';
import { K9SakProsessApi } from './api/K9SakProsessApi';
import {
  aksjonspunkterQueryOptions,
  arbeidsgiverOpplysningerQueryOptions,
  beregningreferanserTilVurderingQueryOptions,
  beregningsgrunnlagQueryOptions,
  vilkårQueryOptions,
} from './api/k9SakQueryOptions';
import { mapArbeidsgiverOpplysningerPerIdTilFP } from '@k9-sak-web/gui/ft-adapt/mapArbeidsgiverOpplysninger.js';
import { mapBeregningsgrunnlagTilFP } from '@k9-sak-web/gui/ft-adapt/mapBeregningsgrunnlag.js';
import { K9KodeverkoppslagContext } from '@k9-sak-web/gui/kodeverk/oppslag/K9KodeverkoppslagContext.js';

const BEREGNING_AKSJONSPUNKT_KODER = [
  AksjonspunktDefinisjon.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS,
  AksjonspunktDefinisjon.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NÆRING_SELVSTENDIG_NÆRINGSDRIVENDE,
  AksjonspunktDefinisjon.VURDER_VARIG_ENDRET_ARBEIDSSITUASJON,
  AksjonspunktDefinisjon.FASTSETT_BEREGNINGSGRUNNLAG_SELVSTENDIG_NÆRINGSDRIVENDE,
  AksjonspunktDefinisjon.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
  AksjonspunktDefinisjon.FASTSETT_BEREGNINGSGRUNNLAG_FOR_SN_NY_I_ARBEIDSLIVET,
];

// Hent ut prop typer BeregningsgrunnlagProsessIndex forventer
type BeregningFormData = ComponentProps<typeof BeregningsgrunnlagProsessIndex>['formData'];
type KodeverkSamling = ComponentProps<typeof BeregningsgrunnlagProsessIndex>['kodeverkSamling'];

// Definer panel-identitet som konstanter
const PANEL_ID = prosessStegCodes.BEREGNINGSGRUNNLAG;

export interface BeregningsgrunnlagProsessStegInitPanelProps {
  api: K9SakProsessApi;
  behandling: Behandling;
  submitCallback: (data: any, aksjonspunkt: k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto[]) => Promise<any>;
  formData: BeregningFormData;
  setFormData: (data: unknown) => void;
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
export function BeregningsgrunnlagProsessStegInitPanel(props: BeregningsgrunnlagProsessStegInitPanelProps) {
  const prosessPanelContext = useContext(ProsessPanelContext);
  // Lag kodeverkSamling slik BeregningsgrunnlagProsessIndex forventer å få det
  const { k9sak } = use(K9KodeverkoppslagContext);
  const kodeverkSamling: KodeverkSamling = useMemo(() => {
    return {
      AktivitetStatus: k9sak.alleKodeverdierForKodeverk('aktivitetStatuser'),
      OpptjeningAktivitetType: k9sak.alleKodeverdierForKodeverk('opptjeningAktivitetTyper'),
    };
  }, [k9sak]);

  const [
    { data: aksjonspunkter },
    { data: vilkår },
    { data: beregningreferanserTilVurdering = [] },
    { data: beregningsgrunnlag },
    { data: arbeidsgiverOpplysningerPerId },
  ] = useSuspenseQueries({
    queries: [
      aksjonspunkterQueryOptions(props.api, props.behandling, BEREGNING_AKSJONSPUNKT_KODER),
      vilkårQueryOptions(props.api, props.behandling),
      beregningreferanserTilVurderingQueryOptions(props.api, props.behandling),
      beregningsgrunnlagQueryOptions(props.api, props.behandling),
      arbeidsgiverOpplysningerQueryOptions(props.api, props.behandling),
    ],
  });

  const erValgt = prosessPanelContext?.erValgt(PANEL_ID);
  const erStegVurdert = prosessPanelContext?.erVurdert(PANEL_ID);

  const bgVilkaret = vilkår?.find(v => v.vilkarType === k9_kodeverk_vilkår_VilkårType.BEREGNINGSGRUNNLAGVILKÅR);

  const handleSubmit = async (data: any) => {
    return props.submitCallback(data, aksjonspunkter);
  };

  if (!erValgt || !bgVilkaret) {
    return null;
  }

  if (!erStegVurdert) {
    return <ProsessStegIkkeVurdert />;
  }

  return (
    <BeregningsgrunnlagProsessIndex
      beregningsgrunnlagsvilkar={mapVilkar(bgVilkaret, beregningreferanserTilVurdering)}
      beregningsgrunnlagListe={beregningsgrunnlag.map(mapBeregningsgrunnlagTilFP)}
      arbeidsgiverOpplysningerPerId={mapArbeidsgiverOpplysningerPerIdTilFP(arbeidsgiverOpplysningerPerId.arbeidsgivere)}
      submitCallback={submitData => handleSubmit(transformBeregningValues(submitData, true))}
      formData={props.formData}
      kodeverkSamling={kodeverkSamling}
      setFormData={props.setFormData}
      readOnlySubmitButton={false}
      isReadOnly={props.isReadOnly}
    />
  );
}
