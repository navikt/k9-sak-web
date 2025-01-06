import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ErrorMessagePanel } from './ErrorMessagePanel';

describe('<ErrorMessagePanel>', () => {
  it('skal vise feilmelding uten lenke for å vise detaljert info', () => {
    render(
      <ErrorMessagePanel
        errorMessages={[
          {
            message: 'Error!',
            additionalInfo: undefined,
          },
        ]}
        removeErrorMessage={() => undefined}
      />,
    );

    expect(screen.getByText('Error!')).toBeInTheDocument();
    expect(screen.queryByTestId('errorDetailsLink')).not.toBeInTheDocument();
  });

  it('skal vise lenke for å se feildetaljer når dette er konfigurert og en har info', () => {
    render(
      <ErrorMessagePanel
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
    );

    expect(screen.getByTestId('errorDetailsLink')).toBeInTheDocument();
  });

  it('skal åpne, og så lukke, modal for visning av feildetaljer ved klikk på lenke', async () => {
    render(
      <ErrorMessagePanel
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
    );

    expect(screen.getByTestId('errorDetailsLink')).toBeInTheDocument();
    expect(screen.queryByText('Dette er ein feilmelding')).not.toBeInTheDocument();
    expect(screen.queryByText('Url')).not.toBeInTheDocument();
    expect(screen.queryByText('www.test.no')).not.toBeInTheDocument();
    await act(async () => {
      await userEvent.click(screen.getByTestId('errorDetailsLink'));
    });
    expect(screen.getByText('Dette er ein feilmelding')).toBeInTheDocument();
    expect(screen.getByText('Url:')).toBeInTheDocument();
    expect(screen.getByText('www.test.no')).toBeInTheDocument();
    await act(async () => {
      const element = await screen.getAllByRole('button', { name: 'Lukk' })[1];
      if (element) {
        await userEvent.click(element);
      }
    });
    expect(screen.queryByText('Dette er ein feilmelding')).not.toBeInTheDocument();
    expect(screen.queryByText('Url')).not.toBeInTheDocument();
    expect(screen.queryByText('www.test.no')).not.toBeInTheDocument();
  });
});
