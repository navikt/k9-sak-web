import * as ftUtils from '@navikt/ft-utils';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PeriodesplittModal } from './PeriodesplittModal.js';

vi.mock('@navikt/ft-utils', async importOriginal => {
  const actual = await importOriginal<typeof ftUtils>();
  return { ...actual, calcDays: vi.fn(actual.calcDays) };
});

const renderModal = (tom = '2023-04-07') => {
  const forhåndsvisPeriodesplitt = vi.fn(() => []);
  const utførPeriodesplitt = vi.fn();
  const lukkModal = vi.fn();
  render(
    <PeriodesplittModal
      fields={[{ fom: '2023-04-03', tom, inntektsforhold: [] }]}
      forhåndsvisPeriodesplitt={forhåndsvisPeriodesplitt}
      utførPeriodesplitt={utførPeriodesplitt}
      skalViseModal
      lukkModal={lukkModal}
    />,
  );
  return { forhåndsvisPeriodesplitt, utførPeriodesplitt, lukkModal };
};

afterEach(() => {
  cleanup();
  vi.mocked(ftUtils.calcDays).mockReset();
});

describe('PeriodesplittModal', () => {
  it.each([undefined, 0, 1])('skal hindre oppdeling når antall virkedager er %s', async days => {
    const calcDays = vi.mocked(ftUtils.calcDays).mockReturnValue(days);
    const user = userEvent.setup();
    const { forhåndsvisPeriodesplitt, utførPeriodesplitt, lukkModal } = renderModal();

    await user.selectOptions(screen.getByLabelText('Hvilken periode ønsker du å dele opp?'), '2023-04-03');

    expect(calcDays).toHaveBeenCalledWith('2023-04-03', '2023-04-07', true);
    expect(screen.queryByLabelText('Opprett ny vurdering fra')).not.toBeInTheDocument();
    const delOppKnapp = screen.getByRole('button', { name: 'Del opp periode' });
    expect(delOppKnapp).toBeDisabled();
    await user.click(delOppKnapp);
    expect(forhåndsvisPeriodesplitt).not.toHaveBeenCalled();
    expect(utførPeriodesplitt).not.toHaveBeenCalled();
    expect(lukkModal).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Avbryt' }));
    expect(lukkModal).toHaveBeenCalledOnce();
  });

  it('skal tillate oppdeling med to virkedager og en valgt dato', async () => {
    const user = userEvent.setup();
    const { forhåndsvisPeriodesplitt, utførPeriodesplitt, lukkModal } = renderModal('2023-04-04');

    await user.selectOptions(screen.getByLabelText('Hvilken periode ønsker du å dele opp?'), '2023-04-03');
    const delOppKnapp = screen.getByRole('button', { name: 'Del opp periode' });
    expect(delOppKnapp).toBeDisabled();
    await user.type(screen.getByLabelText('Opprett ny vurdering fra'), '04.04.2023');
    await user.tab();

    expect(forhåndsvisPeriodesplitt).toHaveBeenCalledWith('2023-04-04');
    expect(delOppKnapp).toBeEnabled();
    await user.click(delOppKnapp);
    expect(utførPeriodesplitt).toHaveBeenCalledExactlyOnceWith('2023-04-04');
    expect(lukkModal).toHaveBeenCalledOnce();
  });

  it('skal tillate datovalg for en periode med tidenes ende uten å beregne virkedager', async () => {
    const calcDays = vi.mocked(ftUtils.calcDays).mockReturnValue(undefined);
    const user = userEvent.setup();
    renderModal(ftUtils.TIDENES_ENDE);

    await user.selectOptions(screen.getByLabelText('Hvilken periode ønsker du å dele opp?'), '2023-04-03');

    expect(calcDays).not.toHaveBeenCalled();
    expect(screen.getByLabelText('Opprett ny vurdering fra')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Del opp periode' })).toBeDisabled();
  });
});
