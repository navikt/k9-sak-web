import React from 'react';

import { KeyHorizontalIcon, KeyVerticalIcon } from '@navikt/aksel-icons';

import styles from './overstyringIkon.css';

interface OverstyringIkonProps {
  erOverstyrer: boolean;
  aktiv: boolean;
  toggleOverstyring: () => void;
}

const OverstyringIkon: React.FC<OverstyringIkonProps> = ({ erOverstyrer, toggleOverstyring }) => {
  if (erOverstyrer) {
    return (
      <a title="Overstyr" href="#" onClick={() => toggleOverstyring()} className={styles.overstyringNokkel}>
        <KeyHorizontalIcon title="Overstyr uttak" />
      </a>
    );
  }
  return <KeyHorizontalIcon title="Overstyr uttak" className={styles.overstyringNokkelInaktiv} />;
};

export default OverstyringIkon;
