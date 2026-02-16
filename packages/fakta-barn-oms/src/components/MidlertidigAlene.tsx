import type { Rammevedtak } from '@k9-sak-web/types/src/omsorgspenger/Rammevedtak';
import React from 'react';
import { FormattedMessage } from 'react-intl';
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
    <FormattedMessage id="FaktaRammevedtak.IkkeMidlertidigAlene" />
  );

export default MidlertidigAlene;
