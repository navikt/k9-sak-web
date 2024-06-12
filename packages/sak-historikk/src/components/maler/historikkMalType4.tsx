import { decodeHtmlEntity } from '@fpsak-frontend/utils';
import { BodyShort, Label } from '@navikt/ds-react';
import React from 'react';
import { WrappedComponentProps } from 'react-intl';
import { KodeverkType } from '@k9-sak-web/lib/types/KodeverkType.js';
import HistorikkMal from '../HistorikkMalTsType';
import BubbleText from './felles/bubbleText';
import { findHendelseText } from './felles/historikkUtils';

const HistorikkMalType4 = ({ historikkinnslag, kodeverkNavnFraKodeFn }: HistorikkMal & WrappedComponentProps) => (
  <>
    {historikkinnslag.historikkinnslagDeler.map((del, delIndex) => (
      <div
        key={
          `del${delIndex}` // eslint-disable-line react/no-array-index-key
        }
      >
        <Label size="small" as="p" className="snakkeboble-panel__tekst">
          {findHendelseText(del.hendelse, kodeverkNavnFraKodeFn)}
        </Label>
        {del.aarsak && (
          <BodyShort size="small">{kodeverkNavnFraKodeFn(del.aarsak, KodeverkType.VENT_AARSAK)}</BodyShort>
        )}
        {del.begrunnelse && (
          <BubbleText bodyText={kodeverkNavnFraKodeFn(del.begrunnelse, KodeverkType.HISTORIKK_BEGRUNNELSE_TYPE)} />
        )}
        {del.begrunnelseFritekst && <BubbleText bodyText={decodeHtmlEntity(del.begrunnelseFritekst)} />}
      </div>
    ))}
  </>
);

export default HistorikkMalType4;
