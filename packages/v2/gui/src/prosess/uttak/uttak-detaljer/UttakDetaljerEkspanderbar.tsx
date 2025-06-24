import { useState } from 'react';
import { BodyShort, Box } from '@navikt/ds-react';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';

import styles from './uttakDetaljer.module.css';

interface UttakEkspanderbarProps {
  title: string;
  children: React.ReactNode;
}

const UttakDetaljerEkspanderbar: React.FC<UttakEkspanderbarProps> = ({ title, children }) => {
  const [utvid, setUtvid] = useState<boolean>(false);

  const toggleExpand = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    setUtvid(!utvid);
  };

  return (
    <Box className={styles.uttakDetaljerExpandableDetailItem}>
      <Box className={styles.uttakDetaljerExpandableDetailItemHeader}>
        <a href="#" onClick={toggleExpand}>
          <div>
            <BodyShort className="my-auto" size="small">
              {title}
            </BodyShort>
            {!utvid ? <ChevronDownIcon /> : <ChevronUpIcon />}
          </div>
        </a>
      </Box>
      <div
        className={`uttakDetaljerExpandableDetailItem__content ${
          utvid ? '' : styles.uttakDetaljerExpandableDetailItemContentCollapsed
        }`}
      >
        {children}
      </div>
    </Box>
  );
};

export default UttakDetaljerEkspanderbar;
