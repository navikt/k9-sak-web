import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { mapVilkar, transformBeregningValues } from '@fpsak-frontend/utils';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { BeregningsgrunnlagProsessIndex } from '@navikt/ft-prosess-beregningsgrunnlag';
import '@navikt/ft-prosess-beregningsgrunnlag/dist/style.css';
import { useContext } from 'react';

import { k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import { ProsessStegIkkeVurdert } from '@k9-sak-web/gui/behandling/prosess/ProsessStegIkkeVurdert.js';
import { Behandling, KodeverkMedNavn } from '@k9-sak-web/types';
import { useSuspenseQueries } from '@tanstack/react-query';
import { K9SakProsessApi } from './api/K9SakProsessApi';
import {
  aksjonspunkterQueryOptions,
  arbeidsgiverOpplysningerQueryOptions,
  beregningsgrunnlagQueryOptions,
  vilkårQueryOptions,
} from './api/k9SakQueryOptions';

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
      aksjonspunkterQueryOptions(props.api, props.behandling, (data: k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto[]) =>
        data.filter(ap => BEREGNING_AKSJONSPUNKT_KODER.some(kode => kode === ap.definisjon)),
      ),
      vilkårQueryOptions(props.api, props.behandling),
      {
        queryKey: ['beregningreferanserTilVurdering', props.behandling.uuid, props.behandling.versjon],
        queryFn: () => props.api.getBeregningreferanserTilVurdering(props.behandling.uuid),
      },
      beregningsgrunnlagQueryOptions(props.api, props.behandling),
      arbeidsgiverOpplysningerQueryOptions(props.api, props.behandling),
    ],
  });

  const erValgt = context?.erValgt(PANEL_ID);
  const erStegVurdert = context?.erVurdert(PANEL_ID);

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
