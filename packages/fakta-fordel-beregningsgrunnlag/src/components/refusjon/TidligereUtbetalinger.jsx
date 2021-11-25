import React from 'react';
import PropTypes from 'prop-types';
import { Table } from '@fpsak-frontend/shared-components';
import { Column, Row } from 'nav-frontend-grid';

import beregningsgrunnlagPropType from '../../propTypes/beregningsgrunnlagPropType';
import styles from './tidligereUtbetalinger.less';
import TidligereUtbetalingRad from './TidligereUtbetalingRad';



const lagRadNøkkel = (andel) => {
  if (andel.arbeidsgiver.arbeidsgiverAktørId) {
    return `${andel.arbeidsgiver.arbeidsgiverAktørId}${andel.internArbeidsforholdRef})`;
  }
  return `${andel.arbeidsgiver.arbeidsgiverOrgnr}${andel.internArbeidsforholdRef})`;
};

export const TidligereUtbetalinger = ({ beregningsgrunnlag, arbeidsgiverOpplysningerPerId }) => {
  const { andeler } = beregningsgrunnlag.refusjonTilVurdering;
  return (
    <Row>
      <Column xs="8">
        <Table
          headerTextCodes={['BeregningInfoPanel.RefusjonBG.Aktivitet', 'BeregningInfoPanel.RefusjonBG.TidligereUtb',
            'BeregningInfoPanel.RefusjonBG.GjeldendeFra']}
          noHover
          classNameTable={styles.tabell}
        >
          { andeler.map((andel) => (
            <TidligereUtbetalingRad
              arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
              refusjonAndel={andel}
              key={lagRadNøkkel(andel)}
            />
          ))}
        </Table>
      </Column>
    </Row>
  );
};


TidligereUtbetalinger.propTypes = {
  beregningsgrunnlag: beregningsgrunnlagPropType.isRequired,
  arbeidsgiverOpplysningerPerId: PropTypes.shape().isRequired,
};

export default TidligereUtbetalinger;
