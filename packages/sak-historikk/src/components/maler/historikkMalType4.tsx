import { decodeHtmlEntity } from '@k9-sak-web/utils';
import { BodyShort, Label } from '@navikt/ds-react';
import React from 'react';
import { WrappedComponentProps } from 'react-intl';
import HistorikkMal from '../HistorikkMalTsType';
import BubbleText from './felles/bubbleText';
import { findHendelseText } from './felles/historikkUtils';

const HistorikkMalType4 = ({ historikkinnslag, getKodeverknavn }: HistorikkMal & WrappedComponentProps) => (
  <>
    {historikkinnslag.historikkinnslagDeler.map((del, delIndex) => (
      <div
        key={
          `del${delIndex}` // eslint-disable-line react/no-array-index-key
        }
      >
        <Label size="small" as="p" className="snakkeboble-panel__tekst">
          {findHendelseText(del.hendelse, getKodeverknavn)}
        </Label>
        {del.aarsak && <BodyShort size="small">{getKodeverknavn(del.aarsak)}</BodyShort>}
        {del.begrunnelse && <BubbleText bodyText={getKodeverknavn(del.begrunnelse)} />}
        {del.begrunnelseFritekst && <BubbleText bodyText={decodeHtmlEntity(del.begrunnelseFritekst)} />}
      </div>
    ))}
  </>
);

export default HistorikkMalType4;
