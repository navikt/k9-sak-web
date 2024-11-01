import { type UttakDto, utfall2 as GeneratedUtfall } from '../generated';
export type UttakUtfallType = UttakDto['utfall'];
export const uttakUtfallType: Readonly<Record<UttakUtfallType, UttakUtfallType>> = GeneratedUtfall;
