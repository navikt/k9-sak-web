import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { Fieldset } from 'nav-frontend-skjema';

import {
  BorderBox, FlexContainer, FlexColumn, FlexRow,
} from '@fpsak-frontend/shared-components';
import { TextAreaField, RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import { maxLength as maxLengthValidator, hasValidText, required } from '@fpsak-frontend/utils';

import styles from './tilleggsopplysningerPanel.less';

const maxLength = 1500;
const validate = [maxLengthValidator(maxLength), hasValidText];

const localfeatureToggle = false;

const sprakvalg = {
  BOKMAL: 'BOKMAL',
  NYNORSK: 'NYNORSK',
  ENGELSK: 'ENGELSK',
};

/**
 * Presentasjonskomponent. Komponenten vises som del av skjermbildet for registrering av papirsøknad dersom søknad gjelder engangsstønad.
 * Komponenten har inputfelter og må derfor rendres som etterkommer av komponent dekorert med reduxForm.
 */

export const TilleggsopplysningerPanel = ({
  readOnly,
  intl,
}) => (
  <BorderBox>
    <FlexContainer>
      <FlexRow>
        <FlexColumn className={styles.halfWidth}>
          <Fieldset legend={intl.formatMessage({ id: 'Registrering.SokerensTilleggsopplysninger' })}>
            <TextAreaField
              name="tilleggsopplysninger"
              label=""
              maxLength={maxLength}
              validate={validate}
              readOnly={readOnly}
            />
          </Fieldset>
        </FlexColumn>
        {localfeatureToggle
        && (
        <FlexColumn>
          <Fieldset legend={intl.formatMessage({ id: 'Registrering.Sprak' })}>
            <RadioGroupField
              name="sprakvalg"
              direction="vertical"
              readOnly={readOnly}
              validate={required}
            >
              <RadioOption
                label={intl.formatMessage({ id: 'Registrering.Sprak.Bokmal' })}
                value={sprakvalg.BOKMAL}
              />
              <RadioOption
                label={intl.formatMessage({ id: 'Registrering.Sprak.Nynorsk' })}
                value={sprakvalg.NYNORSK}
              />
              <RadioOption
                label={intl.formatMessage({ id: 'Registrering.Sprak.Engelsk' })}
                value={sprakvalg.ENGELSK}
              />
            </RadioGroupField>
          </Fieldset>
        </FlexColumn>
        )}
      </FlexRow>
    </FlexContainer>
  </BorderBox>
);

TilleggsopplysningerPanel.propTypes = {
  intl: intlShape.isRequired,
  readOnly: PropTypes.bool.isRequired,
};

export default injectIntl(TilleggsopplysningerPanel);
