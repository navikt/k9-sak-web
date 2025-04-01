import classNames from 'classnames';
import React, { ReactNode, useState } from 'react';
import { FormattedMessage, IntlShape } from 'react-intl';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { FileSearchIcon } from '@navikt/aksel-icons';
import { Alert, Button } from '@navikt/ds-react';
import { validerRedigertHtml } from './FritekstRedigering/RedigeringUtils';

import styles from './vedtakForm.module.css';

interface PreviewLinkProps {
  previewCallback: (event: React.SyntheticEvent) => Promise<any>;
  redigertHtml?: string | boolean;
  children: ReactNode;
  noIcon?: boolean;
  size?: 'small' | 'medium' | 'xsmall';
  intl: IntlShape;
  loading: boolean;
}

const PreviewLink = ({
  previewCallback,
  redigertHtml = false,
  children,
  noIcon,
  size = 'small',
  intl,
  loading,
}: PreviewLinkProps) => {
  const [visValideringsFeil, setVisValideringsFeil] = useState<boolean>(false);
  const [isFetchingPreview, setIsFetchingPreview] = useState<boolean>(false);

  const handlePreviewRequest = async (e: React.SyntheticEvent) => {
    try {
      await previewCallback(e);
    } finally {
      setIsFetchingPreview(false);
    }
  };

  const onPreview = async e => {
    setIsFetchingPreview(true);
    if (!redigertHtml) {
      return handlePreviewRequest(e);
    }
    const validert = await validerRedigertHtml.isValid(redigertHtml);

    if (validert) {
      setVisValideringsFeil(false);
      return handlePreviewRequest(e);
    }
    setVisValideringsFeil(true);
    setIsFetchingPreview(false);
    return true;
  };

  return (
    <>
      {visValideringsFeil && (
        <>
          <Alert variant="error">
            {intl.formatMessage({ id: 'RedigeringAvFritekstBrev.ManueltBrevIkkeEndretForhåndsvis' })}{' '}
          </Alert>
          <VerticalSpacer sixteenPx />
        </>
      )}

      {noIcon && (
        <Button
          variant="tertiary"
          size={size}
          onClick={onPreview}
          className={classNames(styles.previewLink, styles['previewLink--noIcon'])}
          type="button"
          loading={loading || isFetchingPreview}
        >
          {children}
        </Button>
      )}

      {!noIcon && (
        <Button
          variant="tertiary"
          size={size}
          icon={<FileSearchIcon />}
          onClick={onPreview}
          onKeyDown={e => (e.keyCode === 13 ? previewCallback(e) : null)}
          className={classNames(styles.previewLink)}
          type="button"
          loading={loading || isFetchingPreview}
        >
          {children}
        </Button>
      )}
    </>
  );
};

export const VedtakPreviewLink = ({ previewCallback, redigertHtml, intl, loading }) => (
  <PreviewLink previewCallback={previewCallback} redigertHtml={redigertHtml} intl={intl} loading={loading}>
    <FormattedMessage id="VedtakForm.ForhandvisBrev" />
  </PreviewLink>
);

export default PreviewLink;
