import { splitUttakByDate } from './splitUttakByDate';
import type { UttaksperiodeBeriket } from '../types/UttaksperiodeBeriket';

const p = (fom: string, tom: string): UttaksperiodeBeriket => ({
  periode: { fom, tom },
  uttaksgrad: 50,
  inngangsvilkår: {},
  pleiebehov: 50,
  årsaker: [],
});

describe('splitUttakByDate', () => {
  it('returnerer alle i before når virkningsdato mangler', async () => {
    const { before, afterOrCovering } = splitUttakByDate([p('2024-01-01', '2024-01-05')], undefined);
    await expect(before).toHaveLength(1);
    await expect(afterOrCovering).toHaveLength(0);
  });

  it('splitt før og etter dato', async () => {
    const { before, afterOrCovering } = splitUttakByDate(
      [p('2024-01-01', '2024-01-05'), p('2024-01-10', '2024-01-12')],
      '2024-01-07',
    );
    await expect(before).toHaveLength(1);
    await expect(afterOrCovering).toHaveLength(1);
  });

  it('periode som dekker virkningsdato havner i afterOrCovering', async () => {
    const { before, afterOrCovering } = splitUttakByDate([p('2024-01-01', '2024-01-10')], '2024-01-05');
    await expect(before).toHaveLength(0);
    await expect(afterOrCovering).toHaveLength(1);
  });

  it('tomhåndtering', async () => {
    const { before, afterOrCovering } = splitUttakByDate([], '2024-01-01');
    await expect(before).toHaveLength(0);
    await expect(afterOrCovering).toHaveLength(0);
  });
});
