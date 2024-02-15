import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import klageVurdering from '@fpsak-frontend/kodeverk/src/klageVurdering';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { screen } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';
import { intlMock } from '../../../i18n';
import messages from '../../../i18n/nb_NO.json';
import { BehandleKlageFormKaImpl } from './BehandleKlageFormKa';

describe('<BehandleKlageFormKaImpl>', () => {
  const sprakkode = {
    kode: 'NO',
    navn: 'Norsk',
  };
  const formValues1 = {
    fritekstTilBrev: '123',
    klageVurdering: klageVurdering.STADFESTE_YTELSESVEDTAK,
  };

  const alleKodeverk = {
    KlageMedholdÅrsak: [
      {
        kode: 'ULIK_VURDERING',
        navn: 'Ulik skjønnsvurdering',
        kodeverk: 'KLAGE_MEDHOLD_AARSAK',
      },
      {
        kode: 'NYE_OPPLYSNINGER',
        navn: 'Nytt faktum',
        kodeverk: 'KLAGE_MEDHOLD_AARSAK',
      },
      {
        kode: 'PROSESSUELL_FEIL',
        navn: 'Saksbehandlingsfeil',
        kodeverk: 'KLAGE_MEDHOLD_AARSAK',
      },
      {
        kode: 'ULIK_REGELVERKSTOLKNING',
        navn: 'Feil lovanvendelse',
        kodeverk: 'KLAGE_MEDHOLD_AARSAK',
      },
    ],
  };

  it('skal vise lenke til forhåndsvis brev når fritekst er fylt, og klagevurdering valgt', () => {
    renderWithIntlAndReduxForm(
      <BehandleKlageFormKaImpl
        readOnly={false}
        readOnlySubmitButton
        aksjonspunktCode={aksjonspunktCodes.BEHANDLE_KLAGE_NFP}
        formValues={formValues1}
        previewCallback={sinon.spy()}
        saveKlage={sinon.spy()}
        intl={intlMock}
        formProps={{}}
        sprakkode={sprakkode}
        alleKodeverk={alleKodeverk}
        {...reduxFormPropsMock}
      />,
      { messages },
    );
    expect(screen.getByRole('link', { name: 'Lagre og forhåndsvis brev' })).toBeInTheDocument();
  });
  const formValues2 = {
    fritekstTilBrev: '123',
  };

  it('skal ikke vise lenke til forhåndsvis brev når fritekst fylt, og klagevurdering ikke valgt', () => {
    renderWithIntlAndReduxForm(
      <BehandleKlageFormKaImpl
        readOnly={false}
        readOnlySubmitButton
        formValues={formValues2}
        aksjonspunktCode={aksjonspunktCodes.BEHANDLE_KLAGE_NFP}
        previewCallback={sinon.spy()}
        saveKlage={sinon.spy()}
        intl={intlMock}
        formProps={{}}
        sprakkode={sprakkode}
        alleKodeverk={alleKodeverk}
        {...reduxFormPropsMock}
      />,
      { messages },
    );
    expect(screen.queryByRole('link', { name: 'Lagre og forhåndsvis brev' })).not.toBeInTheDocument();
  });
  const formValues3 = {
    klageVurdering: klageVurdering.STADFESTE_YTELSESVEDTAK,
  };

  it('skal ikke vise lenke til forhåndsvis brev når fritekst ikke fylt, og klagevurdering valgt', () => {
    renderWithIntlAndReduxForm(
      <BehandleKlageFormKaImpl
        readOnly={false}
        readOnlySubmitButton
        formValues={formValues3}
        aksjonspunktCode={aksjonspunktCodes.BEHANDLE_KLAGE_NFP}
        previewCallback={sinon.spy()}
        saveKlage={sinon.spy()}
        intl={intlMock}
        formProps={{}}
        sprakkode={sprakkode}
        alleKodeverk={alleKodeverk}
        {...reduxFormPropsMock}
      />,
      { messages },
    );
    expect(screen.queryByRole('link', { name: 'Lagre og forhåndsvis brev' })).not.toBeInTheDocument();
  });
});
