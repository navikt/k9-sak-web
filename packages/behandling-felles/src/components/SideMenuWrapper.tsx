import { SideMenu } from '@navikt/ft-plattform-komponenter';
import React, { ReactNode } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';

import advarselIkonUrl from '@fpsak-frontend/assets/images/advarsel_ny.svg';
import { FlexColumn, FlexContainer, FlexRow, Image } from '@fpsak-frontend/shared-components';

import FaktaPanelMenyRad from '../types/faktaPanelMenyRadTsType';

import styles from './sideMenuWrapper.module.css';

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
              label: intl.formatMessage({ id: panel.tekstKode }),
              active: panel.erAktiv,
              icon: panel.harAksjonspunkt ? (
                <Image src={advarselIkonUrl} alt={intl.formatMessage({ id: 'HelpText.Aksjonspunkt' })} />
              ) : undefined,
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
