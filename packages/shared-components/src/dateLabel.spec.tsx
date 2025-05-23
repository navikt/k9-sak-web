import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { format } from 'date-fns';

import DateLabel from './DateLabel';

describe('<DateLabel>', () => {
  it('skal ha en FormattedDate-komponent', async () => {
    render(<DateLabel dateString="2017-10-10" />);
    await waitFor(() => expect(screen.queryByText('10.10.2017')).toBeInTheDocument());
  });

  it('skal sjekke at dato blir formatert korrekt', async () => {
    render(<DateLabel dateString="2017-10-10" />);
    await waitFor(() => expect(screen.queryByText(format(new Date('10.10.2017'), 'dd.MM.yyyy'))).toBeInTheDocument());
  });
});
