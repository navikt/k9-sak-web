import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../i18n/nb_NO.json';
import SupportMenySakIndex from './SupportMenySakIndex';
import SupportTabs from './supportTabs';

describe('<SupportMenySakIndex>', () => {
  it('skal lage tabs og sette Send melding som valgt', () => {
    const { container } = renderWithIntl(
      <SupportMenySakIndex
        tilgjengeligeTabs={[SupportTabs.HISTORIKK, SupportTabs.MELDINGER, SupportTabs.DOKUMENTER]}
        valgbareTabs={[SupportTabs.HISTORIKK, SupportTabs.MELDINGER, SupportTabs.DOKUMENTER]}
        valgtIndex={1}
        onClick={() => undefined}
        antallUlesteNotater={0}
      />,
      { messages },
    );
    expect(screen.getByLabelText('Historikk')).toBeInTheDocument();
    expect(screen.getByLabelText('Send melding')).toBeInTheDocument();
    expect(screen.getByLabelText('Send melding')).toHaveClass('active');
    expect(screen.getByLabelText('Dokumenter')).toBeInTheDocument();
  });

  it('skal lage tabs og sette Send Melding til disablet', () => {
    renderWithIntl(
      <SupportMenySakIndex
        tilgjengeligeTabs={[SupportTabs.HISTORIKK, SupportTabs.MELDINGER]}
        valgbareTabs={[SupportTabs.HISTORIKK]}
        onClick={() => undefined}
        antallUlesteNotater={0}
      />,
      { messages },
    );
    expect(screen.getByLabelText('Send melding')).toBeInTheDocument();
    expect(screen.getByLabelText('Send melding')).toBeDisabled();
  });
});
