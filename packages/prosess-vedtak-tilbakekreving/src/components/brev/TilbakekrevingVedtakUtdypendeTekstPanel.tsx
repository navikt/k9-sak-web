import addCircleIcon from '@fpsak-frontend/assets/images/add-circle.svg';
import { behandlingFormValueSelector, TextAreaField } from '@fpsak-frontend/form';
import { Image, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { hasValidText, maxLength, minLength, required } from '@fpsak-frontend/utils';
import { Detail } from '@navikt/ds-react';
import React, { useState } from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';

import styles from './tilbakekrevingVedtakUtdypendeTekstPanel.module.css';

const minLength3 = minLength(3);
const maxLength4000 = maxLength(4000);

const valideringsregler = [minLength3, hasValidText];
const valideringsreglerPakrevet = [required, minLength3, hasValidText];

interface OwnProps {
  type: string;
  isEmpty: boolean;
  readOnly: boolean;
  fritekstPakrevet: boolean;
  maximumLength?: number;
}

export const TilbakekrevingVedtakUtdypendeTekstPanel = ({
  intl,
  isEmpty,
  type,
  readOnly,
  fritekstPakrevet,
  maximumLength,
}: OwnProps & WrappedComponentProps) => {
  const [isTextfieldHidden, hideTextField] = useState(isEmpty && !fritekstPakrevet);
  const valideringsRegler = fritekstPakrevet ? valideringsreglerPakrevet : valideringsregler;
  valideringsRegler.push(maximumLength ? maxLength(maximumLength) : maxLength4000);
  return (
    <>
      {isTextfieldHidden && !readOnly && (
        <>
          <VerticalSpacer eightPx />
          <button
            onClick={event => {
              event.preventDefault();
              hideTextField(false);
            }}
            onKeyDown={event => {
              event.preventDefault();
              hideTextField(false);
            }}
            className={styles.addPeriode}
            type="button"
          >
            <Image
              className={styles.addCircleIcon}
              src={addCircleIcon}
              alt={intl.formatMessage({ id: 'TilbakekrevingVedtakUtdypendeTekstPanel.LeggTilUtdypendeTekst' })}
            />
            <Detail className={styles.imageText}>
              <FormattedMessage id="TilbakekrevingVedtakUtdypendeTekstPanel.LeggTilUtdypendeTekst" />
            </Detail>
          </button>
        </>
      )}
      {!isTextfieldHidden && (
        <>
          <VerticalSpacer eightPx />
          <TextAreaField
            name={type}
            label={intl.formatMessage({ id: 'TilbakekrevingVedtakUtdypendeTekstPanel.UtdypendeTekst' })}
            validate={valideringsRegler}
            maxLength={maximumLength || 4000}
            readOnly={readOnly}
          />
        </>
      )}
    </>
  );
};

const mapStateToProps = (state: any, ownProps: any) => ({
  isEmpty:
    behandlingFormValueSelector(
      ownProps.formName,
      ownProps.behandlingId,
      ownProps.behandlingVersjon,
    )(state, ownProps.type) === undefined,
});

export default connect(mapStateToProps)(injectIntl(TilbakekrevingVedtakUtdypendeTekstPanel));
