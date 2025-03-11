import { Modal } from '@navikt/ds-react';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import MenyData from './MenyData';
import MenySakIndex from './MenySakIndex';

const meta = {
  title: 'gui/sak/meny/ta-av-vent',
  component: MenySakIndex,
} satisfies Meta<typeof MenySakIndex>;

export default meta;

export const VisMenyMedToHandlinger: StoryObj<typeof MenySakIndex> = {
  render: () => {
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
  },
};
