import React from 'react';

import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import { VilkarresultatMedOverstyringFormPeriodisert } from './VilkarresultatMedOverstyringFormPeriodisert';

import messages from '../../i18n/nb_NO.json';

describe('<VilkarresultatMedOverstyringForm>', () => {
  it('skal rendre form med knapp når vilkåret er overstyrt', () => {
    renderWithIntlAndReduxForm(
      <VilkarresultatMedOverstyringFormPeriodisert
        isReadOnly
        overstyringApKode="5011"
        lovReferanse="§23"
        hasAksjonspunkt
        overrideReadOnly={false}
        toggleOverstyring={() => undefined}
        visPeriodisering={false}
        erOverstyrt
        aksjonspunkter={[]}
        behandlingsresultat={{ type: 'test' }}
        behandlingId={1}
        behandlingVersjon={2}
        behandlingType={behandlingType.FORSTEGANGSSOKNAD}
        medlemskapFom="10.10.2010"
        status=""
        submitCallback={() => undefined}
        periode={{
          periode: {
            fom: '2020-01-01',
            tom: '2020-01-31',
          },
          merknadParametere: {},
          vilkarStatus: 'test',
        }}
      />,
      { messages },
    );

    expect(screen.getByText('Manuell overstyring av automatisk vurdering')).toBeInTheDocument();
    expect(screen.getByTestId('overstyringform')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bekreft overstyring' })).toBeInTheDocument();
  });
});
