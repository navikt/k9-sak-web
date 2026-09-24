import { fagsakYtelsesType, FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import type { BarnDto } from '@k9-sak-web/backend/k9sak/kontrakt/omsorgspenger/BarnDto.js';
import { BarnType } from '@k9-sak-web/backend/k9sak/kontrakt/omsorgspenger/BarnDto.js';
import { BarnFakta } from '@k9-sak-web/fakta-barn-oms';
import { Personopplysninger, Rammevedtak } from '@k9-sak-web/types';

interface OwnProps {
  personopplysninger?: Personopplysninger;
  rammevedtak: Rammevedtak[];
  fagsaksType: FagsakYtelsesType;
}

const UtvidetRettBarnFakta = ({ personopplysninger, rammevedtak, fagsaksType }: OwnProps) => {
  const erFagsakYtelseTypeKroniskSyktBarn = fagsakYtelsesType.OMSORGSPENGER_KS === fagsaksType;
  const personOpplysningerBarn = erFagsakYtelseTypeKroniskSyktBarn
    ? personopplysninger?.barnSoktFor || []
    : personopplysninger?.barn || [];

  const barn: BarnDto[] = personOpplysningerBarn.map(({ fnr, fodselsdato }) => ({
    personIdent: fnr,
    fødselsdato: fodselsdato,
    barnType: BarnType.VANLIG,
  }));

  return <BarnFakta barn={barn} rammevedtak={rammevedtak} fagsaksType={fagsaksType} />;
};
export default UtvidetRettBarnFakta;
