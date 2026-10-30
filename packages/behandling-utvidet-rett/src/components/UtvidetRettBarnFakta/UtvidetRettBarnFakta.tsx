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

// Kompileringsfeil her betyr at BRUK_V2_BARN_OMS er fjernet fra FeatureToggles.
// Slett denne fila og fjern v1-grenen i BarnFaktaPanelDef når migreringen er ferdig.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _VenterPåSletting = import('@k9-sak-web/gui/featuretoggles/FeatureToggles.js').FeatureToggles['BRUK_V2_BARN_OMS'];
