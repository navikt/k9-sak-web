import { ChevronDownIcon } from '@navikt/aksel-icons';
import { ActionMenu, Button } from '@navikt/ds-react';
import { useState } from 'react';
import MenyData from './MenyData';

interface OwnProps {
  data: MenyData[];
}

export const MenySakIndex = ({ data }: OwnProps) => {
  const filtrertData = data.filter(d => d.erSynlig);
  const [valgtModal, setValgtModal] = useState(-1);

  return (
    <>
      <ActionMenu>
        <ActionMenu.Trigger>
          <Button size="small" variant="secondary-neutral" icon={<ChevronDownIcon aria-hidden />} iconPosition="right">
            Behandlingsmeny
          </Button>
        </ActionMenu.Trigger>
        <ActionMenu.Content>
          {filtrertData.map((d, index) => (
            <ActionMenu.Item
              key={d.tekst}
              onSelect={() => {
                setValgtModal(index);
              }}
            >
              {d.tekst}
            </ActionMenu.Item>
          ))}
        </ActionMenu.Content>
      </ActionMenu>
      {valgtModal !== -1 && filtrertData[valgtModal]?.modal(() => setValgtModal(-1))}
    </>
  );
};

export default MenySakIndex;
