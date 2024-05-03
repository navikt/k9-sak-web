import behandlingType from '@k9-sak-web/kodeverk/src/behandlingType';
import { vilkarUtfallPeriodisert } from '@k9-sak-web/types';
import { reduxFormPropsMock } from '@k9-sak-web/utils-test/redux-form-test-helper';
import { renderWithIntlAndReduxForm } from '@k9-sak-web/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../i18n/nb_NO.json';
import { VilkarresultatMedOverstyringForm } from './VilkarresultatMedOverstyringForm';

describe('<VilkarresultatMedOverstyringForm>', () => {
  it('skal rendre form med knapp når vilkåret er overstyrt', () => {
    renderWithIntlAndReduxForm(
      <VilkarresultatMedOverstyringForm
        {...reduxFormPropsMock}
        erVilkarOk={vilkarUtfallPeriodisert.OPPFYLT}
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
        visPeriodisering={false}
        erOverstyrt
        aksjonspunkter={[]}
        behandlingsresultat={{
          type: { kode: 'test', kodeverk: 'test' },
        }}
        behandlingId={1}
        behandlingVersjon={2}
        behandlingType={{
          kode: behandlingType.FORSTEGANGSSOKNAD,
          kodeverk: '',
        }}
        medlemskapFom="10.10.2010"
        status=""
        submitCallback={() => undefined}
        isSolvable
        periodeFom="2019-01-01"
        periodeTom="2020-01-01"
        valgtPeriodeFom="2019-01-01"
        valgtPeriodeTom="2020-01-01"
      />,
      { messages },
    );

    expect(screen.getByText('Manuell overstyring av automatisk vurdering')).toBeInTheDocument();
    expect(screen.getByTestId('overstyringform')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bekreft overstyring' })).toBeInTheDocument();
  });
});
