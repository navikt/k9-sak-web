import React, { FunctionComponent } from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import Rammevedtak from '../dto/Rammevedtak';

interface MidlertidigAleneProps {
  midlertidigAlene?: Rammevedtak;
}

const MidlertidigAlene: FunctionComponent<MidlertidigAleneProps> = ({ midlertidigAlene }) =>
  midlertidigAlene ? (
    <FormattedHTMLMessage
      id="FaktaRammevedtak.MidlertidigAlene"
      values={{ fom: midlertidigAlene.gyldigFraOgMed, tom: midlertidigAlene.gyldigTilOgMed }}
    />
  ) : (
    <FormattedHTMLMessage id="FaktaRammevedtak.IkkeMidlertidigAlene" />
  );

export default MidlertidigAlene;
