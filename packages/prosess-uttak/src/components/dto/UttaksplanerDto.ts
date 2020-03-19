import UttaksplanDto from './UttaksplanDto';

interface UttaksplanerDto {
  [behandlingId: string]: UttaksplanDto;
}

export default UttaksplanerDto;
