import { Findout } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import classNames from 'classnames';
import React, { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import styles from './vedtakForm.less';

interface PreviewLinkProps {
  previewCallback: (event: React.SyntheticEvent) => void;
  children: ReactNode;
  noIcon?: boolean;
}

const PreviewLink = ({ previewCallback, children, noIcon }: PreviewLinkProps) => {
  if (noIcon) {
    return (
      <Button
        variant="tertiary"
        size="small"
        onClick={previewCallback}
        onKeyDown={e => (e.keyCode === 13 ? previewCallback(e) : null)}
        className={classNames(styles.previewLink, styles['previewLink--noIcon'])}
        type="button"
      >
        {children}
      </Button>
    );
  }
  return (
    <Button
      variant="tertiary"
      size="small"
      icon={<Findout aria-hidden />}
      onClick={previewCallback}
      onKeyDown={e => (e.keyCode === 13 ? previewCallback(e) : null)}
      className={classNames(styles.previewLink)}
      type="button"
    >
      {children}
    </Button>
  );
};

export const VedtakPreviewLink = ({ previewCallback }) => (
  <PreviewLink previewCallback={previewCallback}>
    <FormattedMessage id="VedtakForm.ForhandvisBrev" />
  </PreviewLink>
);

export default PreviewLink;
