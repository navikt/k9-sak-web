import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import fagsakYtelseType from '@k9-sak-web/kodeverk/src/fagsakYtelseType';
import klageVurdering from '@k9-sak-web/kodeverk/src/klageVurdering';
import { reduxFormPropsMock } from '@k9-sak-web/utils-test/redux-form-test-helper';
import { renderWithIntlAndReduxForm } from '@k9-sak-web/utils-test/test-utils';
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
    expect(screen.getByRole('link', { name: 'Lagre og forhåndsvis brev' })).toBeInTheDocument();
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
    expect(screen.queryByRole('link', { name: 'Lagre og forhåndsvis brev' })).not.toBeInTheDocument();
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
    expect(screen.queryByRole('link', { name: 'Lagre og forhåndsvis brev' })).not.toBeInTheDocument();
  });
});
