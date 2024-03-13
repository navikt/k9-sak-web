import React from 'react';
import sinon from 'sinon';

import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { Behandling } from '@k9-sak-web/types';
import { screen } from '@testing-library/react';

import SoknadsfristVilkarProsessIndex from './SoknadsfristVilkarProsessIndex';

import messages from '../i18n/nb_NO.json';

const soknadsfristStatus = {
  dokumentStatus: [],
};

describe('<SoknadsfristVilkarForm>', () => {
  it('skal rendre tabs dersom bare en periode', () => {
    renderWithIntlAndReduxForm(
      <SoknadsfristVilkarProsessIndex
        behandling={
          {
            id: 1,
            versjon: 1,
          } as Behandling
        }
        kanOverstyreAccess={{
          isEnabled: true,
        }}
        toggleOverstyring={sinon.spy()}
        submitCallback={sinon.spy()}
        aksjonspunkter={[]}
        panelTittelKode="Inngangsvilkar.Soknadsfrist"
        erOverstyrt={false}
        overrideReadOnly={false}
        vilkar={[
          {
            perioder: [
              {
                periode: {
                  fom: '2020-03-01',
                  tom: '2020-04-01',
                },
                vilkarStatus: 'test',
                avslagKode: 'test',
                vurderesIBehandlingen: true,
                merknadParametere: {
                  test: 'test',
                },
              },
            ],
            overstyrbar: true,
            vilkarType: 'test',
          },
        ]}
        soknadsfristStatus={soknadsfristStatus}
        visAllePerioder={false}
      />,
      { messages },
    );
    expect(screen.getByText('Perioder')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '01.03.2020 - 01.04.2020' })).toBeInTheDocument();
  });
});
