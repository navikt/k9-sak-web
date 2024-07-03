import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import MedlemskapInfoPanel from './MedlemskapInfoPanel';
import messages from '../../i18n/nb_NO.json';

describe('<MedlemskapInfoPanel>', () => {
  it('skal vise begge medlemskapsformer når aksjonspunkt for startdato for foreldrepengerperioden er avklart', () => {
    renderWithIntlAndReduxForm(
      <MedlemskapInfoPanel
        aksjonspunkter={[]}
        submittable
        readOnly
        submitCallback={vi.fn()}
        alleMerknaderFraBeslutter={{}}
        behandlingId={1}
        behandlingVersjon={1}
        behandlingType="Test"
        soknad={{}}
        alleKodeverk={{}}
        medlemskap={{}}
        fagsakPerson={{}}
      />,
      { messages },
    );

    expect(screen.getByTestId('OppholdInntektOgPerioderForm')).toBeInTheDocument();
  });

  it('skal vise panel for avklaring av startdato for foreldrepengerperioden, for å tilate manuell korrigering selvom aksjonspunktet ikke finnes', () => {
    renderWithIntlAndReduxForm(
      <MedlemskapInfoPanel
        aksjonspunkter={[]}
        submittable
        readOnly
        submitCallback={vi.fn()}
        alleMerknaderFraBeslutter={{}}
        behandlingId={1}
        behandlingVersjon={1}
        behandlingType="test"
        soknad={{}}
        alleKodeverk={{}}
        medlemskap={{}}
        fagsakPerson={{}}
      />,
      { messages },
    );

    expect(screen.getByTestId('OppholdInntektOgPerioderForm')).toBeInTheDocument();
  });
});
