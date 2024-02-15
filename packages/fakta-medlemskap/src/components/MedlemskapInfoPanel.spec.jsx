import React from 'react';

import sinon from 'sinon';

import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';

import shallowWithIntl, { intlMock } from '../../i18n';
import MedlemskapInfoPanel from './MedlemskapInfoPanel';
import OppholdInntektOgPerioderForm from './oppholdInntektOgPerioder/OppholdInntektOgPerioderForm';

describe('<MedlemskapInfoPanel>', () => {
  it('skal vise begge medlemskapsformer når aksjonspunkt for startdato for foreldrepengerperioden er avklart', () => {
    const wrapper = shallowWithIntl(
      <MedlemskapInfoPanel
        intl={intlMock}
        aksjonspunkter={[]}
        aksjonspunkterMinusAvklarStartDato={[]}
        hasOpenAksjonspunkter={false}
        submittable
        readOnly
        submitCallback={sinon.spy()}
        alleMerknaderFraBeslutter={{}}
        behandlingId={1}
        behandlingVersjon={1}
        behandlingType={{
          kode: 'Test',
          kodeverk: 'test',
        }}
        behandlingStatus={{
          kode: behandlingStatus.BEHANDLING_UTREDES,
        }}
        soknad={{}}
        alleKodeverk={{}}
        medlemskap={{}}
        fagsakPerson={{}}
        behandlingPaaVent={false}
      />,
    );

    expect(wrapper.find(OppholdInntektOgPerioderForm)).has.length(1);
  });

  it('skal vise panel for avklaring av startdato for foreldrepengerperioden, for å tilate manuell korrigering selvom aksjonspunktet ikke finnes', () => {
    const wrapper = shallowWithIntl(
      <MedlemskapInfoPanel
        intl={intlMock}
        aksjonspunkter={[]}
        aksjonspunkterMinusAvklarStartDato={[]}
        hasOpenAksjonspunkter={false}
        submittable
        readOnly
        submitCallback={sinon.spy()}
        alleMerknaderFraBeslutter={{}}
        behandlingId={1}
        behandlingVersjon={1}
        behandlingType={{
          kode: 'test',
          kodeverk: 'test',
        }}
        behandlingStatus={{
          kode: behandlingStatus.BEHANDLING_UTREDES,
        }}
        soknad={{}}
        alleKodeverk={{}}
        medlemskap={{}}
        fagsakPerson={{}}
        behandlingPaaVent={false}
      />,
    );

    expect(wrapper.find(OppholdInntektOgPerioderForm)).has.length(1);
  });
});
