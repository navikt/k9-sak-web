import React from 'react';
import FagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { Rammevedtak } from '@k9-sak-web/types';
import FaktaBarnIndex from '@k9-sak-web/fakta-barn-oms';
import BarnDto, { BarnType } from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/BarnDto';

interface OwnProps {
  personopplysninger: {
    barn: { fnr: string }[];
    barnSoktFor: { fnr: string }[];
  };
  rammevedtak: Rammevedtak[];
  fagsaksType: string;
}

const UtvidetRettBarnFakta: React.FunctionComponent<OwnProps> = ({ personopplysninger, rammevedtak, fagsaksType }) => {
  const erFagsakYtelseTypeKroniskSyktBarn = FagsakYtelseType.OMSORGSPENGER_KRONISK_SYKT_BARN === fagsaksType;
  const barn = erFagsakYtelseTypeKroniskSyktBarn ? personopplysninger.barnSoktFor : personopplysninger.barn;

  const formateradeBarn: BarnDto[] = barn.map(
    ({ fnr }) =>
      ({
        personIdent: fnr.substr(0, 6),
        harSammeBosted: undefined,
        barnType: BarnType.VANLIG,
      } as BarnDto),
  );

  return <FaktaBarnIndex rammevedtak={rammevedtak} barn={formateradeBarn} fagsaksType={fagsaksType} />;
};
export default UtvidetRettBarnFakta;
