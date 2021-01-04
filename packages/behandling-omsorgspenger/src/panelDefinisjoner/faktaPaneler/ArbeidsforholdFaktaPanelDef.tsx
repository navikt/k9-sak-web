import React from 'react';

import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import ArbeidsforholdFaktaIndex from '@fpsak-frontend/fakta-arbeidsforhold';

import { FaktaPanelDef } from '@fpsak-frontend/behandling-felles';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { FeatureToggles } from '@k9-sak-web/types';
import omsorgspengerBehandlingApi from '../../data/omsorgspengerBehandlingApi';

class ArbeidsforholdFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.ARBEIDSFORHOLD;

  getTekstKode = () => 'ArbeidsforholdInfoPanel.Title';

  getAksjonspunktKoder = () => [aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD];

  getEndepunkter = (featureToggles: FeatureToggles = {}) =>
    featureToggles.ARBEIDSFORHOLD_V2
      ? [omsorgspengerBehandlingApi.ARBEIDSGIVERE, omsorgspengerBehandlingApi.ARBEIDSFORHOLD]
      : [omsorgspengerBehandlingApi.INNTEKT_ARBEID_YTELSE];

  getKomponent = props => <ArbeidsforholdFaktaIndex {...props} />;

  getOverstyrVisningAvKomponent = ({ personopplysninger }) => personopplysninger;

  getData = ({ personopplysninger }) => ({ personopplysninger });
}

export default ArbeidsforholdFaktaPanelDef;
