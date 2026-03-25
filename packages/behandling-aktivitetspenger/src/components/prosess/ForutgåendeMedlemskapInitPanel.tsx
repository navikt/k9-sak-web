import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import { ForutgåendeMedlemskap } from '@k9-sak-web/gui/prosess/aktivitetspenger-forutgående-medlemskap/ForutgåendeMedlemskap.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { UngSakApi } from '../../data/UngSakApi';
import { aksjonspunkterQueryOptions } from '../../data/ungSakQueryOptions';

const PANEL_ID = prosessStegCodes.FORUTGÅENDE_MEDLEMSKAP;

interface Props {
  api: UngSakApi;
  behandling: BehandlingDto;
  readOnly: boolean;
  submitCallback: (data: any, aksjonspunkt?: AksjonspunktDto[]) => Promise<any>;
}

export const ForutgåendeMedlemskapInitPanel = ({ api, behandling, readOnly, submitCallback }: Props) => {
  const prosessPanelContext = useContext(ProsessPanelContext);
  const { data: aksjonspunkter = [] } = useSuspenseQuery(aksjonspunkterQueryOptions(api, behandling));
  const erValgt = prosessPanelContext?.erValgt(PANEL_ID);

  if (!erValgt) {
    return null;
  }

  const aksjonspunkt = aksjonspunkter.find(
    ap => ap.definisjon === AksjonspunktDefinisjon.AVKLAR_GYLDIG_MEDLEMSKAPSPERIODE,
  );
  if (!aksjonspunkt) {
    return null;
  }

  return <ForutgåendeMedlemskap submitCallback={submitCallback} aksjonspunkt={aksjonspunkt} readOnly={readOnly} />;
};
