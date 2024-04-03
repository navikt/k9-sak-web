import MenySakIndex, { MenyData } from '@fpsak-frontend/sak-meny';
import { Modal } from '@navikt/ds-react';
import { withKnobs } from '@storybook/addon-knobs';
import React, { useState } from 'react';

export default {
  title: 'sak/sak-meny',
  component: MenySakIndex,
  decorators: [withKnobs],
};

export const visMenyMedToHandlinger = () => {
  const [isOpen, setOpen] = useState(true);
  return (
    <MenySakIndex
      data={[
        new MenyData(true, 'Sett behandling på vent').medModal(() => (
          <Modal open={isOpen} aria-label="Sett behandling på vent" onClose={() => setOpen(false)}>
            Sett behandling på vent
          </Modal>
        )),
        new MenyData(true, 'Lag ny behandling').medModal(() => (
          <Modal open={isOpen} aria-label="Sett behandling på vent" onClose={() => setOpen(false)}>
            Lag ny behandling
          </Modal>
        )),
      ]}
    />
  );
};
