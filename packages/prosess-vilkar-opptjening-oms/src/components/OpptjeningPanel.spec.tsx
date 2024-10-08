import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '@k9-sak-web/prosess-felles/i18n/nb_NO.json';
import OpptjeningPanel from './OpptjeningPanel';

describe('<OpptjeningPanel>', () => {
  it('skal ikke vise lovreferanse når dette ikke finnes', () => {
    const { container } = renderWithIntlAndReduxForm(
      <OpptjeningPanel
        handleSubmit={vi.fn()}
        title="Fødsel"
        isAksjonspunktOpen
        formName="testnavn"
        readOnlySubmitButton={false}
        isDirty
        readOnly={false}
        behandlingId={1}
        behandlingVersjon={1}
      >
        <div>test</div>
      </OpptjeningPanel>,
      { messages },
    );

    expect(container.getElementsByClassName('vilkar').length).toBe(0);
  });

  it('skal vise lovreferanse når dette finnes', () => {
    renderWithIntlAndReduxForm(
      <OpptjeningPanel
        handleSubmit={vi.fn()}
        lovReferanse="test lovReferanse"
        title="Fødsel"
        isAksjonspunktOpen
        formName="testnavn"
        readOnlySubmitButton={false}
        isDirty
        readOnly={false}
        behandlingId={1}
        behandlingVersjon={1}
      >
        <div>test</div>
      </OpptjeningPanel>,
      { messages },
    );

    expect(screen.getByText('test lovReferanse')).toBeInTheDocument();
  });
});
