import { RestApiErrorProvider } from '@k9-sak-web/rest-api-hooks';
import { renderWithIntlAndReduxForm } from '@k9-sak-web/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../i18n/nb_NO.json';
import { OverføringsretningEnum } from '../types/Overføring';
import OverføringsdagerPanelgruppe from './OverføringsdagerPanelgruppe';

describe('<OverføringsdagerPanelgruppe>', () => {
  it('Rendrer 3 OverføringsdagerPaneler med', () => {
    renderWithIntlAndReduxForm(
      <RestApiErrorProvider>
        <OverføringsdagerPanelgruppe
          retning={OverføringsretningEnum.UT}
          koronaoverføringer={[]}
          fordelinger={[]}
          overføringer={[]}
          behandlingVersjon={1}
          behandlingId={1}
        />
      </RestApiErrorProvider>,
      { messages },
    );
    expect(screen.getByText('Fordeling etter samværsavtale')).toBeInTheDocument();
    expect(screen.getByText('Overføring')).toBeInTheDocument();
    expect(screen.getByText('Koronaoverføring')).toBeInTheDocument();
  });
});
