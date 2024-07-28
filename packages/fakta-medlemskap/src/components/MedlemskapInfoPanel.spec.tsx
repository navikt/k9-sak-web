import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../i18n/nb_NO.json';
import MedlemskapInfoPanel from './MedlemskapInfoPanel';

const fagsakPerson = {
  alder: 30,
  personstatusType: { kode: personstatusType.BOSATT, kodeverk: 'test' },
  erDod: false,
  erKvinne: true,
  navn: 'Espen Utvikler',
  personnummer: '12345',
};

describe('<MedlemskapInfoPanel>', () => {
  it('skal vise begge medlemskapsformer når aksjonspunkt for startdato for foreldrepengerperioden er avklart', () => {
    renderWithIntlAndReduxForm(
      <MedlemskapInfoPanel
        aksjonspunkter={[]}
        submittable
        readOnly
        submitCallback={vi.fn()}
        alleMerknaderFraBeslutter={{ notAccepted: false }}
        behandlingId={1}
        behandlingVersjon={1}
        behandlingType={{
          kode: 'Test',
          kodeverk: 'test',
        }}
        alleKodeverk={{}}
        medlemskap={{ fom: '', medlemskapPerioder: [], perioder: [] }}
        fagsakPerson={fagsakPerson}
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
        alleMerknaderFraBeslutter={{ notAccepted: false }}
        behandlingId={1}
        behandlingVersjon={1}
        behandlingType={{
          kode: 'test',
          kodeverk: 'test',
        }}
        alleKodeverk={{}}
        medlemskap={{ fom: '', medlemskapPerioder: [], perioder: [] }}
        fagsakPerson={fagsakPerson}
      />,
      { messages },
    );

    expect(screen.getByTestId('OppholdInntektOgPerioderForm')).toBeInTheDocument();
  });
});
