import FaktaPanelDefinisjon from '@fpsak-frontend/behandling-felles/src/types/faktaPanelDefinisjonTsType';
import ArbeidsforholdFaktaIndex from '@fpsak-frontend/fakta-arbeidsforhold';
import BeregningFaktaIndex from '@fpsak-frontend/fakta-beregning';
import MedlemskapFaktaIndex from '@fpsak-frontend/fakta-medlemskap';
import OpptjeningFaktaIndex from '@fpsak-frontend/fakta-opptjening-oms';
import VergeFaktaIndex from '@fpsak-frontend/fakta-verge';
import { faktaPanelCodes } from '@fpsak-frontend/fp-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import FaktaRammevedtakIndex from '@k9-sak-web/fakta-barn-og-overfoeringsdager';
import * as React from 'react';
import omsorgspengerBehandlingApi from '../data/omsorgspengerBehandlingApi';

const erAllePerioderOppfylt = vilkarsperioder =>
  vilkarsperioder.every(periode => periode.vilkarStatus.kode === vilkarUtfallType.OPPFYLT);

const shouldShowOpptjening = vilkar =>
  vilkar.some(v => v.vilkarType.kode === vilkarType.OPPTJENINGSVILKARET) &&
  vilkar.some(v => v.vilkarType.kode === vilkarType.MEDLEMSKAPSVILKARET && erAllePerioderOppfylt(v.perioder));

const faktaPanelDefinisjoner: FaktaPanelDefinisjon[] = [
  {
    urlCode: faktaPanelCodes.ARBEIDSFORHOLD,
    textCode: 'ArbeidsforholdInfoPanel.Title',
    aksjonspunkterCodes: [aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD],
    endpoints: [],
    renderComponent: props => <ArbeidsforholdFaktaIndex {...props} />,
    showComponent: ({ personopplysninger }) => personopplysninger,
    getData: ({ personopplysninger, inntektArbeidYtelse }) => ({ personopplysninger, inntektArbeidYtelse }),
  },
  {
    urlCode: faktaPanelCodes.VERGE,
    textCode: 'RegistrereVergeInfoPanel.Info',
    aksjonspunkterCodes: [aksjonspunktCodes.AVKLAR_VERGE],
    endpoints: [omsorgspengerBehandlingApi.VERGE],
    renderComponent: props => <VergeFaktaIndex {...props} />,
    showComponent: () => false,
    getData: () => ({}),
  },
  {
    urlCode: faktaPanelCodes.MEDLEMSKAPSVILKARET,
    textCode: 'MedlemskapInfoPanel.Medlemskap',
    aksjonspunkterCodes: [
      aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT,
      aksjonspunktCodes.AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE,
      aksjonspunktCodes.AVKLAR_OPPHOLDSRETT,
      aksjonspunktCodes.AVKLAR_LOVLIG_OPPHOLD,
      aksjonspunktCodes.AVKLAR_FORTSATT_MEDLEMSKAP,
      aksjonspunktCodes.OVERSTYR_AVKLAR_STARTDATO,
    ],
    endpoints: [omsorgspengerBehandlingApi.MEDLEMSKAP],
    renderComponent: props => <MedlemskapFaktaIndex {...props} />,
    showComponent: ({ personopplysninger, soknad }) => personopplysninger && soknad,
    getData: ({ fagsak, soknad, personopplysninger }) => ({
      fagsakPerson: fagsak.fagsakPerson,
      soknad,
      personopplysninger,
    }),
  },
  {
    urlCode: faktaPanelCodes.OPPTJENINGSVILKARET,
    textCode: 'OpptjeningInfoPanel.KontrollerFaktaForOpptjening',
    aksjonspunkterCodes: [aksjonspunktCodes.VURDER_PERIODER_MED_OPPTJENING],
    endpoints: [omsorgspengerBehandlingApi.OPPTJENING],
    renderComponent: props => <OpptjeningFaktaIndex {...props} />,
    showComponent: ({ vilkar }) => shouldShowOpptjening(vilkar),
    getData: () => ({}),
  },
  {
    urlCode: faktaPanelCodes.UTTAK,
    textCode: 'FaktaRammevedtak.Title',
    aksjonspunkterCodes: [],
    endpoints: [],
    renderComponent: props => <FaktaRammevedtakIndex {...props} />,
    showComponent: ({ forbrukteDager }) => !!forbrukteDager,
    getData: ({ forbrukteDager }) => ({ rammevedtak: forbrukteDager?.rammevedtak || [] }),
  },
  {
    urlCode: faktaPanelCodes.BEREGNING,
    textCode: 'BeregningInfoPanel.Title',
    aksjonspunkterCodes: [
      aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
      aksjonspunktCodes.AVKLAR_AKTIVITETER,
      aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSAKTIVITETER,
      aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSGRUNNLAG,
    ],
    endpoints: [],
    renderComponent: props => <BeregningFaktaIndex {...props} />,
    showComponent: ({ beregningsgrunnlag }) => beregningsgrunnlag && beregningsgrunnlag.length > 0,
    getData: ({ rettigheter, beregningsgrunnlag }) => ({
      erOverstyrer: rettigheter.kanOverstyreAccess.isEnabled,
      beregningsgrunnlag,
    }),
  },
];

export default faktaPanelDefinisjoner;
