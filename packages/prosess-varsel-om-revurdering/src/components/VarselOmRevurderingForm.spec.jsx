import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/redux-form-test-helper';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';

import React from 'react';
import { intlMock } from '../../i18n';
import messages from '../../i18n/nb_NO.json';
import { VarselOmRevurderingFormImpl as UnwrappedForm } from './VarselOmRevurderingForm';

const soknad = {
  fodselsdatoer: { 1: '2019-01-10' },
  termindato: '2019-01-01',
  utstedtdato: '2019-01-02',
  antallBarn: 1,
};

const originalBehandling = {
  soknad,
  familiehendelse: {
    termindato: '2019-01-01',
    fodselsdato: '2019-01-10',
    antallBarnTermin: 1,
    antallBarnFodsel: 1,
  },
};

describe('<VarselOmRevurderingFormImpl>', () => {
  it('skal vise fritekst og forhåndsvis av brev når varsel skal sendes', () => {
    renderWithIntlAndReduxForm(
      <UnwrappedForm
        {...reduxFormPropsMock}
        intl={intlMock}
        previewCallback={vi.fn()}
        dispatchSubmitFailed={vi.fn()}
        erAutomatiskRevurdering={false}
        languageCode="NN"
        readOnly={false}
        sendVarsel
        frist="2017-05-15"
        aksjonspunktStatus="OPPR"
        begrunnelse="Begrunnelse"
        avklartBarn={[]}
        behandlingTypeKode={behandlingType.FORSTEGANGSSOKNAD}
        soknad={soknad}
        termindato="2019-01-01"
        soknadOriginalBehandling={originalBehandling.soknad}
        familiehendelseOriginalBehandling={originalBehandling.familiehendelse}
        vedtaksDatoSomSvangerskapsuke="2019-01-01"
      />,
      { messages },
    );

    expect(screen.getByRole('textbox', { name: 'Begrunnelse' })).toBeInTheDocument();
    expect(screen.getByTestId('previewLink')).toBeInTheDocument();
  });

  it('skal ikke vise fritekst og forhåndsvis av brev når varsel ikke skal sendes', () => {
    renderWithIntlAndReduxForm(
      <UnwrappedForm
        {...reduxFormPropsMock}
        intl={intlMock}
        previewCallback={vi.fn()}
        dispatchSubmitFailed={vi.fn()}
        erAutomatiskRevurdering={false}
        languageCode="NN"
        readOnly={false}
        sendVarsel={false}
        frist="2017-05-15"
        aksjonspunktStatus="OPPR"
        begrunnelse="Begrunnelse"
        avklartBarn={[]}
        behandlingTypeKode={behandlingType.FORSTEGANGSSOKNAD}
        soknad={soknad}
        termindato="2019-01-01"
        soknadOriginalBehandling={originalBehandling.soknad}
        familiehendelseOriginalBehandling={originalBehandling.familiehendelse}
        vedtaksDatoSomSvangerskapsuke="2019-01-01"
      />,
      { messages },
    );

    expect(screen.getByRole('textbox', { name: 'Begrunnelse' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Forhåndsvis' })).not.toBeInTheDocument();
  });

  it('skal vises i readonly visning', () => {
    const begrunnelse = 'Begrunnelse';
    renderWithIntlAndReduxForm(
      <UnwrappedForm
        {...reduxFormPropsMock}
        intl={intlMock}
        previewCallback={vi.fn()}
        dispatchSubmitFailed={vi.fn()}
        erAutomatiskRevurdering={false}
        languageCode="NN"
        readOnly={false}
        sendVarsel={false}
        frist="2017-05-15"
        aksjonspunktStatus="UTFRT"
        begrunnelse={begrunnelse}
        avklartBarn={[]}
        behandlingTypeKode={behandlingType.FORSTEGANGSSOKNAD}
        soknad={soknad}
        termindato="2019-01-01"
        soknadOriginalBehandling={originalBehandling.soknad}
        familiehendelseOriginalBehandling={originalBehandling.familiehendelse}
        vedtaksDatoSomSvangerskapsuke="2019-01-01"
      />,
      { messages },
    );

    expect(screen.getByRole('heading', { name: 'Varsel om revurdering' })).toBeInTheDocument();
    expect(screen.getAllByText('Begrunnelse').length).toBe(2);
  });
});
