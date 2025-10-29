import { BodyShortProps, Label as DSLabel, LabelProps, OverridableComponent } from '@navikt/ds-react';
import classnames from 'classnames/bind';
import React from 'react';
import LabelType from './LabelType';
import styles from './label.module.css';
import { translations } from './translations';

const classNames = classnames.bind(styles);

interface Props {
  input?: LabelType;
  typographyElement?: OverridableComponent<LabelProps | BodyShortProps, HTMLLabelElement | HTMLParagraphElement>;
  readOnly?: boolean;
  textOnly?: boolean;
  // Deprecated: intl prop is no longer used
  intl?: any;
}

export const Label = (props: Props) => {
  const format = label => {
    if (label && label.id) {
      // Look up translation by id
      const translation = translations[label.id];
      if (translation) {
        // Simple template replacement for args
        if (label.args) {
          let result = translation;
          Object.keys(label.args).forEach(key => {
            result = result.replace(`{${key}}`, label.args[key]);
          });
          return result;
        }
        return translation;
      }
      // Fallback to id if translation not found
      return label.id;
    }
    return label;
  };

  const { input = null, readOnly = false, typographyElement: TypoElem = DSLabel, textOnly } = props;
  if (!input) {
    return null;
  }
  if (textOnly) {
    return format(input);
  }
  return (
    <span className={classNames('labelWrapper', { readOnly })}>
      <TypoElem as="span" className={styles.label} size="small">
        {format(input)}
      </TypoElem>
    </span>
  );
};

export default Label;
