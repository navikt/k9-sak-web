import React from 'react';
import { Column, Row } from 'nav-frontend-grid';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';

import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import moment from 'moment';
import beregningStyles from '../../beregningsgrunnlagPanel/beregningsgrunnlag.less';
import beregningsgrunnlagPropType from '../../../propTypes/beregningsgrunnlagPropType';

const lagPerioderadMedTekst = (tekstId, fom, tom) => (
  <Row>
    <Column xs="12">
      <Normaltekst>
        <FormattedMessage
          id={tekstId}
          values={{
            fom: moment(fom).format(DDMMYYYY_DATE_FORMAT),
            tom: moment(tom).format(DDMMYYYY_DATE_FORMAT),
          }}
        />
      </Normaltekst>
    </Column>
  </Row>
);

const lagSøktYtelseRadPeriode = periode => {
  const snAndel = periode.frisinnAndeler.find(
    andel => andel.statusSøktFor === aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE,
  );
  const flAndel = periode.frisinnAndeler.find(andel => andel.statusSøktFor === aktivitetStatus.FRILANSER);
  return (
    <div key={periode.fom}>
      {flAndel && lagPerioderadMedTekst('Beregningsgrunnlag.Søknad.SøktYtelseFL', periode.fom, periode.tom)}
      {snAndel && lagPerioderadMedTekst('Beregningsgrunnlag.Søknad.SøktYtelseSN', periode.fom, periode.tom)}
    </div>
  );
};

const Søknadsopplysninger = ({ beregningsgrunnlag }) => {
  const ytelsegrunnlag = beregningsgrunnlag.ytelsesspesifiktGrunnlag;
  const { frisinnPerioder } = ytelsegrunnlag;
  return (
    <div>
      <Row>
        <Column xs="12">
          <Element className={beregningStyles.avsnittOverskrift}>
            <FormattedMessage id="Beregningsgrunnlag.Søknad.Tittel" />
          </Element>
        </Column>
      </Row>
      <VerticalSpacer eightPx />
      {Array.isArray(frisinnPerioder) && frisinnPerioder.map(periode => lagSøktYtelseRadPeriode(periode))}
      <VerticalSpacer sixteenPx />
    </div>
  );
};
Søknadsopplysninger.propTypes = {
  beregningsgrunnlag: beregningsgrunnlagPropType,
};

Søknadsopplysninger.defaultProps = {
  beregningsgrunnlag: undefined,
};

export default Søknadsopplysninger;
