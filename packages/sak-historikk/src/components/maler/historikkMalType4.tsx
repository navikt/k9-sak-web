import { decodeHtmlEntity } from '@fpsak-frontend/utils';
import { BodyShort, Label } from '@navikt/ds-react';
import React from 'react';
import { WrappedComponentProps } from 'react-intl';
import { KodeverkType } from '@k9-sak-web/lib/kodeverk/types/KodeverkType';
import HistorikkMal from '../HistorikkMalTsType';
import BubbleText from './felles/bubbleText';
import { findHendelseText } from './felles/historikkUtils';

const HistorikkMalType4 = ({ historikkinnslag, kodeverkNavnFraKodeFn }: HistorikkMal & WrappedComponentProps) => (
  <>
    {historikkinnslag.historikkinnslagDeler.map((del, delIndex) => {
      const { aarsak, begrunnelse, begrunnelseFritekst, aarsakKodeverkType, begrunnelseKodeverkType } = del;

      const aarsakTekst = begrunnelse
        ? kodeverkNavnFraKodeFn(begrunnelse, KodeverkType[aarsakKodeverkType] || KodeverkType.VENT_AARSAK)
        : null;

      const begrunnelseTekst = begrunnelse
        ? kodeverkNavnFraKodeFn(
            begrunnelse,
            KodeverkType[begrunnelseKodeverkType] || KodeverkType.HISTORIKK_BEGRUNNELSE_TYPE,
          )
        : null;

      return (
        <div
          key={
            `del${delIndex}` // eslint-disable-line react/no-array-index-key
          }
        >
          <Label size="small" as="p" className="snakkeboble-panel__tekst">
            {findHendelseText(del.hendelse, kodeverkNavnFraKodeFn)}
          </Label>
          {aarsak && <BodyShort size="small">{aarsakTekst}</BodyShort>}
          {begrunnelse && <BubbleText bodyText={begrunnelseTekst} />}
          {begrunnelseFritekst && <BubbleText bodyText={decodeHtmlEntity(begrunnelseFritekst)} />}
        </div>
      );
    })}
  </>
);

export default HistorikkMalType4;
