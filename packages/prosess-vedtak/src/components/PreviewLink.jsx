import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import React from 'react';
import PropTypes from 'prop-types';
import styles from './vedtakForm.less';

const PreviewLink = ({ previewCallback }) => (
  <a
    href=""
    onClick={previewCallback}
    onKeyDown={e => (e.keyCode === 13 ? previewCallback(e) : null)}
    className={classNames(styles.previewLink, 'lenke lenke--frittstaende')}
  >
    <FormattedMessage id="VedtakForm.AutomatiskBrev.Lenke" />
  </a>
);

PreviewLink.propTypes = {
  previewCallback: PropTypes.func.isRequired,
};

export default PreviewLink;
