import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import klageVurdering from '@fpsak-frontend/kodeverk/src/klageVurdering';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test';
import { screen } from '@testing-library/react';
import React from 'react';
import { reduxForm } from 'redux-form';
import sinon from 'sinon';
import { intlMock } from '../../../i18n';
import messages from '../../../i18n/nb_NO.json';
import { KlageVurderingRadioOptionsKa } from './KlageVurderingRadioOptionsKa';

describe('<KlageVurderingRadioOptionsKaImpl>', () => {
  const sprakkode = {
    kode: 'NO',
    navn: 'Norsk',
  };
  const medholdReasons = [
    { kode: 'NYE_OPPLYSNINGER', navn: 'Nytt faktum', kodeverk: 'KLAGE_MEDHOLD_AARSAK' },
    { kode: 'ULIK_REGELVERKSTOLKNING', navn: 'Feil lovanvendelse', kodeverk: 'KLAGE_MEDHOLD_AARSAK' },
    { kode: 'ULIK_VURDERING', navn: 'Ulik skjønnsvurdering', kodeverk: 'KLAGE_MEDHOLD_AARSAK' },
    { kode: 'PROSESSUELL_FEIL', navn: 'Saksbehandlingsfeil', kodeverk: 'KLAGE_MEDHOLD_AARSAK' },
  ];

  const MockForm = reduxForm({ form: 'mock', onSubmit: vi.fn() })(({ children }) => <div>{children}</div>);

  it('skal vise fire options når klage stadfestet', () => {
    renderWithIntlAndReduxForm(
      <MockForm>
        <KlageVurderingRadioOptionsKa
          readOnly={false}
          medholdReasons={medholdReasons}
          readOnlySubmitButton
          aksjonspunktCode={aksjonspunktCodes.BEHANDLE_KLAGE_NK}
          klageVurdering={klageVurdering.STADFESTE_YTELSESVEDTAK}
          previewCallback={sinon.spy()}
          intl={intlMock}
          formProps={{}}
          sprakkode={sprakkode}
        />
      </MockForm>,
      { messages },
    );

    expect(screen.getByRole('radio', { name: 'Stadfest vedtaket' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Omgjør vedtaket' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Hjemsend vedtaket' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Opphev og hjemsend vedtaket' })).toBeInTheDocument();
  });

  it('skal vise syv options når aksjonspunkt er NK og klage medhold', () => {
    renderWithIntlAndReduxForm(
      <MockForm>
        <KlageVurderingRadioOptionsKa
          readOnly={false}
          readOnlySubmitButton
          medholdReasons={medholdReasons}
          aksjonspunktCode={aksjonspunktCodes.BEHANDLE_KLAGE_NK}
          klageMedholdArsaker={[]}
          klageVurdering={klageVurdering.MEDHOLD_I_KLAGE}
          previewCallback={sinon.spy()}
          intl={intlMock}
          formProps={{}}
          sprakkode={sprakkode}
        />
      </MockForm>,
      { messages },
    );
    expect(screen.getByRole('radio', { name: 'Stadfest vedtaket' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Omgjør vedtaket' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Hjemsend vedtaket' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Opphev og hjemsend vedtaket' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Til gunst' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Til ugunst' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Delvis omgjør, til gunst' })).toBeInTheDocument();
  });

  it('skal vise selectfield når klagevurdering er omgjort vedtak', () => {
    renderWithIntlAndReduxForm(
      <MockForm>
        <KlageVurderingRadioOptionsKa
          readOnly={false}
          readOnlySubmitButton
          medholdReasons={medholdReasons}
          aksjonspunktCode={aksjonspunktCodes.BEHANDLE_KLAGE_NK}
          klageVurdering={klageVurdering.MEDHOLD_I_KLAGE}
          previewCallback={sinon.spy()}
          intl={intlMock}
          formProps={{}}
          sprakkode={sprakkode}
        />{' '}
      </MockForm>,
      { messages },
    );

    expect(screen.getByRole('combobox', { name: 'Årsak' })).toBeInTheDocument();
  });

  it('skal ikke vise selectfield når klagevurdering er opphev vedtak', () => {
    renderWithIntlAndReduxForm(
      <MockForm>
        <KlageVurderingRadioOptionsKa
          readOnly={false}
          readOnlySubmitButton
          medholdReasons={medholdReasons}
          aksjonspunktCode={aksjonspunktCodes.BEHANDLE_KLAGE_NK}
          klageVurdering={klageVurdering.STADFESTE_YTELSESVEDTAK}
          previewCallback={sinon.spy()}
          intl={intlMock}
          formProps={{}}
          sprakkode={sprakkode}
        />
      </MockForm>,
      { messages },
    );
    expect(screen.queryByRole('combobox', { name: 'Årsak' })).not.toBeInTheDocument();
  });
});
