import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import { TableColumn, TableRow } from '@fpsak-frontend/shared-components';
import { dateFormat, TIDENES_ENDE } from '@fpsak-frontend/utils';
import { Column, Row } from 'nav-frontend-grid';

import { refusjonTilVurderingAndelPropType } from '../../propTypes/beregningsgrunnlagPropType';
import styles from './tidligereUtbetalinger.less';
import { createVisningsnavnForAktivitetRefusjon } from '../util/createVisningsnavnForAktivitet';

const utbetalingTil = (utbetalinger, andelsnavn) => utbetalinger.map((utbetaling) => (
  <Row className={styles.correctPadding} key={`${andelsnavn}_(${utbetaling.fom}_(${utbetaling.erTildeltRefusjon})`}>
    <Column>
      {utbetaling && utbetaling.erTildeltRefusjon
        ? <Normaltekst>{andelsnavn}</Normaltekst>
        : <FormattedMessage id="BeregningInfoPanel.RefusjonBG.Direkteutbetaling" />}
    </Column>
  </Row>
));

const lagPeriode = (utbetaling) => {
  if (!utbetaling) {
    return undefined;
  }
  const utbTom = utbetaling.tom === TIDENES_ENDE ? undefined : utbetaling.tom;
  return (
    <FormattedMessage
      id="BeregningInfoPanel.RefusjonBG.Periode"
      values={{ fom: dateFormat(utbetaling.fom), tom: utbTom ? dateFormat(utbTom) : '' }}
    />
  );
};

const perioder = (utbetalinger) => utbetalinger.map((utbetaling) => (
  <Row className={styles.correctPadding} key={`${utbetaling.fom}_(${utbetaling.erTildeltRefusjon})`}>
    <Column>
      {lagPeriode(utbetaling)}
    </Column>
  </Row>
));

export const TidligereUtbetalingRad = ({
  refusjonAndel,
  arbeidsgiverOpplysningerPerId,
}) => (
  <TableRow>
    <TableColumn>
      {createVisningsnavnForAktivitetRefusjon(refusjonAndel, arbeidsgiverOpplysningerPerId)}
    </TableColumn>
    <TableColumn>
      {utbetalingTil(refusjonAndel.tidligereUtbetalinger, createVisningsnavnForAktivitetRefusjon(refusjonAndel, arbeidsgiverOpplysningerPerId))}
    </TableColumn>
    <TableColumn>
      {perioder(refusjonAndel.tidligereUtbetalinger)}
    </TableColumn>
  </TableRow>
);


TidligereUtbetalingRad.propTypes = {
  refusjonAndel: refusjonTilVurderingAndelPropType.isRequired,
  arbeidsgiverOpplysningerPerId: PropTypes.shape().isRequired,
};


export default TidligereUtbetalingRad;
