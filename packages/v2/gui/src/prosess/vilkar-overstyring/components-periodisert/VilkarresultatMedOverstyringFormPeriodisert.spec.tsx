import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { render, screen } from '@testing-library/react';
import { VilkarresultatMedOverstyringFormPeriodisert } from './VilkarresultatMedOverstyringFormPeriodisert';

describe('<VilkarresultatMedOverstyringForm>', () => {
  it('skal rendre form med knapp når vilkåret er overstyrt', () => {
    render(
      <VilkarresultatMedOverstyringFormPeriodisert
        overstyringApKode="5011"
        overrideReadOnly={false}
        toggleOverstyring={() => undefined}
        visPeriodisering={false}
        erOverstyrt
        aksjonspunkter={[]}
        behandlingType={behandlingType.FØRSTEGANGSSØKNAD}
        medlemskapFom="10.10.2010"
        status=""
        submitCallback={() => undefined}
        periode={{
          periode: {
            fom: '2020-01-01',
            tom: '2020-01-31',
          },
          merknadParametere: {},
          vilkarStatus: 'IKKE_VURDERT',
        }}
        erMedlemskapsPanel={false}
      />,
    );

    expect(screen.getByText('Manuell overstyring av automatisk vurdering')).toBeInTheDocument();
    expect(screen.getByTestId('overstyringform')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bekreft overstyring' })).toBeInTheDocument();
  });
});
