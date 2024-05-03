import { renderWithIntl } from '@k9-sak-web/utils-test/test-utils';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { intlMock } from '../i18n/index';
import messages from '../i18n/nb_NO.json';
import { ErrorMessagePanel } from './ErrorMessagePanel';

describe('<ErrorMessagePanel>', () => {
  it('skal vise feilmelding uten lenke for å vise detaljert info', () => {
    renderWithIntl(
      <ErrorMessagePanel
        intl={intlMock}
        errorMessages={[
          {
            message: 'Error!',
            additionalInfo: undefined,
          },
        ]}
        removeErrorMessage={() => undefined}
      />,
      { messages },
    );

    expect(screen.getByText('Error!')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('skal erstatte spesialtegn i feilmelding', () => {
    renderWithIntl(
      <ErrorMessagePanel
        intl={intlMock}
        errorMessages={[
          {
            message: 'Høna &amp; egget og &#34;test1&#34; og &#39;test2&#39;',
            additionalInfo: undefined,
          },
        ]}
        removeErrorMessage={() => undefined}
      />,
      { messages },
    );

    expect(screen.getByText('Høna & egget og "test1" og \'test2\'')).toBeInTheDocument();
  });

  it('skal vise lenke for å se feildetaljer når dette er konfigurert og en har info', () => {
    renderWithIntl(
      <ErrorMessagePanel
        intl={intlMock}
        errorMessages={[
          {
            message: 'Høna &amp; egget og &#34;test1&#34; og &#39;test2&#39;',
            additionalInfo: {
              feilmelding: 'Dette er ein feilmelding',
              url: 'www.test.no',
            },
          },
        ]}
        removeErrorMessage={() => undefined}
      />,
      { messages },
    );

    expect(screen.getByRole('link', { name: 'Detaljert informasjon' })).toBeInTheDocument();
  });

  it('skal åpne, og så lukke, modal for visning av feildetaljer ved klikk på lenke', async () => {
    renderWithIntl(
      <ErrorMessagePanel
        intl={intlMock}
        errorMessages={[
          {
            message: 'Høna &amp; egget og &#34;test1&#34; og &#39;test2&#39;',
            additionalInfo: {
              feilmelding: 'Dette er ein feilmelding',
              url: 'www.test.no',
            },
          },
        ]}
        removeErrorMessage={() => undefined}
      />,
      { messages },
    );

    expect(screen.getByRole('link', { name: 'Detaljert informasjon' })).toBeInTheDocument();
    expect(screen.queryByText('Dette er ein feilmelding')).not.toBeInTheDocument();
    expect(screen.queryByText('Url')).not.toBeInTheDocument();
    expect(screen.queryByText('www.test.no')).not.toBeInTheDocument();
    await act(async () => {
      await userEvent.click(screen.getByRole('link', { name: 'Detaljert informasjon' }));
    });
    expect(screen.getByText('Dette er ein feilmelding')).toBeInTheDocument();
    expect(screen.getByText('Url:')).toBeInTheDocument();
    expect(screen.getByText('www.test.no')).toBeInTheDocument();
    await act(async () => {
      await userEvent.click(screen.getAllByRole('button', { name: 'Lukk' })[1]);
    });
    expect(screen.queryByText('Dette er ein feilmelding')).not.toBeInTheDocument();
    expect(screen.queryByText('Url')).not.toBeInTheDocument();
    expect(screen.queryByText('www.test.no')).not.toBeInTheDocument();
  });
});
