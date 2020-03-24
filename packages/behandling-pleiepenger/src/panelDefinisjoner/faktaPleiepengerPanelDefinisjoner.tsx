import * as React from 'react';

import MedlemskapFaktaIndex from '@fpsak-frontend/fakta-medlemskap';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import ArbeidsforholdFaktaIndex from '@fpsak-frontend/fakta-arbeidsforhold';
import OpptjeningFaktaIndex from '@fpsak-frontend/fakta-opptjening';
import BeregningFaktaIndex from '@fpsak-frontend/fakta-beregning';
import { faktaPanelCodes } from '@fpsak-frontend/fp-felles';
import OmsorgenForFaktaIndex from '@fpsak-frontend/fakta-omsorgen-for-psb/src/OmsorgenForFaktaIndex';
import MedisinskVilkarIndex from '@fpsak-frontend/fakta-medisinsk-vilkar/src/MedisinskVilkarIndex';
import UttakFaktaIndex from '@fpsak-frontend/fakta-uttak/src/UttakFaktaIndex';
import FaktaPanelDefinisjon from '@fpsak-frontend/behandling-felles/src/types/faktaPanelDefinisjonTsType';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import pleiepengerBehandlingApi from '../data/pleiepengerBehandlingApi';

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
    urlCode: faktaPanelCodes.OMSORGEN_FOR,
    textCode: 'FaktaOmAlderOgOmsorg.header',
    aksjonspunkterCodes: [aksjonspunktCodes.OMSORGEN_FOR],
    endpoints: [pleiepengerBehandlingApi.OMSORGEN_FOR],
    renderComponent: props => <OmsorgenForFaktaIndex {...props} />,
    showComponent: ({ fagsak }) => fagsak.fagsakYtelseType.kode === fagsakYtelseType.PLEIEPENGER,
    getData: ({ personopplysninger }) => ({ personopplysninger }),
  },
  {
    urlCode: faktaPanelCodes.MEDISINSKVILKAAR,
    textCode: 'MedisinskVilkarPanel.MedisinskVilkar',
    aksjonspunkterCodes: [aksjonspunktCodes.MEDISINSK_VILKAAR],
    endpoints: [pleiepengerBehandlingApi.SYKDOM],
    renderComponent: props => <MedisinskVilkarIndex {...props} />,
    showComponent: () => true,
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
    endpoints: [pleiepengerBehandlingApi.MEDLEMSKAP],
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
    endpoints: [pleiepengerBehandlingApi.OPPTJENING],
    renderComponent: props => <OpptjeningFaktaIndex {...props} />,
    showComponent: ({ vilkar }) =>
      vilkar.some(v => v.vilkarType.kode === vilkarType.OPPTJENINGSVILKARET) &&
      vilkar.some(
        v => v.vilkarType.kode === vilkarType.MEDISINSKVILKARET && v.vilkarStatus.kode === vilkarUtfallType.OPPFYLT,
      ),
    getData: () => ({}),
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
    showComponent: ({ beregningsgrunnlag }) => beregningsgrunnlag,
    getData: ({ rettigheter, beregningsgrunnlag }) => ({
      erOverstyrer: rettigheter.kanOverstyreAccess.isEnabled,
      beregningsgrunnlag,
    }),
  },
  {
    urlCode: faktaPanelCodes.UTTAK,
    textCode: 'UttakInfoPanel.FaktaUttak',
    aksjonspunkterCodes: [],
    endpoints: [],
    renderComponent: props => <UttakFaktaIndex {...props} />,
    showComponent: ({ personopplysninger }) => !!personopplysninger,
    getData: ({ personopplysninger }) => ({
      personopplysninger,
      arbeidDto: [
        {
          arbeidsforhold: {
            aktørId: null,
            arbeidsforholdId: '123456',
            organisasjonsnummer: '999999999',
            type: 'Arbeidsgiver',
          },
          perioder: {
            '2020-01-01/2020-02-01': {
              jobberNormaltPerUke: 'PT37H30M',
              skalJobbeProsent: '80',
            },
          },
        },
      ],
    }),
  },
];

export default faktaPanelDefinisjoner;
