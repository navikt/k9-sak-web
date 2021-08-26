import React from 'react';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import { required } from '@fpsak-frontend/utils';
import { createVisningsnavnForAktivitet } from '@fpsak-frontend/fakta-beregning/src/components/ArbeidsforholdHelper';

import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';

const { VURDER_REFUSJONSKRAV_SOM_HAR_KOMMET_FOR_SENT } = faktaOmBeregningTilfelle;

const erRefusjonskravGyldigFieldPrefix = 'erKravGyldig_';

export const lagFieldName = arbeidsgiverVisningsnavn =>
  erRefusjonskravGyldigFieldPrefix + arbeidsgiverVisningsnavn.replace('.', '');

const lagRefusjonskravRadios = (senRefusjonkravListe, readOnly, isAvklaringsbehovClosed, fieldArrayID) =>
  senRefusjonkravListe.map(kravPerArbeidsgiver => {
    const arbeidsgiverVisningsnavn = createVisningsnavnForAktivitet(kravPerArbeidsgiver);
    return (
      <React.Fragment key={arbeidsgiverVisningsnavn}>
        <VerticalSpacer twentyPx />
        <FormattedMessage
          id="VurderRefusjonForm.ErRefusjonskravGyldig"
          values={{
            arbeidsgiverVisningsnavn,
          }}
        />
        <VerticalSpacer eightPx />
        <RadioGroupField
          name={`${fieldArrayID}.${lagFieldName(arbeidsgiverVisningsnavn)}`}
          validate={[required]}
          readOnly={readOnly}
          isEdited={isAvklaringsbehovClosed}
        >
          <RadioOption label={<FormattedMessage id="BeregningInfoPanel.FormAlternativ.Ja" />} value />
          <RadioOption label={<FormattedMessage id="BeregningInfoPanel.FormAlternativ.Nei" />} value={false} />
        </RadioGroupField>
      </React.Fragment>
    );
  });

/**
 * VurderRefusjonForm
 *
 * Container komponent. Har ansvar for å sette opp Redux Formen for vurdering av refusjonskrav som har kommet for sent.
 */
export const VurderRefusjonFormImpl = ({ readOnly, isAvklaringsbehovClosed, senRefusjonkravListe, fieldArrayID }) =>
  lagRefusjonskravRadios(senRefusjonkravListe, readOnly, isAvklaringsbehovClosed, fieldArrayID);

VurderRefusjonFormImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  isAvklaringsbehovClosed: PropTypes.bool.isRequired,
  senRefusjonkravListe: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  fieldArrayID: PropTypes.string.isRequired,
};

VurderRefusjonFormImpl.transformValues = arbeidsgiverListe => values => {
  if (!arbeidsgiverListe || arbeidsgiverListe.length === 0) {
    return {};
  }
  return {
    refusjonskravGyldighet: arbeidsgiverListe.map(({ arbeidsgiverId, arbeidsgiverVisningsnavn }) => ({
      arbeidsgiverId,
      skalUtvideGyldighet: values ? values[lagFieldName(arbeidsgiverVisningsnavn)] : undefined,
    })),
  };
};

VurderRefusjonFormImpl.buildInitialValues = (tilfeller, arbeidsgiverListe) => {
  const initialValues = {};
  if (!tilfeller.includes(VURDER_REFUSJONSKRAV_SOM_HAR_KOMMET_FOR_SENT) || arbeidsgiverListe.length === 0) {
    return initialValues;
  }
  arbeidsgiverListe.forEach(({ arbeidsgiverVisningsnavn, erRefusjonskravGyldig }) => {
    initialValues[lagFieldName(arbeidsgiverVisningsnavn)] = erRefusjonskravGyldig;
  });
  return {
    ...initialValues,
  };
};

export const getArbeidsgiverInfoForRefusjonskravSomKommerForSent = createSelector(
  [ownProps => ownProps.faktaOmBeregning],
  (faktaOmBeregning = {}) => {
    if (faktaOmBeregning && faktaOmBeregning.refusjonskravSomKommerForSentListe) {
      return faktaOmBeregning.refusjonskravSomKommerForSentListe;
    }
    return [];
  },
);

const mapStateToPropsFactory = (state, ownProps) => ({
  senRefusjonkravListe: getArbeidsgiverInfoForRefusjonskravSomKommerForSent(ownProps),
});

const VurderRefusjonForm = connect(mapStateToPropsFactory)(VurderRefusjonFormImpl);

export default VurderRefusjonForm;
