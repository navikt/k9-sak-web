import React from 'react';
import { expect } from 'chai';

import Table from '@fpsak-frontend/shared-components/src/table/Table';
import mountWithIntl from '../../i18n/intl-enzyme-test-helper-fakta-omsorgen-for';
import SokerinfoTable from './SokerinfoTable';

describe('<SokerinfoTable>', () => {
  it('skal vise søkerinfo i en tabell per info-element', () => {
    const header = 'Overskrift';
    const forhold = [
      {
        forholdstekst: 'Søker er under 70 år',
        forholdskode: '1',
        erOppfylt: true,
        link: {
          to: 'vg.no',
          text: 'VG',
        },
      },
      {
        forholdstekst: 'Barnet er under 18 år',
        forholdskode: '2',
        erOppfylt: false,
        link: {
          to: 'vg.no',
          text: 'VG',
        },
      },
    ];

    const table = mountWithIntl(<SokerinfoTable header={header} forhold={forhold} />);

    const tekstForForhold = etForhold =>
      `${etForhold.forholdstekst}${etForhold.erOppfylt ? 'Ja' : 'Nei'}${etForhold.link.text}`;

    expect(table.find(Table)).has.length(1);
    expect(table.text()).to.contain(tekstForForhold(forhold[0]));
    expect(table.text()).to.contain(tekstForForhold(forhold[1]));
  });
});
