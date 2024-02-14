import { renderWithIntl } from '@fpsak-frontend/utils-test';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import messages from '../../i18n/nb_NO.json';
import VedtakDocuments from './VedtakDocuments';

describe('<VedtakDocuments>', () => {
  it('skal kun vise lenke for å vise dokumentliste', () => {
    const vedtaksdokumenter = [
      {
        dokumentId: '1',
        tittel: 'test',
        opprettetDato: '2017-08-31',
      },
    ];

    renderWithIntl(
      <VedtakDocuments behandlingTypes={[{ kode: 'test', navn: 'navnTest' }]} vedtaksdokumenter={vedtaksdokumenter} />,
      { messages },
    );

    expect(screen.getByRole('link', { name: 'Vedtaksdokumentasjon på saken (1)' })).toBeInTheDocument();
  });

  it('skal vise dokumentlisten etter at lenke er trykket', async () => {
    const vedtaksdokumenter = [
      {
        dokumentId: '1',
        tittel: 'test',
        opprettetDato: '2017-08-31',
      },
    ];

    renderWithIntl(
      <VedtakDocuments behandlingTypes={[{ kode: 'test', navn: 'navnTest' }]} vedtaksdokumenter={vedtaksdokumenter} />,
      { messages },
    );

    await act(async () => {
      await userEvent.click(screen.getByRole('link', { name: 'Vedtaksdokumentasjon på saken (1)' }));
    });

    expect(screen.getByRole('link', { name: 'navnTest' })).toBeInTheDocument();
  });
});
