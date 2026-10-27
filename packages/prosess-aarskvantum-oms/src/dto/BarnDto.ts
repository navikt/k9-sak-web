import { BarnTypeType } from '@k9-sak-web/backend/k9sak/kontrakt/omsorgspenger/BarnDto.js';

interface BarnDto {
  personIdent?: string;
  fødselsdato?: string;
  dødsdato?: string;
  deltBostedPerioder?: string[];
  sammeBostedPerioder?: string[];
  barnType?: BarnTypeType;
}

export default BarnDto;
