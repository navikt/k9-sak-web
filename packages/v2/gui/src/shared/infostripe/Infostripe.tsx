import { BodyShort, HStack } from '@navikt/ds-react';
import type React from 'react';
import type { JSX } from 'react';
import styles from './infostripe.module.css';

interface InfostripeProps {
  iconRenderer: () => React.ReactNode;
  content: string | JSX.Element;
}

export const Infostripe = ({ content, iconRenderer }: InfostripeProps) => (
  <div className={styles.infostripe}>
    <HStack gap="space-8" align="center">
      <div className={styles.iconContainer}>{iconRenderer()}</div>
      {typeof content === 'string' ? <BodyShort>{content}</BodyShort> : content}
    </HStack>
  </div>
);
