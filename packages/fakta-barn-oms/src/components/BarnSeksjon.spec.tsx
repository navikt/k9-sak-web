import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { BarnType } from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/BarnDto';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../i18n/nb_NO.json';
import KombinertBarnOgRammevedtak from '../dto/KombinertBarnOgRammevedtak';
import BarnSeksjon from './BarnSeksjon';

describe('<BarnSeksjon>', () => {
  it('Rendrer hvert barn', () => {
    const barn: KombinertBarnOgRammevedtak[] = [
      {
        personIdent: '150915',
        barnRelevantIBehandling: {
          personIdent: '150915',
          fødselsdato: '2013-08-31',
          dødsdato: null,
          harSammeBosted: true,
          barnType: BarnType.VANLIG,
        },
      },
      {
        personIdent: '150915',
        barnRelevantIBehandling: {
          personIdent: '150915',
          fødselsdato: '2013-08-31',
          dødsdato: null,
          harSammeBosted: true,
          barnType: BarnType.VANLIG,
        },
      },
    ];
    renderWithIntl(<BarnSeksjon barn={barn} startIndex={0} tekstId="FaktaBarn.Behandlingsdato" />, { messages });

    expect(
      screen.getByText(
        'Disse barna er søkerens folkeregistrerte barn slik det var ved tidspunktet for beregning av dager',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Barn #1')).toBeInTheDocument();
    expect(screen.getByText('Barn #2')).toBeInTheDocument();
  });
});
