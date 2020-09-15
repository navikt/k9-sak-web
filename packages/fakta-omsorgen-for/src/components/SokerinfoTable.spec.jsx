import React from 'react';
import { expect } from 'chai';

import Table from '@fpsak-frontend/shared-components/src/table/Table';
import mountWithIntl from '../../i18n';
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

  it('skal ikke vise rad i tabell dersom omsorgen for ikke er definert', () => {
    const header = 'Overskrift';
    const forhold = [
      {
        forholdstekst: 'Omsorgen for',
        erOppfylt: null,
        link: {
          to: 'https://www.vg.no',
          text: 'SØ',
        },
      },
      {
        forholdstekst: 'Mor eller far',
        erOppfylt: true,
        link: {
          to: 'https://www.vg.no',
          text: 'FR',
        },
      },
      {
        forholdstekst: 'Samme bosted',
        erOppfylt: true,
        link: {
          to: 'https://www.vg.no',
          text: 'FR',
        },
      },
    ];

    const tekstForForhold = etForhold =>
      `${etForhold.forholdstekst}${etForhold.erOppfylt ? 'Ja' : 'Nei'}${etForhold.link.text}`;

    const table = mountWithIntl(<SokerinfoTable header={header} forhold={forhold} />);
    expect(table.find(Table)).has.length(1);
    expect(table.text()).to.not.contain(tekstForForhold(forhold[0]));
    expect(table.text()).to.contain(tekstForForhold(forhold[1]));
    expect(table.text()).to.contain(tekstForForhold(forhold[2]));
  });
});
