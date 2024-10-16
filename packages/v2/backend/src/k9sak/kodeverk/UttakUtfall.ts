import type { Kodeverk } from '../../shared/Kodeverk.ts';
import { type UttakDto } from '../generated';

export type UttakUtfallType = UttakDto['utfall'];

export type UttakUtfallTypeKodeverk = Kodeverk<UttakUtfallType, 'UTTAK_UTFALL'>;

export const uttakUtfallType: Readonly<Record<UttakUtfallType, UttakUtfallType>> = {
  INNVILGET: 'INNVILGET',
  AVSLÅTT: 'AVSLÅTT',
  UDEFINERT: 'UDEFINERT',
};
