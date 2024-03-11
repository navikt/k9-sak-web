import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/redux-form-test-helper';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { KodeverkMedNavn } from '@k9-sak-web/types';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { intlMock } from '../../i18n/index';
import messages from '../../i18n/nb_NO.json';
import { MessagesTilbakekrevingImpl as MessagesTilbakekreving } from './MessagesTilbakekreving';

const mockProps = {
  setRecipient: () => undefined,
  setTemplate: () => undefined,
  updateModel: () => undefined,
  previewCallback: () => undefined,
  submitCallback: () => undefined,
  validateModel: () => undefined,
  isSubmitting: false,
  intl: intlMock,
  ...reduxFormPropsMock,
};

describe('<MessagesTilbakekreving>', () => {
  const sprakkode = {
    kode: 'en',
    kodeverk: 'Engelsk',
  };

  const templates = {
    INNHEN: {
      navn: 'Innhent dokumentasjon',
      mottakere: [
        {
          id: '00000000',
          type: 'AKTØRID',
        },
        {
          id: '123456789',
          type: 'ORGNR',
        },
      ],
    },
    REVURD: {
      navn: 'Innhent dokumentasjon',
      mottakere: [
        {
          id: '00000000',
          type: 'AKTØRID',
        },
        {
          id: '123456789',
          type: 'ORGNR',
        },
      ],
    },
    ETTERLYS_INNTEKTSMELDING_DOK: {
      navn: 'Etterlys inntektsmelding',
      mottakere: [
        {
          id: '123456789',
          type: 'ORGNR',
        },
      ],
    },
  };

  const causes = [{ kode: 'kode', navn: 'Årsak 1', kodeverk: 'kode' }];

  it('skal støtte brevmaler som array', () => {
    renderWithIntlAndReduxForm(
      <MessagesTilbakekreving
        {...mockProps}
        templates={[
          { kode: 'INNHEN', navn: 'Innhent dokumentasjon', tilgjengelig: true },
          { kode: 'VARS', navn: 'Varsel om tilbakekreving', tilgjengelig: true },
        ]}
        sprakKode={sprakkode}
        brevmalkode="INNHEN"
        causes={causes}
        behandlingId={1}
        behandlingVersjon={2}
        revurderingVarslingArsak={[{} as KodeverkMedNavn]}
      />,
      { messages },
    );

    expect(screen.getByRole('combobox', { name: 'Mal' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Innhent dokumentasjon' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Varsel om tilbakekreving' })).toBeInTheDocument();
  });

  it('skal vise to select-bokser', () => {
    renderWithIntlAndReduxForm(
      <MessagesTilbakekreving
        {...mockProps}
        templates={templates}
        sprakKode={sprakkode}
        brevmalkode="INNHEN"
        causes={causes}
        behandlingId={1}
        behandlingVersjon={2}
        revurderingVarslingArsak={[{} as KodeverkMedNavn]}
      />,
      { messages },
    );

    expect(screen.getByRole('combobox', { name: 'Mal' })).toBeInTheDocument();
    expect(screen.getAllByRole('option', { name: 'Innhent dokumentasjon' }).length).toBe(2);
    expect(screen.getByRole('option', { name: 'Etterlys inntektsmelding' })).toBeInTheDocument();

    expect(screen.getByRole('combobox', { name: 'Mottaker' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '00000000' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '123456789' })).toBeInTheDocument();
  });

  it('skal vise forhåndvisningslenke når fritekst er gyldig', async () => {
    const previewEventCallback = vi.fn();
    renderWithIntlAndReduxForm(
      <MessagesTilbakekreving
        {...mockProps}
        templates={templates}
        sprakKode={sprakkode}
        brevmalkode="INNHEN"
        causes={causes}
        previewCallback={previewEventCallback}
        fritekst="Dokument"
        overstyrtMottaker="Bruker"
        behandlingId={1}
        behandlingVersjon={2}
        revurderingVarslingArsak={[{} as KodeverkMedNavn]}
      />,
      { messages },
    );
    await act(async () => {
      await userEvent.click(screen.getByRole('link', { name: 'Forhåndsvis' }));
    });

    expect(previewEventCallback.mock.calls.length).toBeGreaterThan(0);
  });

  it('skal vise tre select-bokser når varsel om revurdering', () => {
    const previewEventCallback = vi.fn();
    renderWithIntlAndReduxForm(
      <MessagesTilbakekreving
        {...mockProps}
        templates={templates}
        sprakKode={sprakkode}
        brevmalkode="REVURD"
        causes={causes}
        previewCallback={previewEventCallback}
        fritekst="Dokument"
        behandlingId={1}
        behandlingVersjon={2}
        revurderingVarslingArsak={[{} as KodeverkMedNavn]}
      />,
      { messages },
    );
    expect(screen.getByRole('combobox', { name: 'Mal' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Mottaker' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Årsak' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Årsak 1' })).toBeInTheDocument();
  });
});
