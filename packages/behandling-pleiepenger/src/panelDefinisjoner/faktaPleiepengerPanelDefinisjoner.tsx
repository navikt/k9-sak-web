import * as React from 'react';

import MedlemskapFaktaIndex from '@fpsak-frontend/fakta-medlemskap';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import ArbeidsforholdFaktaIndex from '@fpsak-frontend/fakta-arbeidsforhold';
import OpptjeningFaktaIndex from '@fpsak-frontend/fakta-opptjening';
import BeregningFaktaIndex from '@fpsak-frontend/fakta-beregning';
import { faktaPanelCodes } from '@fpsak-frontend/fp-felles';
import OmsorgenForFaktaIndex from '@fpsak-frontend/fakta-omsorgen-for/src/OmsorgenForFaktaIndex';
import MedisinskVilkarIndex from '@fpsak-frontend/fakta-medisinsk-vilkar/src/MedisinskVilkarIndex';
import UttakFaktaIndex from '@fpsak-frontend/fakta-uttak/src/UttakFaktaIndex';
import FaktaPanelDefinisjon from '@fpsak-frontend/behandling-felles/src/types/faktaPanelDefinisjonTsType';

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
    aksjonspunkterCodes: [],
    endpoints: [],
    renderComponent: props => <OmsorgenForFaktaIndex {...props} />,
    showComponent: () => true,
    getData: () => ({}),
  },
  {
    urlCode: faktaPanelCodes.MEDISINSKVILKAAR,
    textCode: 'MedisinskVilkarPanel.MedisinskVilkar',
    aksjonspunkterCodes: [aksjonspunktCodes.MEDISINSK_VILKAAR],
    endpoints: [],
    renderComponent: props => <MedisinskVilkarIndex {...props} />,
    showComponent: () => true,
    getData: ({ sykdom }) => ({ sykdom }),
  },
  {
    urlCode: faktaPanelCodes.MEDLEMSKAPSVILKARET,
    textCode: 'MedlemskapInfoPanel.Medlemskap',
    aksjonspunkterCodes: [
      aksjonspunktCodes.AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN,
      aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT,
      aksjonspunktCodes.AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE,
      aksjonspunktCodes.AVKLAR_OPPHOLDSRETT,
      aksjonspunktCodes.AVKLAR_LOVLIG_OPPHOLD,
      aksjonspunktCodes.AVKLAR_FORTSATT_MEDLEMSKAP,
      aksjonspunktCodes.OVERSTYR_AVKLAR_STARTDATO,
    ],
    endpoints: [pleiepengerBehandlingApi.MEDLEMSKAP, pleiepengerBehandlingApi.MEDLEMSKAP_V2],
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
      arbeidsgivere: [
        {
          organisasjonsnummer: '905',
          navn: 'NAV',
          arbeidsforhold: [
            {
              perioder: [
                {
                  fom: '2020-02-02',
                  tom: '2020-03-02',
                  timerIJobbTilVanlig: 40,
                  timerFårJobbet: 20,
                },
                {
                  fom: '2020-04-02',
                  tom: '2020-05-02',
                  timerIJobbTilVanlig: 15,
                  timerFårJobbet: 7.5,
                },
              ],
              arbeidsgiversArbeidsforholdId: 'unik id 1',
            },
          ],
        },
      ],
    }),
  },
];

export default faktaPanelDefinisjoner;
