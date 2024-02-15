import { inputMock, metaMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { screen } from '@testing-library/react';
import React from 'react';

import { renderWithIntl } from '@fpsak-frontend/utils-test/src/test-utils';
import { Input } from 'nav-frontend-skjema';
import renderNavField from './renderNavField';

const RenderedMockField = renderNavField(Input);

const FORMATTED_MESSAGE = 'En formatert melding';

describe('renderNavField', () => {
  it('skal ikke vise feil i utgangspunktet', () => {
    const meta = { ...metaMock, submitFailed: false, error: [{ id: 'feil1' }] };

    renderWithIntl(<RenderedMockField input={inputMock} meta={meta} />, {
      messages: {
        feil1: FORMATTED_MESSAGE,
      },
    });
    expect(screen.queryByText(FORMATTED_MESSAGE)).not.toBeInTheDocument();
  });

  it('skal vise feil hvis submit har feilet', () => {
    const meta = { ...metaMock, submitFailed: true, error: [{ id: 'feil1' }] };

    renderWithIntl(<RenderedMockField input={inputMock} meta={meta} />, {
      messages: {
        feil1: FORMATTED_MESSAGE,
      },
    });
    expect(screen.getByText(FORMATTED_MESSAGE)).toBeInTheDocument();
  });
});
