import React, { ReactNode } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { SideMenu } from '@navikt/k9-react-components';

import { FlexColumn, FlexContainer, FlexRow } from '@fpsak-frontend/shared-components';
import advarselIkonUrl from '@fpsak-frontend/assets/images/advarsel_ny.svg';

import FaktaPanelMenyRad from '../types/faktaPanelMenyRadTsType';

import styles from './sideMenuWrapper.less';

interface OwnProps {
  paneler: FaktaPanelMenyRad[];
  onClick?: (index: number) => void;
  children?: ReactNode;
}

const SideMenuWrapper = ({ intl, paneler, onClick, children }: OwnProps & WrappedComponentProps) => (
  <div className={styles.container}>
    <FlexContainer fullHeight>
      <FlexRow>
        <FlexColumn className={styles.sideMenu}>
          <SideMenu
            heading={intl.formatMessage({ id: 'MainSideMenu.Heading' })}
            links={paneler.map(panel => ({
              label: panel.tekst,
              active: panel.erAktiv,
              iconSrc: panel.harAksjonspunkt ? advarselIkonUrl : undefined,
              iconAltText: panel.harAksjonspunkt ? intl.formatMessage({ id: 'HelpText.Aksjonspunkt' }) : undefined,
            }))}
            onClick={onClick}
          />
        </FlexColumn>
        <FlexColumn className={styles.content}>{children}</FlexColumn>
      </FlexRow>
    </FlexContainer>
  </div>
);

export default injectIntl(SideMenuWrapper);
