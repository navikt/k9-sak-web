import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import React, { ReactNode } from 'react';
import styles from './vedtakForm.less';

interface PreviewLinkProps {
  previewCallback: (event: React.SyntheticEvent) => void;
  children: ReactNode;
}

const PreviewLink = ({ previewCallback, children }: PreviewLinkProps) => (
  <a
    href=""
    onClick={previewCallback}
    onKeyDown={e => (e.keyCode === 13 ? previewCallback(e) : null)}
    className={classNames(styles.previewLink, 'lenke lenke--frittstaende')}
  >
    {children}
  </a>
);

export const VedtakPreviewLink = ({ previewCallback }) => (
  <PreviewLink previewCallback={previewCallback}>
    <FormattedMessage id="VedtakForm.ForhandvisBrev" />
  </PreviewLink>
);

export default PreviewLink;
