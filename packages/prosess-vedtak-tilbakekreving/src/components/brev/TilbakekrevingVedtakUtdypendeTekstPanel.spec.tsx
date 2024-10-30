import { renderWithIntl, renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import { intlMock } from '../../../i18n';
import messages from '../../../i18n/nb_NO.json';
import { TilbakekrevingVedtakUtdypendeTekstPanel } from './TilbakekrevingVedtakUtdypendeTekstPanel';
import { K9sakApiKeys, requestApi } from '@k9-sak-web/sak-app/src/data/k9sakApi';

describe('<TilbakekrevingVedtakUtdypendeTekstPanel>', () => {
  beforeEach(() => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, [{ key: 'UTVIDET_VARSELTEKST', value: true }]);
  });

  it('skal vise lenke for å skrive inn tekst når felt ikke har verdi og en ikke er i readonly-modus', () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, [{ UTVIDET_VARSELTEKST: true }]);
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
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, [{ UTVIDET_VARSELTEKST: true }]);
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
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, [{ UTVIDET_VARSELTEKST: true }]);
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
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, [{ UTVIDET_VARSELTEKST: true }]);
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
