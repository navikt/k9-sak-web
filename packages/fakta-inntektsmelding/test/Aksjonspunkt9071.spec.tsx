/* eslint-disable react/jsx-props-no-spreading */
import { Story, composeStories } from '@storybook/react';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import React from 'react';
import { alleErMottatt, manglerInntektsmelding } from '../mock/mockedKompletthetsdata';
import * as stories from '../src/stories/MainComponent.stories';
import MainComponent from '../src/ui/MainComponent';

const server = setupServer();

describe('9071 - Mangler inntektsmelding', () => {
  beforeAll(() => {
    server.listen();
  });
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  const { Mangler9071, AlleInntektsmeldingerMottatt } = composeStories(stories) as {
    [key: string]: Story<Partial<typeof MainComponent>>;
  };

  test('Viser ikke knapp for å sende inn når beslutning ikke er valgt', async () => {
    server.use(rest.get('/tilstand', (req, res, ctx) => res(ctx.json(manglerInntektsmelding))));
    // ARRANGE
    render(<Mangler9071 />);
    await waitFor(() => screen.getByText(/Når kan du gå videre uten inntektsmelding?/i));

    // ASSERT
    expect(screen.getByLabelText(/Nei, avslå periode på grunn av manglende inntektsopplysninger/i)).toBeDefined();
    expect(screen.queryByRole('button', { name: /Fortsett uten inntektsmelding/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /Send purring med varsel om avslag/i })).toBeNull();
  });

  test('Viser riktig knapp når purring er valgt', async () => {
    server.use(rest.get('/tilstand', (req, res, ctx) => res(ctx.json(manglerInntektsmelding))));
    // ARRANGE
    render(<Mangler9071 />);
    await waitFor(() => screen.getByText(/Når kan du gå videre uten inntektsmelding?/i));

    // ACT
    await act(async () => {
      await userEvent.click(screen.getByLabelText(/Nei, avslå periode på grunn av manglende inntektsopplysninger/i));
    });

    // ASSERT
    expect(screen.queryByRole('button', { name: /Fortsett uten inntektsmelding/i })).toBeNull();
    expect(screen.getByRole('button', { name: /Avslå Periode/i })).toBeDefined();
  });

  test('Må skrive begrunnelse når man har valgt A-inntekt', async () => {
    server.use(rest.get('/tilstand', (req, res, ctx) => res(ctx.json(manglerInntektsmelding))));
    // ARRANGE
    render(<Mangler9071 />);
    await waitFor(() => screen.getByText(/Når kan du gå videre uten inntektsmelding?/i));

    // ACT
    await act(async () => {
      await userEvent.click(screen.getByText(/ja, bruk a-inntekt for sauefabrikk \(2\) og sauefabrikk \(1\)/i));
      await userEvent.click(screen.getByRole('button', { name: /Fortsett uten inntektsmelding/i }));
    });
    // ASSERT
    expect(screen.getByText('Du må fylle inn en verdi')).toBeDefined();
  });

  test('Kan sende purring med varsel om avslag', async () => {
    server.use(rest.get('/tilstand', (req, res, ctx) => res(ctx.json(manglerInntektsmelding))));
    // ARRANGE
    const onClickSpy = jest.fn();
    const data = { onFinished: onClickSpy };
    render(<Mangler9071 {...data} />);

    await waitFor(() => screen.getByText(/Når kan du gå videre uten inntektsmelding?/i));

    // ACT
    await act(async () => {
      await userEvent.click(screen.getByText(/ja, bruk a-inntekt for sauefabrikk \(2\) og sauefabrikk \(1\)/i));
      await userEvent.type(screen.getByLabelText(/Begrunnelse/i), 'Inntektsmelding? LOL! Nei takk');
      await userEvent.click(screen.getByRole('button', { name: /Fortsett uten inntektsmelding/i }));
    });

    // ASSERT
    expect(onClickSpy).toHaveBeenCalledWith({
      '@type': '9071',
      kode: '9071',
      begrunnelse: 'Inntektsmelding? LOL! Nei takk',
      perioder: [
        {
          begrunnelse: 'Inntektsmelding? LOL! Nei takk',
          periode: '2022-02-01/2022-02-16',
          fortsett: true,
          kode: '9071',
        },
      ],
    });
  });

  test('Kan submitte begrunnelse når man har valgt A-inntekt', async () => {
    server.use(rest.get('/tilstand', (req, res, ctx) => res(ctx.json(manglerInntektsmelding))));
    // ARRANGE
    const onClickSpy = jest.fn();
    const data = { onFinished: onClickSpy };
    render(<Mangler9071 {...data} />);

    await waitFor(() => screen.getByText(/Når kan du gå videre uten inntektsmelding?/i));

    // ACT
    await userEvent.click(screen.getByText(/ja, bruk a-inntekt for sauefabrikk \(2\) og sauefabrikk \(1\)/i));
    await userEvent.type(screen.getByLabelText(/Begrunnelse/i), 'Inntektsmelding? LOL! Nei takk');
    await act(() => {
      userEvent.click(screen.getByRole('button', { name: /Fortsett uten inntektsmelding/i }));
    });

    // ASSERT
    expect(onClickSpy).toHaveBeenCalledWith({
      '@type': '9071',
      kode: '9071',
      begrunnelse: 'Inntektsmelding? LOL! Nei takk',
      perioder: [
        {
          begrunnelse: 'Inntektsmelding? LOL! Nei takk',
          periode: '2022-02-01/2022-02-16',
          fortsett: true,
          kode: '9071',
        },
      ],
    });
  });
  test('Hvis det tidligere er blitt gjort en vurdering og behandlingen har hoppet tilbake må man kunne løse aksjonspunktet', async () => {
    server.use(rest.get('/tilstand', (req, res, ctx) => res(ctx.json(alleErMottatt))));
    // ARRANGE
    const onClickSpy = jest.fn();
    const data = { onFinished: onClickSpy };
    render(<AlleInntektsmeldingerMottatt {...data} />);

    await waitFor(() => screen.getByText(/Når kan du gå videre uten inntektsmelding?/i));

    // ACT
    await act(() => {
      userEvent.click(screen.getByRole('button', { name: /Send inn/i }));
    });

    // ASSERT
    expect(onClickSpy).toHaveBeenCalledWith({
      '@type': '9071',
      kode: '9071',
      perioder: [],
    });
  });
});
