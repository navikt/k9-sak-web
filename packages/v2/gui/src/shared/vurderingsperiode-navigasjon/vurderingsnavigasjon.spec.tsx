import { render, screen, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Vurderingsnavigasjon, { Resultat, type Vurderingselement } from './Vurderingsnavigasjon';
import { Period } from '@navikt/ft-utils';

const makePeriod = (fom: string, tom?: string) => new Period(fom, tom ?? fom);

const makeElement = (fom: string, tom: string, resultat: (typeof Resultat)[keyof typeof Resultat]) => ({
  perioder: [makePeriod(fom, tom)],
  resultat,
});

describe('VurderingsperiodeNavigasjon - ordering', () => {
  it('vises med "må vurderes" først eldste→nyeste, deretter vurderte eldste→nyeste', async () => {
    const tilVurdering: Vurderingselement[] = [
      makeElement('2025-01-02', '2025-01-05', Resultat.MÅ_VURDERES),
      makeElement('2025-02-10', '2025-02-12', Resultat.MÅ_VURDERES),
      makeElement('2025-03-15', '2025-03-18', Resultat.MÅ_VURDERES),
      makeElement('2025-01-20', '2025-01-21', Resultat.MÅ_VURDERES),
      makeElement('2025-02-25', '2025-02-26', Resultat.MÅ_VURDERES),
      makeElement('2025-03-28', '2025-03-30', Resultat.MÅ_VURDERES),
      makeElement('2025-04-05', '2025-04-07', Resultat.MÅ_VURDERES),
      makeElement('2025-01-10', '2025-01-11', Resultat.MÅ_VURDERES),
      makeElement('2025-02-01', '2025-02-03', Resultat.MÅ_VURDERES),
    ];
    const vurderte: Vurderingselement[] = [
      makeElement('2024-11-28', '2024-11-30', Resultat.GODKJENT_MANUELT),
      makeElement('2024-12-28', '2024-12-30', Resultat.GODKJENT_MANUELT),
    ];

    const perioder = [...tilVurdering, ...vurderte];

    render(
      <Vurderingsnavigasjon valgtPeriode={null} perioder={perioder} onPeriodeClick={() => {}} nyesteFørst={false} />,
    );

    // Hent liste og rader
    const list = await screen.findByRole('list');
    const items = within(list).getAllByRole('listitem');

    // Ekstraher knappetekst
    const buttonDates = items.map(li => {
      const btn = within(li).getByRole('button');
      return btn.textContent?.replace(/\s+/g, ' ').trim() ?? '';
    });

    // Forventet rekkefølge (tekst fra RadDato/Rad som bruker Period.prettifyPeriod())
    const expectedOrder = [
      // Må vurderes
      '02.01.2025 - 05.01.2025',
      '10.01.2025 - 11.01.2025',
      '20.01.2025 - 21.01.2025',
      '01.02.2025 - 03.02.2025',
      '10.02.2025 - 12.02.2025',
      '25.02.2025 - 26.02.2025',
      '15.03.2025 - 18.03.2025',
      '28.03.2025 - 30.03.2025',
      '05.04.2025 - 07.04.2025',
      // Vurderte
      '28.11.2024 - 30.11.2024',
      '28.12.2024 - 30.12.2024',
    ];

    // Verifiser at hver tekst forekommer på korrekt indeks
    for (let i = 0; i < expectedOrder.length; i += 1) {
      expect(buttonDates[i]).toContain(expectedOrder[i]);
    }
  });

  it('vises med "må vurderes" først nyeste→eldste når nyesteFørst=true, deretter vurderte nyeste→eldste', async () => {
    const tilVurdering: Vurderingselement[] = [
      makeElement('2025-01-02', '2025-01-05', Resultat.MÅ_VURDERES),
      makeElement('2025-02-10', '2025-02-12', Resultat.MÅ_VURDERES),
      makeElement('2025-03-15', '2025-03-18', Resultat.MÅ_VURDERES),
      makeElement('2025-01-20', '2025-01-21', Resultat.MÅ_VURDERES),
      makeElement('2025-02-25', '2025-02-26', Resultat.MÅ_VURDERES),
      makeElement('2025-03-28', '2025-03-30', Resultat.MÅ_VURDERES),
      makeElement('2025-04-05', '2025-04-07', Resultat.MÅ_VURDERES),
      makeElement('2025-01-10', '2025-01-11', Resultat.MÅ_VURDERES),
      makeElement('2025-02-01', '2025-02-03', Resultat.MÅ_VURDERES),
    ];
    const vurderte: Vurderingselement[] = [
      makeElement('2024-11-28', '2024-11-30', Resultat.GODKJENT_MANUELT),
      makeElement('2024-12-28', '2024-12-30', Resultat.GODKJENT_MANUELT),
    ];
    const perioder = [...tilVurdering, ...vurderte];

    render(<Vurderingsnavigasjon valgtPeriode={null} perioder={perioder} onPeriodeClick={() => {}} nyesteFørst />);

    const list = await screen.findByRole('list');
    const items = within(list).getAllByRole('listitem');

    const buttonDates = items.map(li => {
      const btn = within(li).getByRole('button');
      return btn.textContent?.replace(/\s+/g, ' ').trim() ?? '';
    });

    // Forventet rekkefølge: MÅ_VURDERES nyeste→eldste, deretter vurderte nyeste→eldste
    const expectedOrder = [
      // MÅ_VURDERES
      '05.04.2025 - 07.04.2025',
      '28.03.2025 - 30.03.2025',
      '15.03.2025 - 18.03.2025',
      '25.02.2025 - 26.02.2025',
      '10.02.2025 - 12.02.2025',
      '01.02.2025 - 03.02.2025',
      '20.01.2025 - 21.01.2025',
      '10.01.2025 - 11.01.2025',
      '02.01.2025 - 05.01.2025',
      // Vurderte
      '28.12.2024 - 30.12.2024',
      '28.11.2024 - 30.11.2024',
    ];

    for (let i = 0; i < expectedOrder.length; i += 1) {
      expect(buttonDates[i]).toContain(expectedOrder[i]);
    }
  });
});
