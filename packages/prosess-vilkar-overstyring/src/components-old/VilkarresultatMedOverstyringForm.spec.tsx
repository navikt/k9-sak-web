import React from 'react';
import { screen } from '@testing-library/react';

import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/redux-form-test-helper';

import { VilkarresultatMedOverstyringForm } from './VilkarresultatMedOverstyringForm';

import messages from '../../i18n/nb_NO.json';

describe('<VilkarresultatMedOverstyringForm>', () => {
  it('skal rendre form med knapp når vilkåret er overstyrt', () => {
    renderWithIntlAndReduxForm(
      <VilkarresultatMedOverstyringForm
        {...reduxFormPropsMock}
        erVilkarOk
        isReadOnly
        overstyringApKode="5011"
        avslagsarsaker={[
          { kode: 'test1', navn: 'test1', kodeverk: 'test' },
          { kode: 'test2', navn: 'test1', kodeverk: 'test' },
        ]}
        lovReferanse="§23"
        hasAksjonspunkt
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
        isSolvable
        periodeFom="2019-01-01"
        periodeTom="2020-01-01"
      />,
      { messages },
    );

    expect(screen.getByText('Manuell overstyring av automatisk vurdering')).toBeInTheDocument();
    expect(screen.getByTestId('overstyringform')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bekreft overstyring' })).toBeInTheDocument();
  });
});
