import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/redux-form-test-helper';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import { VilkarresultatMedOverstyringForm } from './VilkarresultatMedOverstyringForm';

import messages from '../../i18n/nb_NO.json';

describe('<VilkarresultatMedOverstyringForm>', () => {
  it('skal rendre form med knapp når vilkåret er overstyrt', () => {
    renderWithIntlAndReduxForm(
      <VilkarresultatMedOverstyringForm
        {...reduxFormPropsMock}
        overstyringApKode="5011"
        lovReferanse="§23"
        overrideReadOnly={false}
        toggleOverstyring={() => undefined}
        erMedlemskapsPanel={false}
        erOverstyrt
        aksjonspunkter={[]}
        behandlingsresultat={{ type: 'test' }}
        behandlingId={1}
        behandlingVersjon={2}
        behandlingType={behandlingType.FORSTEGANGSSOKNAD}
        medlemskapFom="10.10.2010"
        status=""
        submitCallback={() => undefined}
      />,
      { messages },
    );

    expect(screen.getByText('Manuell overstyring av automatisk vurdering')).toBeInTheDocument();
    expect(screen.getByTestId('overstyringform')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bekreft overstyring' })).toBeInTheDocument();
  });
});
