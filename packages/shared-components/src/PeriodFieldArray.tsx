import addCircleIcon from '@k9-sak-web/assets/images/add-circle.svg';
import NavFieldGroup from '@k9-sak-web/form/src/NavFieldGroup';
import { Detail, HGrid } from '@navikt/ds-react';
import React from 'react';
import { FormattedMessage, IntlShape, injectIntl } from 'react-intl';
import { FieldArrayFieldsProps, FieldArrayMetaProps } from 'redux-form';
import Image from './Image';
import VerticalSpacer from './VerticalSpacer';
import styles from './periodFieldArray.module.css';

const onClick = (fields: FieldArrayFieldsProps<any>, emptyPeriodTemplate: EmptyPeriodTemplate) => () => {
  fields.push(emptyPeriodTemplate);
};

const onKeyDown =
  (fields: FieldArrayFieldsProps<any>, emptyPeriodTemplate: EmptyPeriodTemplate) =>
  ({ keyCode }) => {
    if (keyCode === 13) {
      fields.push(emptyPeriodTemplate);
    }
  };

const getRemoveButton = (index: number, fields: FieldArrayFieldsProps<any>) => className => {
  if (index > 0) {
    return (
      <button
        className={className || styles.buttonRemove}
        type="button"
        onClick={() => {
          fields.remove(index);
        }}
        data-testid="removeButton"
      />
    );
  }
  return undefined;
};

const showErrorMessage = (meta: FieldArrayMetaProps) => meta && meta.error && (meta.dirty || meta.submitFailed);

interface EmptyPeriodTemplate {
  periodeFom?: string;
  periodeTom?: string;
  fom?: string;
  tom?: string;
}

interface PeriodFieldArrayProps {
  intl: IntlShape;
  children: (
    periodeElementFieldId: string,
    index: number,
    getRemoveButton: (index?: number, fields?: FieldArrayFieldsProps<any>) => JSX.Element,
  ) => React.ReactNode;
  readOnly?: boolean;
  titleTextCode?: string;
  textCode?: string;
  emptyPeriodTemplate?: EmptyPeriodTemplate;
  shouldShowAddButton?: boolean;
  createAddButtonInsteadOfImageLink?: boolean;
  meta?: FieldArrayMetaProps;
  fields: FieldArrayFieldsProps<any>;
  fieldGroupClassName?: string;
}

/**
 * PeriodFieldArray
 *
 * Overbygg over FieldArray (Redux-form) som håndterer å legge til og fjerne perioder
 */
const PeriodFieldArray = ({
  intl,
  fields,
  readOnly,
  meta,
  titleTextCode,
  textCode,
  emptyPeriodTemplate,
  shouldShowAddButton,
  createAddButtonInsteadOfImageLink,
  children,
  fieldGroupClassName,
}: PeriodFieldArrayProps) => (
  <NavFieldGroup
    title={titleTextCode ? intl.formatMessage({ id: titleTextCode }) : undefined}
    errorMessage={showErrorMessage(meta) ? intl.formatMessage({ ...meta.error }) : null}
    className={fieldGroupClassName}
  >
    {fields.map((periodeElementFieldId, index) =>
      children(periodeElementFieldId, index, getRemoveButton(index, fields)),
    )}
    {shouldShowAddButton && (
      <HGrid gap="1" columns={{ xs: '12fr' }}>
        {!createAddButtonInsteadOfImageLink && !readOnly && (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events
          <div
            onClick={onClick(fields, emptyPeriodTemplate)}
            onKeyDown={onKeyDown(fields, emptyPeriodTemplate)}
            className={styles.addPeriode}
            role="button"
            tabIndex={0}
          >
            <Image className={styles.addCircleIcon} src={addCircleIcon} alt={intl.formatMessage({ id: textCode })} />
            <Detail className={styles.imageText}>
              <FormattedMessage id={textCode} />
            </Detail>
          </div>
        )}
        {createAddButtonInsteadOfImageLink && !readOnly && (
          <button type="button" onClick={onClick(fields, emptyPeriodTemplate)} className={styles.buttonAdd}>
            <FormattedMessage id={textCode} />
          </button>
        )}
        <VerticalSpacer sixteenPx />
      </HGrid>
    )}
  </NavFieldGroup>
);

PeriodFieldArray.defaultProps = {
  readOnly: true,
  titleTextCode: undefined,
  textCode: 'PeriodFieldArray.LeggTilPeriode',
  emptyPeriodTemplate: {
    periodeFom: '',
    periodeTom: '',
  },
  shouldShowAddButton: true,
  createAddButtonInsteadOfImageLink: false,
};

export default injectIntl(PeriodFieldArray);
