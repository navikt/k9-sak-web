import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { intlMock } from '@fpsak-frontend/utils-test/intl-test-helper';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../i18n/nb_NO.json';
import MedlemskapInfoPanel from './MedlemskapInfoPanel';

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
        submitCallback={vi.fn()}
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
        submitCallback={vi.fn()}
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
      { messages },
    );

    expect(screen.getByTestId('OppholdInntektOgPerioderForm')).toBeInTheDocument();
  });
});
