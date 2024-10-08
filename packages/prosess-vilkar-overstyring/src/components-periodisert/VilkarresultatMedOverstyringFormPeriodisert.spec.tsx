import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import messages from '../../i18n/nb_NO.json';
import { VilkarresultatMedOverstyringFormPeriodisert } from './VilkarresultatMedOverstyringFormPeriodisert';

describe('<VilkarresultatMedOverstyringForm>', () => {
  it('skal rendre form med knapp når vilkåret er overstyrt', () => {
    renderWithIntlAndReduxForm(
      <VilkarresultatMedOverstyringFormPeriodisert
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
        periode={{
          periode: {
            fom: '2020-01-01',
            tom: '2020-01-31',
          },
          merknadParametere: {},
          vilkarStatus: { kode: 'test', kodeverk: 'test' },
        }}
      />,
      { messages },
    );

    expect(screen.getByText('Manuell overstyring av automatisk vurdering')).toBeInTheDocument();
    expect(screen.getByTestId('overstyringform')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bekreft overstyring' })).toBeInTheDocument();
  });
});
