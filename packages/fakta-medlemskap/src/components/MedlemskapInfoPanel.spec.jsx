import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';

import MedlemskapInfoPanel from './MedlemskapInfoPanel';
import OppholdInntektOgPerioderForm from './oppholdInntektOgPerioder/OppholdInntektOgPerioderForm';
import shallowWithIntl from '../../i18n';

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
          kode: 'TEst',
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
          kode: 'TEst',
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
