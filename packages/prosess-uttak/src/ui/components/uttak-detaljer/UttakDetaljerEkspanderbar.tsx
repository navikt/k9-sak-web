import { useState } from 'react';
import styles from './nyUttakDetaljer.module.css';
import { BodyShort, Box } from '@navikt/ds-react';
import { ChevronDownIcon } from '@navikt/aksel-icons';

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
    <Box className={styles.uttakDetaljer__expandableDetailItem}>
      <Box className={styles.uttakDetaljer__expandableDetailItem__header}>
        <a href="#" onClick={toggleExpand}>
          <div>
            <BodyShort size="small" as="span">
              {title}
            </BodyShort>
            <ChevronDownIcon />
          </div>
        </a>
      </Box>
      <div
        className={`uttakDetaljer__expandableDetailItem__content ${
          utvid ? '' : styles.uttakDetaljer__expandableDetailItem__contentCollapsed
        }`}
      >
        {children}
      </div>
    </Box>
  );
};

export default UttakDetaljerEkspanderbar;
