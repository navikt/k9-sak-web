import * as React from 'react';

import MedlemskapFaktaIndex from '@fpsak-frontend/fakta-medlemskap';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import ArbeidsforholdFaktaIndex from '@fpsak-frontend/fakta-arbeidsforhold';
import OpptjeningFaktaIndex from '@fpsak-frontend/fakta-opptjening';
import BeregningFaktaIndex from '@fpsak-frontend/fakta-beregning';
import { faktaPanelCodes } from '@fpsak-frontend/fp-felles';
import OmsorgenForFaktaIndex from "@fpsak-frontend/fakta-omsorgen-for/src/OmsorgenForFaktaIndex";
import MedisinskVilkarIndex from "@fpsak-frontend/fakta-medisinsk-vilkar/src/MedisinskVilkarIndex";

import { readOnlyUtils } from '@fpsak-frontend/behandling-felles';

import pleiepengerBehandlingApi from '../data/pleiepengerBehandlingApi';

const faktaPanelDefinisjoner = [{
  urlCode: faktaPanelCodes.ARBEIDSFORHOLD,
  textCode: 'ArbeidsforholdInfoPanel.Title',
  aksjonspunkterCodes: [aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD],
  endpoints: [],
  renderComponent: (props) => <ArbeidsforholdFaktaIndex {...props} />,
  showComponent: ({ personopplysninger }) => personopplysninger,
  getData: ({ personopplysninger, inntektArbeidYtelse }) => ({ personopplysninger, inntektArbeidYtelse }),
}, {
  urlCode: faktaPanelCodes.OMSORGEN_FOR,
  textCode: 'FaktaOmAlderOgOmsorg.header',
  aksjonspunkterCodes: [],
  endpoints: [],
  renderComponent: (props) => <OmsorgenForFaktaIndex {...props} />,
  showComponent: () => true,
  getData: () => ({})
},
  {
    urlCode: faktaPanelCodes.MEDISINSKVILKAAR,
    textCode: 'MedisinskVilkarPanel.MedisinskVilkar',
    aksjonspunkterCodes: [aksjonspunktCodes.MEDISINSK_VILKAAR],
    endpoints: [],
    renderComponent: (props) => <MedisinskVilkarIndex {...props} />,
    showComponent: () => true,
    getData: () => ({})
  },
 {
  urlCode: faktaPanelCodes.MEDLEMSKAPSVILKARET,
  textCode: 'MedlemskapInfoPanel.Medlemskap',
  aksjonspunkterCodes: [aksjonspunktCodes.AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN, aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT,
    aksjonspunktCodes.AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE, aksjonspunktCodes.AVKLAR_OPPHOLDSRETT, aksjonspunktCodes.AVKLAR_LOVLIG_OPPHOLD,
    aksjonspunktCodes.AVKLAR_FORTSATT_MEDLEMSKAP, aksjonspunktCodes.OVERSTYR_AVKLAR_STARTDATO],
  endpoints: [pleiepengerBehandlingApi.MEDLEMSKAP, pleiepengerBehandlingApi.MEDLEMSKAP_V2],
  renderComponent: (props) => <MedlemskapFaktaIndex {...props} />,
  showComponent: ({ personopplysninger, soknad }) => personopplysninger && soknad,
  getData: ({
    fagsak, behandling, hasFetchError, soknad, personopplysninger, inntektArbeidYtelse,
  }) => ({
    isForeldrepengerFagsak: true,
    fagsakPerson: fagsak.fagsakPerson,
    readOnlyBehandling: hasFetchError || readOnlyUtils.harBehandlingReadOnlyStatus(behandling),
    soknad,
    personopplysninger,
    inntektArbeidYtelse,
  }),
}, {
  urlCode: faktaPanelCodes.OPPTJENINGSVILKARET,
  textCode: 'OpptjeningInfoPanel.KontrollerFaktaForOpptjening',
  aksjonspunkterCodes: [aksjonspunktCodes.VURDER_PERIODER_MED_OPPTJENING],
  endpoints: [pleiepengerBehandlingApi.OPPTJENING],
  renderComponent: (props) => <OpptjeningFaktaIndex {...props} />,
  showComponent: ({ vilkar }) => vilkar.some((v) => v.vilkarType.kode === vilkarType.OPPTJENINGSVILKARET)
    && vilkar.some((v) => v.vilkarType.kode === vilkarType.MEDLEMSKAPSVILKARET && v.vilkarStatus.kode === vilkarUtfallType.OPPFYLT),
  getData: () => ({}),
}, {
  urlCode: faktaPanelCodes.BEREGNING,
  textCode: 'BeregningInfoPanel.Title',
  aksjonspunkterCodes: [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN, aksjonspunktCodes.AVKLAR_AKTIVITETER,
    aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSAKTIVITETER, aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSGRUNNLAG],
  endpoints: [],
  renderComponent: (props) => <BeregningFaktaIndex {...props} />,
  showComponent: ({ beregningsgrunnlag }) => beregningsgrunnlag,
  getData: ({ rettigheter, beregningsgrunnlag }) => ({ erOverstyrer: rettigheter.kanOverstyreAccess.isEnabled, beregningsgrunnlag }),
}];

export default faktaPanelDefinisjoner;
