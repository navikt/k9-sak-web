import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { BodyShort, Box } from '@navikt/ds-react';
import { useState } from 'react';

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
    <Box.New className={styles.uttakDetaljerExpandableDetailItem}>
      <Box.New className={styles.uttakDetaljerExpandableDetailItemHeader}>
        <a href="#" onClick={toggleExpand}>
          <div>
            <BodyShort className="my-auto" size="small">
              {title}
            </BodyShort>
            {!utvid ? <ChevronDownIcon /> : <ChevronUpIcon />}
          </div>
        </a>
      </Box.New>
      <div
        className={`uttakDetaljerExpandableDetailItemContent ${
          utvid ? '' : styles.uttakDetaljerExpandableDetailItemContentCollapsed
        }`}
      >
        {children}
      </div>
    </Box.New>
  );
};

export default UttakDetaljerEkspanderbar;
