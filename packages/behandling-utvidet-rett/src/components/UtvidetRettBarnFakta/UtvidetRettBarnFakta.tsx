import React from 'react';
import { fagsakYtelsesType, FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { Rammevedtak } from '@k9-sak-web/types';
import FaktaBarnIndex from '@k9-sak-web/fakta-barn-oms';
import BarnDto, { BarnType } from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/BarnDto';

interface OwnProps {
  personopplysninger: {
    barn: { fnr: string; fodselsdato: string }[];
    barnSoktFor: { fnr: string; fodselsdato: string }[];
  };
  rammevedtak: Rammevedtak[];
  fagsaksType: FagsakYtelsesType;
}

const UtvidetRettBarnFakta = ({ personopplysninger, rammevedtak, fagsaksType }: OwnProps) => {
  const erFagsakYtelseTypeKroniskSyktBarn = fagsakYtelsesType.OMP_KS === fagsaksType;
  const barn = erFagsakYtelseTypeKroniskSyktBarn
    ? personopplysninger?.barnSoktFor || []
    : personopplysninger?.barn || [];

  const formateradeBarn: BarnDto[] = barn.map(
    ({ fnr, fodselsdato }) =>
      ({
        personIdent: fnr.substr(0, 6),
        fødselsdato: fodselsdato,
        harSammeBosted: undefined,
        barnType: BarnType.VANLIG,
      }) as BarnDto,
  );

  return <FaktaBarnIndex rammevedtak={rammevedtak} barn={formateradeBarn} fagsaksType={fagsaksType} />;
};
export default UtvidetRettBarnFakta;
