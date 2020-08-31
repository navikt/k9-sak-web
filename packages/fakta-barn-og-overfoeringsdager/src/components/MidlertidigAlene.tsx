import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { Rammevedtak } from '@k9-sak-web/types/src/omsorgspenger/Rammevedtak';
import formaterDato from './utils';

interface MidlertidigAleneProps {
  midlertidigAlene?: Rammevedtak;
}

const MidlertidigAlene: FunctionComponent<MidlertidigAleneProps> = ({ midlertidigAlene }) =>
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
