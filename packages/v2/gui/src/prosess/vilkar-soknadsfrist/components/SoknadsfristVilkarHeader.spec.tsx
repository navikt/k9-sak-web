import { render, screen } from '@testing-library/react';
import SoknadsfristVilkarHeader from './SoknadsfristVilkarHeader';

describe('<SoknadsfristVilkarHeader>', () => {
  it('skal rendre header', () => {
    render(
      <SoknadsfristVilkarHeader
        overstyringApKode="5011"
        lovReferanse="§23"
        overrideReadOnly={false}
        kanOverstyreAccess={{
          employeeHasAccess: true,
          isEnabled: true,
        }}
        toggleOverstyring={() => undefined}
        panelTittelKode="Søknadsfrist"
        erOverstyrt
        aksjonspunkter={[]}
        status="OPPFYLT"
      />,
    );

    expect(screen.getByRole('heading', { name: 'Søknadsfrist' })).toBeInTheDocument();
    expect(screen.getByText('§')).toBeInTheDocument();
    expect(screen.getByText('23')).toBeInTheDocument();
  });
});
