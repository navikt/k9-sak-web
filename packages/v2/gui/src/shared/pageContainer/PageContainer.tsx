import { Alert, Loader } from '@navikt/ds-react';
import React, { useCallback } from 'react';
import styles from './pageContainer.module.css';

interface PageContainerProps {
  isLoading?: boolean;
  hasError?: boolean;
  preventUnmount?: boolean;
  children?: React.ReactNode;
}

export const PageContainer = (props: PageContainerProps): React.JSX.Element => {
  const { isLoading, hasError, preventUnmount, children } = props;
  const shouldRenderChildrenHidden = isLoading || hasError;

  const renderChildrenContent = useCallback(() => {
    if (preventUnmount) {
      return <div className={shouldRenderChildrenHidden ? styles.visuallyHidden : ''}>{children}</div>;
    }
    if (shouldRenderChildrenHidden) {
      return null;
    }
    return children;
  }, [preventUnmount, shouldRenderChildrenHidden, children]);

  return (
    <>
      {isLoading && <Loader size="large" />}
      {hasError && <Alert variant="error">Noe gikk galt, vennligst prøv igjen senere.</Alert>}
      {renderChildrenContent()}
    </>
  );
};
