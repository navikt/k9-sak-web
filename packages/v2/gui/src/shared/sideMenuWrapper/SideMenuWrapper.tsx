import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import { HStack } from '@navikt/ds-react';
import { SideMenu } from '@navikt/ft-plattform-komponenter';
import type { ReactNode } from 'react';
import styles from './sideMenuWrapper.module.css';

export interface FaktaPanelMenyRad {
  tekst: string;
  erAktiv: boolean;
  harAksjonspunkt: boolean;
}

interface OwnProps {
  paneler: FaktaPanelMenyRad[];
  onClick: (index: number) => void;
  children?: ReactNode;
}

export const SideMenuWrapper = ({ paneler, onClick, children }: OwnProps) => (
  <div className={styles.container}>
    <HStack gap="space-4">
      <SideMenu
        heading="Saksopplysninger"
        links={paneler.map(panel => ({
          label: panel.tekst,
          active: panel.erAktiv,
          icon: panel.harAksjonspunkt ? (
            <ExclamationmarkTriangleFillIcon
              fontSize="1.25rem"
              data-testid="sidemenu-aksjonspunkt-icon"
              style={{ color: 'var(--ax-text-warning-decoration)', fontSize: '1.25rem' }}
            />
          ) : undefined,
        }))}
        onClick={onClick}
      />
      <div className={styles.content}>{children}</div>
    </HStack>
  </div>
);
