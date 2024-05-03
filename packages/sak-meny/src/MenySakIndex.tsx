import closedImage from '@k9-sak-web/assets/images/pil_ned.svg';
import openImage from '@k9-sak-web/assets/images/pil_opp.svg';
import { Image } from '@k9-sak-web/shared-components';
import { Button } from '@navikt/ds-react';
import { BoxedListWithSelection, Popover } from '@navikt/ft-plattform-komponenter';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FormattedMessage, RawIntlProvider, createIntl, createIntlCache } from 'react-intl';
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

  const [visMenySomApen, setVisMenyTilApen] = useState(false);
  const toggleMenyVisning = useCallback(() => setVisMenyTilApen(!visMenySomApen), [visMenySomApen]);

  const [valgtModal, setValgtModal] = useState(-1);

  const menyRef = useRef(null);
  const handleClickOutside = event => {
    if (menyRef.current && !menyRef.current.contains(event.target)) {
      toggleMenyVisning();
    }
  };
  useEffect(() => {
    if (visMenySomApen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visMenySomApen]);

  return (
    <RawIntlProvider value={intl}>
      <div ref={menyRef}>
        <Popover
          popperIsVisible={visMenySomApen}
          renderArrowElement={false}
          customPopperStyles={{ top: '2px', zIndex: 1 }}
          popperProps={{
            children: () => (
              <BoxedListWithSelection
                items={filtrertData.map(d => ({
                  name: d.tekst,
                }))}
                onClick={index => {
                  setValgtModal(index);
                  toggleMenyVisning();
                }}
              />
            ),
            placement: 'bottom-start',
            strategy: 'absolute',
          }}
          referenceProps={{
            children: ({ ref }) => (
              <div ref={ref}>
                <Button variant="secondary" size="small" onClick={toggleMenyVisning}>
                  <FormattedMessage id="MenySakIndex.Behandlingsmeny" />
                  <span style={{ marginLeft: '5px' }}>
                    <Image src={visMenySomApen ? openImage : closedImage} />
                  </span>
                </Button>
              </div>
            ),
          }}
        />
      </div>
      {valgtModal !== -1 && filtrertData[valgtModal].modal(() => setValgtModal(-1))}
    </RawIntlProvider>
  );
};

export default MenySakIndex;
