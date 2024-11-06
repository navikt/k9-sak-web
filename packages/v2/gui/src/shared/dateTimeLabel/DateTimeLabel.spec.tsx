import { render } from '@testing-library/react';
import DateTimeLabel from './DateTimeLabel';

describe('DateTimeLabel', () => {
  it('should format date and time correctly with default format', () => {
    const { getByText } = render(<DateTimeLabel dateTimeString="2017-08-02T00:54:25.455" />);
    expect(getByText('02.08.2017 - 00:54')).toBeInTheDocument();
  });

  it('should format date and time correctly with new format', () => {
    const { getByText } = render(<DateTimeLabel dateTimeString="2017-08-02T00:54:25.455" useNewFormat />);
    expect(getByText('02.08.2017 Kl.00:54:25')).toBeInTheDocument();
  });

  it('should handle invalid date string gracefully', () => {
    const { getByText } = render(<DateTimeLabel dateTimeString="invalid-date" />);
    expect(getByText('Invalid Date', { exact: false })).toBeInTheDocument();
  });
});
