import React from 'react';
import { Rammevedtak } from '@k9-sak-web/types/src/omsorgspenger/Rammevedtak';
import formaterDato from '../utils/formaterDato';

interface MidlertidigAleneProps {
  midlertidigAlene?: Rammevedtak;
}

const MidlertidigAlene = ({ midlertidigAlene }: MidlertidigAleneProps) =>
  midlertidigAlene ? (
    <>
      Brukeren har midlertidig aleneomsorg for alle barn.
      <br />
      Gyldig fra og med <b>{formaterDato(midlertidigAlene.gyldigFraOgMed)}</b> til og med <b>{formaterDato(midlertidigAlene.gyldigTilOgMed)}</b>.
    </>
  ) : (
    Det er ikke registrert midlertidig aleneomsorg
  );

export default MidlertidigAlene;
