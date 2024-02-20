import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { intlWithMessages } from "@fpsak-frontend/utils-test/intl-enzyme-test-helper";
import messages from '../../../../i18n/nb_NO.json';
import BubbleText from './bubbleText';


const intlMock = intlWithMessages(messages);

describe('<BubbleText>', () => {
  it('skal kun vise en del av teksten om cutoffpointen vi sender er mindre en tekstens lengde', () => {
    const bodyText = 'My bodytekst is the only thing that keeps me awake at night';
    const cutOffLength = 10;
    renderWithIntl(<BubbleText bodyText={bodyText} cutOffLength={cutOffLength} />, { messages });
    expect(screen.getByText('My body...')).toBeInTheDocument();
  });

  it('skal vise chevron ned om teksten er cutoff', () => {
    const bodyText = 'My bodytekst is the only thing that keeps me awake at night';
    const cutOffLength = 10;
    renderWithIntl(<BubbleText bodyText={bodyText} cutOffLength={cutOffLength} />, { messages });
    expect(screen.getByRole('button', { name: 'Åpne tekstfelt' })).toBeInTheDocument();
  });

  it('skal vise chevron opp om man klikker på chevron', async () => {
    const bodyText = 'My bodytekst is the only thing that keeps me awake at night';
    const cutOffLength = 10;
    renderWithIntl(<BubbleText.WrappedComponent intl={intlMock} bodyText={bodyText} cutOffLength={cutOffLength} />, {
      messages,
    });
    expect(screen.getByRole('button', { name: 'Åpne tekstfelt', expanded: false })).toBeInTheDocument();
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Åpne tekstfelt' }));
    });
    expect(screen.getByRole('button', { name: 'Lukke tekstfelt', expanded: true })).toBeInTheDocument();
  });

  it('skal vise hele teksten om cutoffpointen vi sender er størren en teksten', () => {
    const bodyText = 'My bodytekst is the only thing tha keeps me awake at night';
    const cutOffLength = 60;
    renderWithIntl(<BubbleText.WrappedComponent intl={intlMock} bodyText={bodyText} cutOffLength={cutOffLength} />, {
      messages,
    });
    expect(screen.getByText('My bodytekst is the only thing tha keeps me awake at night')).toBeInTheDocument();
  });
});
