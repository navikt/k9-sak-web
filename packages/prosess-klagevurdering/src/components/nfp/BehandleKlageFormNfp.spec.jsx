import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import klageVurdering from '@fpsak-frontend/kodeverk/src/klageVurdering';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/redux-form-test-helper';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';

import React from 'react';
import { intlMock } from '../../../i18n';
import messages from '../../../i18n/nb_NO.json';
import { BehandleKlageFormNfpImpl } from './BehandleKlageFormNfp';

describe('<BehandleKlageFormNfpImpl>', () => {
  const sprakkode = {
    kode: 'NO',
    navn: 'Norsk',
  };
  const formValues1 = {
    fritekstTilBrev: '123',
    klageVurdering: klageVurdering.STADFESTE_YTELSESVEDTAK,
  };

  it('skal vise lenke til forhåndsvis brev når fritekst er fylt, og klagevurdering valgt', () => {
    renderWithIntlAndReduxForm(
      <BehandleKlageFormNfpImpl
        fagsak={{ sakstype: { kode: fagsakYtelseType.OMSORGSPENGER } }}
        readOnly={false}
        readOnlySubmitButton
        aksjonspunktCode={aksjonspunktCodes.BEHANDLE_KLAGE_NFP}
        formValues={formValues1}
        previewCallback={vi.fn()}
        saveKlage={vi.fn()}
        intl={intlMock}
        formProps={{}}
        sprakkode={sprakkode}
        alleKodeverk={{}}
        {...reduxFormPropsMock}
      />,
      { messages },
    );
    expect(screen.getByTestId('previewLink')).toBeInTheDocument();
  });
  const formValues2 = {
    fritekstTilBrev: '123',
  };

  it('skal ikke vise lenke til forhåndsvis brev når fritekst fylt, og klagevurdering ikke valgt', () => {
    renderWithIntlAndReduxForm(
      <BehandleKlageFormNfpImpl
        fagsak={{ sakstype: { kode: fagsakYtelseType.OMSORGSPENGER } }}
        readOnly={false}
        readOnlySubmitButton
        formValues={formValues2}
        aksjonspunktCode={aksjonspunktCodes.BEHANDLE_KLAGE_NFP}
        previewCallback={vi.fn()}
        saveKlage={vi.fn()}
        intl={intlMock}
        formProps={{}}
        sprakkode={sprakkode}
        alleKodeverk={{}}
        {...reduxFormPropsMock}
      />,
      { messages },
    );
    expect(screen.queryByTestId('previewLink')).not.toBeInTheDocument();
  });
  const formValues3 = {
    klageVurdering: klageVurdering.STADFESTE_YTELSESVEDTAK,
  };

  it('skal ikke vise lenke til forhåndsvis brev når fritekst ikke fylt, og klagevurdering valgt', () => {
    renderWithIntlAndReduxForm(
      <BehandleKlageFormNfpImpl
        fagsak={{ sakstype: { kode: fagsakYtelseType.OMSORGSPENGER } }}
        readOnly={false}
        readOnlySubmitButton
        formValues={formValues3}
        aksjonspunktCode={aksjonspunktCodes.BEHANDLE_KLAGE_NFP}
        previewCallback={vi.fn()}
        saveKlage={vi.fn()}
        intl={intlMock}
        formProps={{}}
        sprakkode={sprakkode}
        alleKodeverk={{}}
        {...reduxFormPropsMock}
      />,
      { messages },
    );
    expect(screen.queryByTestId('previewLink')).not.toBeInTheDocument();
  });
});
