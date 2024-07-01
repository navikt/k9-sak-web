import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { KodeverkProvider } from '@k9-sak-web/gui/kodeverk/index.js';
import alleKodeverkV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import { intlMock } from '../../i18n';
import messages from '../../i18n/nb_NO.json';
import { FormkravKlageForm } from './FormkravKlageForm';

describe('<FormkravKlageForm>', () => {
  const behandlinger = [
    {
      id: 1,
      uuid: '1uuid',
      type: behandlingType.FORSTEGANGSSOKNAD,
      avsluttet: '2018-10-25T14:14:15',
    },
    {
      id: 2,
      uuid: '2uuid',
      type: behandlingType.REVURDERING,
      avsluttet: '2018-10-25T14:14:15',
    },
    {
      id: 3,
      uuid: '3uuid',
      type: behandlingType.TILBAKEKREVING,
      avsluttet: '2020-02-06T14:14:15',
    },
  ];

  it('skal vise tre options når to mulige klagbare vedtak', () => {
    renderWithIntlAndReduxForm(
      <KodeverkProvider
        behandlingType={behandlingType.FORSTEGANGSSOKNAD}
        kodeverk={alleKodeverkV2}
        klageKodeverk={{}}
        tilbakeKodeverk={{}}
      >
        <FormkravKlageForm
          behandlingId={1}
          behandlingVersjon={1}
          readOnly={false}
          readOnlySubmitButton
          aksjonspunktCode={aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_NFP}
          avsluttedeBehandlinger={behandlinger}
          intl={intlMock}
          formProps={{ form: 'lol' }}
          fagsakPerson={{}}
          arbeidsgiverOpplysningerPerId={{}}
          parterMedKlagerett={[]}
        />
      </KodeverkProvider>,
      { messages },
    );

    expect(screen.getByRole('combobox', { name: 'Vedtaket som er påklagd' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Ikke påklagd et vedtak' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Førstegangsbehandling 25.10.2018' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Revurdering 25.10.2018' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Tilbakekreving 06.02.2020' })).toBeInTheDocument();
  });
});
