import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { vilkarUtfallPeriodisert } from '@k9-sak-web/types';
import { screen } from '@testing-library/react';
import React from 'react';
import { reduxForm } from 'redux-form';
import messages from '../../i18n/nb_NO.json';
import { VilkarresultatMedOverstyringForm } from './VilkarresultatMedOverstyringForm';

describe('<VilkarresultatMedOverstyringForm>', () => {
  const MockForm = reduxForm({ form: 'mock', onSubmit: vi.fn() })(({ children }) => <div>{children}</div>);

  it('skal rendre form med knapp når vilkåret er overstyrt', () => {
    renderWithIntlAndReduxForm(
      <MockForm>
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
        />{' '}
      </MockForm>,
      { messages },
    );

    expect(screen.getByText('Manuell overstyring av automatisk vurdering')).toBeInTheDocument();
    expect(screen.getByTestId('overstyringform')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bekreft overstyring' })).toBeInTheDocument();
  });
});
