import { Box, LabelledContent, Margin } from '@navikt/ft-plattform-komponenter';
import { PeopleFilled } from '@navikt/ds-icons';
import React from 'react';

import { ReisetidVurdering } from './ReisetidTypes';
import styles from './beskrivelseFraSoeker.modules.css';

interface OwnProps {
  vurdering: ReisetidVurdering;
}

const BeskrivelseFraSoeker = ({ vurdering }: OwnProps) => {
  if (!vurdering.perioderFraSoeknad.beskrivelseFraSoeker) {
    return null;
  }
  return (
    <Box marginTop={Margin.xLarge}>
      <div className={styles.container}>
        <div>
          <PeopleFilled style={{ fontSize: '24px' }} />
        </div>
        <LabelledContent
          label="Beskrivelse fra søker for reisetid i perioden 11.06.2021 - 13.06.2021"
          content={vurdering.perioderFraSoeknad.beskrivelseFraSoeker}
        />
      </div>
    </Box>
  );
};

export default BeskrivelseFraSoeker;
