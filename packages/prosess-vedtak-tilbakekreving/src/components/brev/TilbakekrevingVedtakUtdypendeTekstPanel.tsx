import React, { FunctionComponent, useState } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { Undertekst } from 'nav-frontend-typografi';

import addCircleIcon from '@fpsak-frontend/assets/images/add-circle.svg';
import { required, hasValidText, maxLength, minLength } from '@fpsak-frontend/utils';
import { TextAreaField, behandlingFormValueSelector } from '@fpsak-frontend/form';
import { Image, VerticalSpacer } from '@fpsak-frontend/shared-components';

import styles from './tilbakekrevingVedtakUtdypendeTekstPanel.less';

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

export const TilbakekrevingVedtakUtdypendeTekstPanel: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  isEmpty,
  type,
  readOnly,
  fritekstPakrevet,
  maximumLength,
}) => {
  const [isTextfieldHidden, hideTextField] = useState(isEmpty && !fritekstPakrevet);
  const valideringsRegler = fritekstPakrevet ? valideringsreglerPakrevet : valideringsregler;
  valideringsRegler.push(maximumLength ? maxLength(maximumLength) : maxLength4000);
  return (
    <>
      {isTextfieldHidden && !readOnly && (
        <>
          <VerticalSpacer eightPx />
          <div
            onClick={event => {
              event.preventDefault();
              hideTextField(false);
            }}
            onKeyDown={event => {
              event.preventDefault();
              hideTextField(false);
            }}
            className={styles.addPeriode}
            role="button"
            tabIndex={0}
          >
            <Image
              className={styles.addCircleIcon}
              src={addCircleIcon}
              alt={intl.formatMessage({ id: 'TilbakekrevingVedtakUtdypendeTekstPanel.LeggTilUtdypendeTekst' })}
            />
            <Undertekst className={styles.imageText}>
              <FormattedMessage
                className={styles.text}
                id="TilbakekrevingVedtakUtdypendeTekstPanel.LeggTilUtdypendeTekst"
              />
            </Undertekst>
          </div>
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
