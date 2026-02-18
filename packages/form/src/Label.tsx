import { BodyShortProps, Label as DSLabel, LabelProps, OverridableComponent } from '@navikt/ds-react';
import classnames from 'classnames/bind';
import React from 'react';
import { WrappedComponentProps, injectIntl } from 'react-intl';
import LabelType from './LabelType';
import styles from './label.module.css';

const classNames = classnames.bind(styles);

interface Props {
  input?: LabelType;
  typographyElement?: OverridableComponent<LabelProps | BodyShortProps, HTMLLabelElement | HTMLParagraphElement>;
  readOnly?: boolean;
  textOnly?: boolean;
}

export const Label = (props: Props & WrappedComponentProps) => {
  const format = label => {
    if (label && label.id) {
      const { intl } = props;
      return intl.formatMessage({ id: label.id }, label.args);
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

export default injectIntl(Label);
