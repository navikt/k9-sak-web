import React from 'react';
import { Rammevedtak } from '@k9-sak-web/types/src/omsorgspenger/Rammevedtak';
import formaterDato from '../utils/formaterDato';

interface MidlertidigAleneProps {
  midlertidigAlene?: Rammevedtak;
}

const MidlertidigAlene = ({ midlertidigAlene }: MidlertidigAleneProps) =>
  midlertidigAlene ? (
    <FormattedMessage
      id="FaktaRammevedtak.MidlertidigAlene"
      values={{
        fom: formaterDato(midlertidigAlene.gyldigFraOgMed),
        tom: formaterDato(midlertidigAlene.gyldigTilOgMed),
        b: chunks => <b>{chunks}</b>,
        br: <br />,
      }}
    />
  ) : (
    Det er ikke registrert midlertidig aleneomsorg
  );

export default MidlertidigAlene;
