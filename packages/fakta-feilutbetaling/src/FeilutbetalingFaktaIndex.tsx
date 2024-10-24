import React, { FC } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import { Aksjonspunkt, KodeverkMedNavn } from '@k9-sak-web/types';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import FeilutbetalingInfoPanel from './components/FeilutbetalingInfoPanel';
import { FeilutbetalingAarsak, FeilutbetalingFakta } from './types';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface Props {
  behandling: {
    id: number;
    versjon: number;
  };
  feilutbetalingFakta: FeilutbetalingFakta;
  feilutbetalingAarsak: FeilutbetalingAarsak[];
  fagsakYtelseTypeKode: string;
  aksjonspunkter: Aksjonspunkt[];
  alleMerknaderFraBeslutter: any;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  fpsakKodeverk: { [key: string]: KodeverkMedNavn[] };
  submitCallback: () => void;
  readOnly: boolean;
  hasOpenAksjonspunkter: boolean;
  v2?: boolean;
}

const FeilutbetalingFaktaIndex: FC<Props> = ({
  behandling,
  feilutbetalingFakta,
  feilutbetalingAarsak,
  fagsakYtelseTypeKode,
  aksjonspunkter,
  alleMerknaderFraBeslutter,
  submitCallback,
  readOnly,
  hasOpenAksjonspunkter,
}) => {
  const { getKodeverkNavnFraKodeFn } = useKodeverkContext();
  const kodeverkTilbakekNavnFraKode = getKodeverkNavnFraKodeFn('kodeverkTilbake');
  const kodeverkKlageNavnFraKode = getKodeverkNavnFraKodeFn('kodeverkKlage');
  return (
    <RawIntlProvider value={intl}>
      <FeilutbetalingInfoPanel
        behandlingId={behandling.id}
        behandlingVersjon={behandling.versjon}
        feilutbetalingFakta={feilutbetalingFakta.behandlingFakta}
        feilutbetalingAarsak={
          Array.isArray(feilutbetalingAarsak) && feilutbetalingAarsak.find(a => a.ytelseType === fagsakYtelseTypeKode)
        }
        aksjonspunkter={aksjonspunkter}
        alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
        submitCallback={submitCallback}
        readOnly={readOnly}
        hasOpenAksjonspunkter={hasOpenAksjonspunkter}
        kodeverkKlageNavnFraKode={kodeverkKlageNavnFraKode}
        kodeverkTilbakekNavnFraKode={kodeverkTilbakekNavnFraKode}
      />
    </RawIntlProvider>
  );
};

export default FeilutbetalingFaktaIndex;
