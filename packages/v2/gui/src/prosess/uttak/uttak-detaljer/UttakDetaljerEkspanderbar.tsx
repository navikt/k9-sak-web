import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Link } from '@navikt/ds-react';
import { useState, type FC, type ReactNode } from 'react';

import styles from './uttakDetaljer.module.css';

interface UttakEkspanderbarProps {
  title: string;
  children: ReactNode;
}

const UttakDetaljerEkspanderbar: FC<UttakEkspanderbarProps> = ({ title, children }) => {
  const [utvid, setUtvid] = useState<boolean>(false);

  const toggleExpand = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    setUtvid(!utvid);
  };

  return (
    <Box.New className={styles.uttakDetaljerExpandableDetailItem}>
      <Box.New className={styles.uttakDetaljerExpandableDetailItemHeader}>
        <Link href="#" onClick={toggleExpand}>
          <div>
            <BodyShort className="my-auto" size="small">
              {title}
            </BodyShort>
            {!utvid ? <ChevronDownIcon /> : <ChevronUpIcon />}
          </div>
        </Link>
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
