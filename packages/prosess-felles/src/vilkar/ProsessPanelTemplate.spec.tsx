import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import sinon from 'sinon';
import messages from '../../i18n/nb_NO.json';
import ProsessPanelTemplate from './ProsessPanelTemplate';

describe('<ProsessPanelTemplate>', () => {
  it('skal ikke vise lovreferanse når dette ikke finnes', () => {
    const { container } = renderWithIntlAndReduxForm(
      <ProsessPanelTemplate
        handleSubmit={sinon.spy()}
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
      </ProsessPanelTemplate>,
      { messages },
    );

    expect(container.getElementsByClassName('vilkar').length).toBe(0);
  });

  it('skal vise lovreferanse når dette finnes', () => {
    renderWithIntlAndReduxForm(
      <ProsessPanelTemplate
        handleSubmit={sinon.spy()}
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
      </ProsessPanelTemplate>,
      { messages },
    );

    expect(screen.getByText('test lovReferanse')).toBeInTheDocument();
  });
});
