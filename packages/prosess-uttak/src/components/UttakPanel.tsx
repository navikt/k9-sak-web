import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';
import Panel from 'nav-frontend-paneler';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';

const UttakPanel = ({ children }) => {
  return (
    <Panel>
      <Undertittel>
        <FormattedMessage id="UttakPanel.Title" />
      </Undertittel>
      <VerticalSpacer twentyPx />
      {children}
    </Panel>
  );
};

export default UttakPanel;
