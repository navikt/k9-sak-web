import addCircleIcon from '@fpsak-frontend/assets/images/add-circle.svg';
import NavFieldGroup from '@fpsak-frontend/form/src/NavFieldGroup';
import { Column, Row } from 'nav-frontend-grid';
import { Undertekst } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { FieldArrayFieldsProps, FieldArrayMetaProps } from 'redux-form';
import Image from './Image';
import VerticalSpacer from './VerticalSpacer';
import styles from './selectFieldArray.module.css';

interface EmptySelectTemplate {
  value: string;
}

interface SelectFieldArrayProps {
  children: (
    selectElementFieldId: string,
    index: number,
    getRemoveButton: (index: number, fields: JSX.Element) => void,
  ) => void;
  fields: FieldArrayFieldsProps<EmptySelectTemplate>;
  readOnly?: boolean;
  meta?: FieldArrayMetaProps;
  titleTextCode?: string;
  textCode?: string;
  emptySelectTemplate?: EmptySelectTemplate;
  shouldShowAddButton?: boolean;
  createAddButtonInsteadOfImageLink?: boolean;
}

const onClick =
  (fields: FieldArrayFieldsProps<EmptySelectTemplate>, emptySelectTemplate: EmptySelectTemplate) => () => {
    fields.push(emptySelectTemplate);
  };

const onKeyDown =
  (fields: FieldArrayFieldsProps<EmptySelectTemplate>, emptySelectTemplate: EmptySelectTemplate) =>
  ({ keyCode }) => {
    if (keyCode === 13) {
      fields.push(emptySelectTemplate);
    }
  };

const getRemoveButton = (index: number, fields: FieldArrayFieldsProps<EmptySelectTemplate>) => className => {
  if (index > 0) {
    return (
      <button
        className={className || styles.buttonRemove}
        type="button"
        onClick={() => {
          fields.remove(index);
        }}
      />
    );
  }
  return undefined;
};

const showErrorMessage = meta => meta && meta.error && (meta.dirty || meta.submitFailed);

/**
 * SelectFieldArray
 *
 * Overbygg over FieldArray (Redux-form) som håndterer å legge til og fjerne perioder
 */
const SelectFieldArray = ({
  fields,
  readOnly,
  meta,
  titleTextCode,
  textCode,
  emptySelectTemplate,
  shouldShowAddButton,
  createAddButtonInsteadOfImageLink,
  children,
}: SelectFieldArrayProps) => {
  const intl = useIntl();
  return (
    <NavFieldGroup
      title={titleTextCode ? intl.formatMessage({ id: titleTextCode }) : undefined}
      // @ts-ignore Fikse denne
      errorMessage={showErrorMessage(meta) ? intl.formatMessage(...meta.error) : null}
    >
      {fields.map((selectElementFieldId, index) =>
        children(selectElementFieldId, index, getRemoveButton(index, fields)),
      )}
      {shouldShowAddButton && (
        <Row className="">
          <Column xs="12">
            {!createAddButtonInsteadOfImageLink && !readOnly && (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events
              <div
                onClick={onClick(fields, emptySelectTemplate)}
                onKeyDown={onKeyDown(fields, emptySelectTemplate)}
                className={styles.addSelect}
                role="button"
                tabIndex={0}
              >
                <Image
                  className={styles.addCircleIcon}
                  src={addCircleIcon}
                  alt={intl.formatMessage({ id: textCode })}
                />
                <Undertekst className={styles.imageText}>
                  <FormattedMessage id={textCode} />
                </Undertekst>
              </div>
            )}
            {createAddButtonInsteadOfImageLink && !readOnly && (
              <button type="button" onClick={onClick(fields, emptySelectTemplate)} className={styles.buttonAdd}>
                <FormattedMessage id={textCode} />
              </button>
            )}
            <VerticalSpacer sixteenPx />
          </Column>
        </Row>
      )}
    </NavFieldGroup>
  );
};

SelectFieldArray.defaultProps = {
  readOnly: true,
  titleTextCode: undefined,
  meta: undefined,
  textCode: 'SelectFieldArray.LeggTilSelect',
  emptySelectTemplate: { value: '' },
  shouldShowAddButton: true,
  createAddButtonInsteadOfImageLink: false,
};

export default SelectFieldArray;
