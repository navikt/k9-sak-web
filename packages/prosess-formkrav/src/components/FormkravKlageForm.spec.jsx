import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import behandlingType from '@k9-sak-web/kodeverk/src/behandlingType';
import kodeverkTyper from '@k9-sak-web/kodeverk/src/kodeverkTyper';
import { renderWithIntlAndReduxForm } from '@k9-sak-web/utils-test/test-utils';
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
      type: {
        kode: behandlingType.FORSTEGANGSSOKNAD,
        kodeverk: 'BEHANDLING_TYPE',
      },
      avsluttet: '2018-10-25T14:14:15',
    },
    {
      id: 2,
      uuid: '2uuid',
      type: {
        kode: behandlingType.REVURDERING,
        kodeverk: 'BEHANDLING_TYPE',
      },
      avsluttet: '2018-10-25T14:14:15',
    },
    {
      id: 3,
      uuid: '3uuid',
      type: {
        kode: behandlingType.TILBAKEKREVING,
        kodeverk: 'BEHANDLING_TYPE',
      },
      avsluttet: '2020-02-06T14:14:15',
    },
  ];

  it('skal vise tre options når to mulige klagbare vedtak', () => {
    renderWithIntlAndReduxForm(
      <FormkravKlageForm
        behandlingId={1}
        behandlingVersjon={1}
        readOnly={false}
        readOnlySubmitButton
        aksjonspunktCode={aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_NFP}
        avsluttedeBehandlinger={behandlinger}
        intl={intlMock}
        formProps={{ form: 'lol' }}
        alleKodeverk={{
          [kodeverkTyper.BEHANDLING_TYPE]: [
            {
              kode: behandlingType.FORSTEGANGSSOKNAD,
              navn: 'Førstegangssøknad',
              kodeverk: 'BEHANDLING_TYPE',
            },
            {
              kode: behandlingType.REVURDERING,
              navn: 'Revurdering',
              kodeverk: 'BEHANDLING_TYPE',
            },
            {
              kode: behandlingType.TILBAKEKREVING,
              navn: 'Tilbakekreving',
              kodeverk: 'BEHANDLING_TYPE',
            },
          ],
        }}
        fagsakPerson={{}}
        arbeidsgiverOpplysningerPerId={{}}
        parterMedKlagerett={[]}
      />,
      { messages },
    );

    expect(screen.getByRole('combobox', { name: 'Vedtaket som er påklagd' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Ikke påklagd et vedtak' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Førstegangssøknad 25.10.2018' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Revurdering 25.10.2018' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Tilbakekreving 06.02.2020' })).toBeInTheDocument();
  });
});
