import React, { useEffect, useState } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { Aksjonspunkt, Behandling, Vilkar } from '@k9-sak-web/types';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { AksjonspunktBox } from '@fpsak-frontend/shared-components';
import AldersvilkarForm from './components/AldersvilkarForm';
import AldersvilkarLese from './components/AldervilkarLese';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface AldersVilkarProsessIndexProps {
  behandling: Behandling;
  submitCallback: () => void;
  aksjonspunkter: Aksjonspunkt[];
  isReadOnly: boolean;
  angitteBarn: { personIdent: string }[];
  isAksjonspunktOpen: boolean;
  vilkar: Vilkar[];
  status: string;
}

const AldersVilkarProsessIndex = ({
  behandling,
  submitCallback,
  aksjonspunkter,
  isReadOnly,
  angitteBarn,
  isAksjonspunktOpen,
  vilkar,
  status,
}: AldersVilkarProsessIndexProps) => {
  const [redigering, setRedigering] = useState<boolean>(false);
  const vilkaret = vilkar.find(v => v.vilkarType.kode === vilkarType.ALDERSVILKAR_BARN);
  const erVurdert = vilkaret.perioder[0].vilkarStatus.kode !== vilkarUtfallType.IKKE_VURDERT;
  const vilkarOppfylt = erVurdert ? status === vilkarUtfallType.OPPFYLT : false;
  const lesemodus = isReadOnly || !isAksjonspunktOpen;
  const aksjonspunktLost = behandling.status.kode === behandlingStatus.BEHANDLING_UTREDES && !isAksjonspunktOpen;
  const relevantAksjonspunkt: Aksjonspunkt = aksjonspunkter.find(
    ap => ap.definisjon.kode === aksjonspunktCodes.ALDERSVILKÅR,
  );
  const begrunnelseTekst = relevantAksjonspunkt.begrunnelse || '';

  useEffect(() => {
    if (lesemodus) setRedigering(false);
    else if (relevantAksjonspunkt.kanLoses) setRedigering(true);
  }, [lesemodus, relevantAksjonspunkt.kanLoses]);

  return (
    <RawIntlProvider value={intl}>
      {redigering ? (
        <AksjonspunktBox erAksjonspunktApent={redigering}>
          <AldersvilkarForm
            relevantAksjonspunkt={relevantAksjonspunkt}
            submitCallback={submitCallback}
            begrunnelseTekst={begrunnelseTekst}
            erVilkaretOk={vilkarOppfylt}
            erVurdert={erVurdert}
          />
        </AksjonspunktBox>
      ) : (
        <AldersvilkarLese
          aktiverRedigering={setRedigering}
          begrunnelseTekst={begrunnelseTekst}
          angitteBarn={angitteBarn}
          aksjonspunktLost={aksjonspunktLost}
          vilkarOppfylt={vilkarOppfylt}
        />
      )}
    </RawIntlProvider>
  );
};

export default AldersVilkarProsessIndex;
