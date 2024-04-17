import React, { FC } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import { Aksjonspunkt, KodeverkMedNavn } from '@k9-sak-web/types';
import { useKodeverkV2 } from '@k9-sak-web/gui/kodeverk/hooks/useKodeverk.js';
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
  harApneAksjonspunkter: boolean;
  v2?: boolean;
}

const FeilutbetalingFaktaIndex: FC<Props> = ({
  behandling,
  feilutbetalingFakta,
  feilutbetalingAarsak,
  fagsakYtelseTypeKode,
  aksjonspunkter,
  alleMerknaderFraBeslutter,
  alleKodeverk,
  fpsakKodeverk,
  submitCallback,
  readOnly,
  harApneAksjonspunkter,
}) => {
  const { getKodeverkNavnFraKodeFn } = useKodeverkV2();
  const kodeverTilbakekNavnFraKode = getKodeverkNavnFraKodeFn('kodeverkTilbake');
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
        alleKodeverk={alleKodeverk}
        fpsakKodeverk={fpsakKodeverk}
        submitCallback={submitCallback}
        readOnly={readOnly}
        hasOpenAksjonspunkter={harApneAksjonspunkter}
        kodeverkKlageNavnFraKode={kodeverkKlageNavnFraKode}
        kodeverTilbakekNavnFraKode={kodeverTilbakekNavnFraKode}
      />
    </RawIntlProvider>
  );
};

export default FeilutbetalingFaktaIndex;
