import { render, screen } from '@testing-library/react';
import React from 'react';
import SoknadsfristVilkarHeader from './SoknadsfristVilkarHeader';

describe('<SoknadsfristVilkarHeader>', () => {
  it('skal rendre header', () => {
    render(
      <SoknadsfristVilkarHeader
        overstyringApKode="5011"
        lovReferanse="§23"
        overrideReadOnly={false}
        kanOverstyreAccess={{
          isEnabled: true,
        }}
        toggleOverstyring={() => undefined}
        panelTittelKode="Søknadsfrist"
        erOverstyrt
        aksjonspunkter={[]}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Søknadsfrist' })).toBeInTheDocument();
    expect(screen.getByText('§23')).toBeInTheDocument();
  });
});
