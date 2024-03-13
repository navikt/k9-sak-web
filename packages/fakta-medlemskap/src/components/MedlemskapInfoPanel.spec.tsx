import React from 'react';
import sinon from 'sinon';
import { screen } from '@testing-library/react';

import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { intlMock } from '@fpsak-frontend/utils-test/intl-test-helper';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';

import MedlemskapInfoPanel from './MedlemskapInfoPanel';

import messages from '../../i18n/nb_NO.json';

describe('<MedlemskapInfoPanel>', () => {
  it('skal vise begge medlemskapsformer når aksjonspunkt for startdato for foreldrepengerperioden er avklart', () => {
    renderWithIntlAndReduxForm(
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
        behandlingType="Test"
        behandlingStatus={behandlingStatus.BEHANDLING_UTREDES}
        soknad={{}}
        alleKodeverk={{}}
        medlemskap={{}}
        fagsakPerson={{}}
        behandlingPaaVent={false}
      />,
      { messages },
    );

    expect(screen.getByTestId('OppholdInntektOgPerioderForm')).toBeInTheDocument();
  });

  it('skal vise panel for avklaring av startdato for foreldrepengerperioden, for å tilate manuell korrigering selvom aksjonspunktet ikke finnes', () => {
    renderWithIntlAndReduxForm(
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
        behandlingType="test"
        behandlingStatus={behandlingStatus.BEHANDLING_UTREDES}
        soknad={{}}
        alleKodeverk={{}}
        medlemskap={{}}
        fagsakPerson={{}}
        behandlingPaaVent={false}
      />,
      { messages },
    );

    expect(screen.getByTestId('OppholdInntektOgPerioderForm')).toBeInTheDocument();
  });
});
