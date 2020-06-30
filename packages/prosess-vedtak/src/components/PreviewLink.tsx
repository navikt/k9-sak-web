import classNames from 'classnames';
import React, { ReactNode } from 'react';
import styles from './vedtakForm.less';

interface PreviewLinkProps {
  previewCallback: (params: any) => void;
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

export default PreviewLink;
