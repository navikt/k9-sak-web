import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../i18n/nb_NO.json';
import { OverføringsretningEnum } from '../types/Overføring';
import OverføringsdagerPanelgruppe from './OverføringsdagerPanelgruppe';
import { GlobalUnhandledErrorCatcher } from '@k9-sak-web/gui/app/errorhandling/GlobalUnhandledErrorCatcher.js';

describe('<OverføringsdagerPanelgruppe>', () => {
  it('Rendrer 3 OverføringsdagerPaneler med', () => {
    renderWithIntlAndReduxForm(
      <GlobalUnhandledErrorCatcher>
        <OverføringsdagerPanelgruppe
          retning={OverføringsretningEnum.UT}
          koronaoverføringer={[]}
          fordelinger={[]}
          overføringer={[]}
          behandlingVersjon={1}
          behandlingId={1}
        />
      </GlobalUnhandledErrorCatcher>,
      { messages },
    );
    expect(screen.getByText('Fordeling etter samværsavtale')).toBeInTheDocument();
    expect(screen.getByText('Overføring')).toBeInTheDocument();
    expect(screen.getByText('Koronaoverføring')).toBeInTheDocument();
  });
});
