import { render, screen } from '@testing-library/react';
import VilkarresultatMedOverstyringHeader from './VilkarresultatMedOverstyringHeader';

describe('<VilkarresultatMedOverstyringHeader>', () => {
  it('skal rendre header', () => {
    render(
      <VilkarresultatMedOverstyringHeader
        overstyringApKode="5011"
        lovReferanse="§ 23"
        overrideReadOnly={false}
        kanOverstyreAccess={{
          isEnabled: true,
        }}
        toggleOverstyring={() => undefined}
        panelTittelKode="Medlemskap"
        erOverstyrt
        aksjonspunkter={[]}
        periode={{
          avslagKode: '',
          begrunnelse: '',
          vurderesIBehandlingen: true,
          merknad: undefined,
          merknadParametere: {},
          periode: { fom: '', tom: '' },
          vilkarStatus: 'UDEFINERT',
        }}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Medlemskap' })).toBeInTheDocument();
    expect(screen.getByText('23')).toBeInTheDocument();
  });
});
