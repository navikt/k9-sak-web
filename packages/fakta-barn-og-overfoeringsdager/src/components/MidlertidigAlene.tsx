import React, { FunctionComponent } from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import Rammevedtak from '../dto/Rammevedtak';
import { formaterDato } from './BarnVisning';

interface MidlertidigAleneProps {
  midlertidigAlene?: Rammevedtak;
}

const MidlertidigAlene: FunctionComponent<MidlertidigAleneProps> = ({ midlertidigAlene }) =>
  midlertidigAlene ? (
    <FormattedHTMLMessage
      id="FaktaRammevedtak.MidlertidigAlene"
      values={{
        fom: formaterDato(midlertidigAlene.gyldigFraOgMed),
        tom: formaterDato(midlertidigAlene.gyldigTilOgMed),
      }}
    />
  ) : (
    <FormattedHTMLMessage id="FaktaRammevedtak.IkkeMidlertidigAlene" />
  );

export default MidlertidigAlene;
