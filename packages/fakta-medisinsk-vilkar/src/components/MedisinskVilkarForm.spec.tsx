import React from 'react';
import sinon from 'sinon';

import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { Sykdom } from '@k9-sak-web/types';
import { Periode } from '@k9-sak-web/types/src/medisinsk-vilkår/MedisinskVilkår';

import shallowWithIntl, { intlMock } from '../../i18n';
import DiagnosekodeSelector from './DiagnosekodeSelector';
import KontinuerligTilsynOgPleie from './KontinuerligTilsynOgPleie';
import Legeerklaering from './Legeerklaering';
import { MedisinskVilkarFormImpl as MedisinskVilkarForm } from './MedisinskVilkarForm';
import MedisinskVilkarFormButtons from './MedisinskVilkarFormButtons';

const aksjonspunkter = [
  {
    definisjon: '9001',
    status: 'UTFO',
    begrunnelse: 'placeholder',
    vilkarType: 'PSB_VK_2_a',
    toTrinnsBehandling: true,
    toTrinnsBehandlingGodkjent: null,
    vurderPaNyttArsaker: null,
    besluttersBegrunnelse: null,
    aksjonspunktType: 'MANU',
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
        submittable
        intl={intlMock}
        harDiagnose
        sykdom={{ periodeTilVurdering: { fom: '2019-01-01', tom: '2020-01-01' } } as Sykdom}
        aksjonspunkter={aksjonspunkter}
        harApneAksjonspunkter={false}
        harBehovForKontinuerligTilsynOgPleie={false}
        innleggelsesperiode={{} as Periode}
        perioderMedKontinuerligTilsynOgPleie={{}}
      />,
    );
    expect(wrapper.find(KontinuerligTilsynOgPleie)).toHaveLength(1);
    expect(wrapper.find(DiagnosekodeSelector)).toHaveLength(1);
    expect(wrapper.find(Legeerklaering)).toHaveLength(1);
    expect(wrapper.find(MedisinskVilkarFormButtons)).toHaveLength(1);
  });
});
