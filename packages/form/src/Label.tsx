import { BodyShortProps, Label as DSLabel, LabelProps, OverridableComponent } from '@navikt/ds-react';
import classnames from 'classnames/bind';
import React from 'react';
import LabelType from './LabelType';
import styles from './label.module.css';

const classNames = classnames.bind(styles);

interface Props {
  input?: LabelType | string;
  typographyElement?: OverridableComponent<LabelProps | BodyShortProps, HTMLLabelElement | HTMLParagraphElement>;
  readOnly?: boolean;
  textOnly?: boolean;
  // Deprecated: intl prop is no longer used
  intl?: any;
}

export const Label = (props: Props) => {
  const { input = null, readOnly = false, typographyElement: TypoElem = DSLabel, textOnly } = props;
  
  if (!input) {
    return null;
  }
  
  // Support both string input and LabelType object for backwards compatibility
  const text = typeof input === 'string' ? input : input.id || '';
  
  if (textOnly) {
    return text;
  }
  
  return (
    <span className={classNames('labelWrapper', { readOnly })}>
      <TypoElem as="span" className={styles.label} size="small">
        {text}
      </TypoElem>
    </span>
  );
};

export default Label;
