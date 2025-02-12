import { messages } from '@fpsak-frontend/utils-test/intl-test-helper';
import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import ReadOnlyField from './ReadOnlyField';

describe('ReadOnlyField', () => {
  it('skal vise feltverdi', () => {
    renderWithIntl(<ReadOnlyField label="Dette er en test" input={{ value: '123' }} isEdited={false} />, { messages });

    expect(screen.getByText('Dette er en test')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
  });

  it('skal vise feltverdi som editert', () => {
    renderWithIntl(<ReadOnlyField label="Dette er en test" input={{ value: '123' }} isEdited />, { messages });

    expect(screen.getByText('Saksbehandler har endret feltets verdi')).toBeInTheDocument();
  });

  it('skal ikke vise label når verdi er tom', () => {
    const { container } = renderWithIntl(
      <ReadOnlyField label="Dette er en test" input={{ value: '' }} isEdited={false} />,
      { messages },
    );
    expect(container).toBeEmptyDOMElement();
  });
});
