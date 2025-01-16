import { ChevronDownIcon } from '@navikt/aksel-icons';
import { ActionMenu, Button } from '@navikt/ds-react';
import { useState } from 'react';
import { RawIntlProvider, createIntl, createIntlCache } from 'react-intl';
import messages from '../i18n/nb_NO.json';
import MenyData from './MenyData';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface OwnProps {
  data: MenyData[];
}

const MenySakIndex = ({ data }: OwnProps) => {
  const filtrertData = data.filter(d => d.erSynlig);
  const [valgtModal, setValgtModal] = useState(-1);

  return (
    <RawIntlProvider value={intl}>
      <ActionMenu>
        <ActionMenu.Trigger>
          <Button icon={<ChevronDownIcon aria-hidden />} iconPosition="right" variant="secondary" size="small">
            Behandlingsmeny
          </Button>
        </ActionMenu.Trigger>
        <ActionMenu.Content>
          {filtrertData.map((d, index) => (
            <ActionMenu.Item key={d.tekst} onClick={() => setValgtModal(index)} className="cursor-pointer">
              {d.tekst}
            </ActionMenu.Item>
          ))}
        </ActionMenu.Content>
      </ActionMenu>
      {valgtModal !== -1 && filtrertData[valgtModal].modal(() => setValgtModal(-1))}
    </RawIntlProvider>
  );
};

export default MenySakIndex;
