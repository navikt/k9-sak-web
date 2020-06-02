import React, { FunctionComponent } from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import { Rammevedtak } from '@k9-sak-web/types';
import formaterDato from './utils';

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
