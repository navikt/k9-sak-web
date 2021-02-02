import React from 'react';
import { formatCurrencyNoKr, removeSpacesFromNumber } from '@fpsak-frontend/utils';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';
import { FieldArray } from 'redux-form';
import { BorderBox } from '@fpsak-frontend/shared-components';
import { Column, Row } from 'nav-frontend-grid';
import BrukersAndelFieldArray from './BrukersAndelFieldArray';
import { setGenerellAndelsinfo } from '../BgFordelingUtils';

const { FASTSETT_BG_KUN_YTELSE } = faktaOmBeregningTilfelle;
export const brukersAndelFieldArrayName = 'brukersAndelBG';
export const setFaktaPanelForKunYtelse = (
  faktaPanels,
  tilfeller,
  readOnly,
  isAksjonspunktClosed,
  behandlingId,
  behandlingVersjon,
  alleKodeverk,
  fieldArrayID,
) => {
  if (tilfeller.includes(FASTSETT_BG_KUN_YTELSE)) {
    faktaPanels.push(
      <React.Fragment key="FASTSETT_BG_KUN_YTELSE">
        <BorderBox>
          <Row>
            <Column xs="9">
              <Element>
                <FormattedMessage id="KunYtelsePanel.Overskrift" />
              </Element>
            </Column>
          </Row>
          <FieldArray
            name={`${fieldArrayID}.${brukersAndelFieldArrayName}`}
            component={BrukersAndelFieldArray}
            readOnly={readOnly}
            isAksjonspunktClosed={isAksjonspunktClosed}
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
            alleKodeverk={alleKodeverk}
          />
        </BorderBox>
      </React.Fragment>,
    );
  }
};

const transformValues = values => ({
  kunYtelseFordeling: {
    andeler: values[brukersAndelFieldArrayName].map(fieldValue => ({
      andelsnr: fieldValue.andelsnr,
      fastsattBeløp: removeSpacesFromNumber(fieldValue.fastsattBelop),
      inntektskategori: fieldValue.inntektskategori,
      nyAndel: fieldValue.nyAndel,
      lagtTilAvSaksbehandler: fieldValue.lagtTilAvSaksbehandler,
    })),
  },
});

export const transformValuesForKunYtelse = (values, tilfeller) => {
  if (tilfeller.includes(FASTSETT_BG_KUN_YTELSE)) {
    return {
      faktaOmBeregningTilfeller: [FASTSETT_BG_KUN_YTELSE],
      ...transformValues(values),
    };
  }
  return {};
};

const validate = (values, aktivertePaneler) => {
  if (!values || !aktivertePaneler.includes(faktaOmBeregningTilfelle.FASTSETT_BG_KUN_YTELSE)) {
    return {};
  }
  const errors = {};
  errors[brukersAndelFieldArrayName] = BrukersAndelFieldArray.validate(values[brukersAndelFieldArrayName]);
  return errors;
};

export const getKunYtelseValidation = (values, aktivertePaneler) => {
  if (aktivertePaneler.includes(FASTSETT_BG_KUN_YTELSE)) {
    return validate(values, aktivertePaneler);
  }
  return {};
};

const buildInitialValues = (kunYtelse, faktaOmBeregningAndeler) => {
  if (!kunYtelse || !kunYtelse.andeler || kunYtelse.andeler.length === 0) {
    return {};
  }
  const initialValues = {
    [brukersAndelFieldArrayName]: kunYtelse.andeler.map(andel => {
      const andelMedInfo = faktaOmBeregningAndeler.find(faktaAndel => faktaAndel.andelsnr === andel.andelsnr);
      return {
        ...setGenerellAndelsinfo(andelMedInfo),
        fastsattBelop:
          andel.fastsattBelopPrMnd || andel.fastsattBelopPrMnd === 0
            ? formatCurrencyNoKr(andel.fastsattBelopPrMnd)
            : '',
      };
    }),
  };
  return initialValues;
};

export const buildInitialValuesKunYtelse = (kunYtelse, tilfeller, faktaOmBeregningAndeler) => {
  if (tilfeller && tilfeller.includes(FASTSETT_BG_KUN_YTELSE)) {
    return buildInitialValues(kunYtelse, faktaOmBeregningAndeler);
  }
  return {};
};
