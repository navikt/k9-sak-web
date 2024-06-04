import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/redux-form-test-helper';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { Brevmaler, KodeverkMedNavn } from '@k9-sak-web/types';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType.js';
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

  const aktorer = [
    { id: '00000000', type: 'AKTØRID' },
    { id: '123456789', type: 'ORGNR' },
  ];
  const templates = {
    [dokumentMalType.INNHENT_DOK]: {
      navn: 'Innhent dokumentasjon',
      mottakere: aktorer,
      linker: [],
      støtterFritekst: true,
      støtterTittelOgFritekst: false,
      støtterTredjepartsmottaker: true,
      kode: dokumentMalType.INNHENT_DOK,
    },
    [dokumentMalType.REVURDERING_DOK]: {
      navn: 'Innhent dokumentasjon',
      mottakere: aktorer,
      linker: [],
      støtterFritekst: true,
      støtterTittelOgFritekst: false,
      støtterTredjepartsmottaker: true,
      kode: dokumentMalType.REVURDERING_DOK,
    },
    [dokumentMalType.INNOPP]: {
      navn: 'Etterlys inntektsmelding',
      mottakere: [aktorer[1]],
      linker: [],
      støtterFritekst: true,
      støtterTittelOgFritekst: false,
      støtterTredjepartsmottaker: true,
      kode: dokumentMalType.INNOPP,
    },
    [dokumentMalType.VARSEL_OM_TILBAKEKREVING]: {
      navn: 'Varsel om tilbakekreving',
      mottakere: [aktorer[1]],
      linker: [],
      støtterFritekst: true,
      støtterTittelOgFritekst: false,
      støtterTredjepartsmottaker: true,
      kode: dokumentMalType.VARSEL_OM_TILBAKEKREVING,
    },
  } satisfies Brevmaler;

  const causes = [{ kode: 'kode', navn: 'Årsak 1', kodeverk: 'kode' }];

  it('skal støtte brevmaler som array', () => {
    renderWithIntlAndReduxForm(
      <MessagesTilbakekreving
        {...mockProps}
        templates={[templates[dokumentMalType.INNHENT_DOK], templates[dokumentMalType.VARSEL_OM_TILBAKEKREVING]]}
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
