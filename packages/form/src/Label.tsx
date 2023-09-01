import classnames from 'classnames/bind';
import { TypografiProps, Undertekst } from 'nav-frontend-typografi';
import React from 'react';
import { WrappedComponentProps, injectIntl } from 'react-intl';
import LabelType from './LabelType';
import styles from './label.css';

const classNames = classnames.bind(styles);

interface LabelProps {
  input?: LabelType;
  typographyElement?: React.ComponentType<TypografiProps>;
  readOnly?: boolean;
}

export const Label = (props: LabelProps & WrappedComponentProps) => {
  const format = label => {
    if (label && label.id) {
      const { intl } = props;
      return intl.formatMessage({ id: label.id }, label.args);
    }
    return label;
  };

  const { input, readOnly, typographyElement: TypoElem } = props;
  if (!input) {
    return null;
  }
  return (
    <span className={classNames('labelWrapper', { readOnly })}>
      <TypoElem tag="span" className={styles.label}>
        {format(input)}
      </TypoElem>
    </span>
  );
};

Label.defaultProps = {
  input: null,
  typographyElement: Undertekst,
  readOnly: false,
};

export default injectIntl(Label);
