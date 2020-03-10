import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';
import shallowWithIntl from '../../i18n/intl-enzyme-test-helper-fakta-medisinsk-vilkar';
import DiagnosekodeSelector from './DiagnosekodeSelector';
import KontinuerligTilsynOgPleie from './KontinuerligTilsynOgPleie';
import Legeerklaering from './Legeerklaering';
import { MedisinskVilkarForm } from './MedisinskVilkarForm';
import MedisinskVilkarFormButtons from './MedisinskVilkarFormButtons';

const aksjonspunkter = [
  {
    definisjon: { kode: '9001', kodeverk: 'AKSJONSPUNKT_DEF' },
    status: { kode: 'UTFO', kodeverk: 'AKSJONSPUNKT_STATUS' },
    begrunnelse: 'placeholder',
    vilkarType: { kode: 'PSB_VK_2_a', kodeverk: 'VILKAR_TYPE' },
    toTrinnsBehandling: true,
    toTrinnsBehandlingGodkjent: null,
    vurderPaNyttArsaker: null,
    besluttersBegrunnelse: null,
    aksjonspunktType: { kode: 'MANU', kodeverk: 'AKSJONSPUNKT_TYPE' },
    kanLoses: true,
    erAktivt: true,
    fristTid: null,
  },
];

describe('<MedisinskVilkarForm>', () => {
  it('skal rendre form', () => {
    const wrapper = shallowWithIntl(
      <MedisinskVilkarForm
        {...reduxFormPropsMock}
        behandlingId={1}
        behandlingVersjon={1}
        readOnly={false}
        submitCallback={sinon.spy()}
        hasOpenAksjonspunkter
        submittable
        intl={intlMock}
        harDiagnose
        erInnlagt
        toOmsorgspersoner
        sykdom={{ periodeTilVurdering: {} }}
        aksjonspunkter={aksjonspunkter}
      />,
    );
    expect(wrapper.find(KontinuerligTilsynOgPleie)).has.length(1);
    expect(wrapper.find(DiagnosekodeSelector)).has.length(1);
    expect(wrapper.find(Legeerklaering)).has.length(1);
    expect(wrapper.find(MedisinskVilkarFormButtons)).has.length(1);
  });
});
