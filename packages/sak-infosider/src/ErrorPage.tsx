import React from 'react';

import ErrorPageWrapper from './components/ErrorPageWrapper';

const ErrorPage = ({ textCode }: { textCode?: string }) => (
  <ErrorPageWrapper titleCode={textCode || 'ErrorPage.Header'}>
    <br />
  </ErrorPageWrapper>
);

export default ErrorPage;
