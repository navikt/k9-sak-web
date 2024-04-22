import { FlexColumn, FlexContainer, FlexRow } from '@fpsak-frontend/shared-components';
import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import { SideMenu } from '@navikt/ft-plattform-komponenter';
import React, { ReactNode } from 'react';
import { WrappedComponentProps, injectIntl } from 'react-intl';
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
                <ExclamationmarkTriangleFillIcon
                  title={intl.formatMessage({ id: 'HelpText.Aksjonspunkt' })}
                  fontSize="1.5rem"
                  style={{ color: 'var(--ac-alert-icon-warning-color,var(--a-icon-warning))' }}
                />
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
