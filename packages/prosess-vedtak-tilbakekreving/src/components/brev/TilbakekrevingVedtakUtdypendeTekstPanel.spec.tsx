import { renderWithIntl, renderWithIntlAndReduxForm } from '@k9-sak-web/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import { intlMock } from '../../../i18n';
import messages from '../../../i18n/nb_NO.json';
import { TilbakekrevingVedtakUtdypendeTekstPanel } from './TilbakekrevingVedtakUtdypendeTekstPanel';

describe('<TilbakekrevingVedtakUtdypendeTekstPanel>', () => {
  it('skal vise lenke for å skrive inn tekst når felt ikke har verdi og en ikke er i readonly-modus', () => {
    renderWithIntl(
      <TilbakekrevingVedtakUtdypendeTekstPanel
        intl={intlMock}
        isEmpty
        type="OPPSUMMERING"
        readOnly={false}
        fritekstPakrevet={false}
      />,
      { messages },
    );

    expect(screen.getByRole('button', { name: /Legg til utdypende tekst/g })).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('skal vise textarea når en har trykket på lenke', () => {
    renderWithIntlAndReduxForm(
      <TilbakekrevingVedtakUtdypendeTekstPanel
        intl={intlMock}
        isEmpty={false}
        type="OPPSUMMERING"
        readOnly={false}
        fritekstPakrevet={false}
      />,
      { messages },
    );

    expect(screen.queryByRole('button', { name: /Legg til utdypende tekst/g })).not.toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('skal vise textarea når fritekst er påkrevet', () => {
    renderWithIntlAndReduxForm(
      <TilbakekrevingVedtakUtdypendeTekstPanel
        intl={intlMock}
        isEmpty
        type="OPPSUMMERING"
        readOnly={false}
        fritekstPakrevet
      />,
      { messages },
    );

    expect(screen.queryByRole('button', { name: /Legg til utdypende tekst/g })).not.toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('skal ikke vise lenke eller textarea når verdi ikke finnes og en er i readonly-modus', () => {
    renderWithIntl(
      <TilbakekrevingVedtakUtdypendeTekstPanel
        intl={intlMock}
        isEmpty
        type="OPPSUMMERING"
        readOnly
        fritekstPakrevet={false}
      />,
      { messages },
    );

    expect(screen.queryByRole('button', { name: /Legg til utdypende tekst/g })).not.toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });
});
