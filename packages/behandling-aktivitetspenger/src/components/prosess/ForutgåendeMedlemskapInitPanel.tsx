import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { vilkarType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/VilkårType.js';
import { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { ForutgåendeMedlemskapResponse } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/medlemskap/ForutgåendeMedlemskapResponse.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import { ForutgåendeMedlemskap } from '@k9-sak-web/gui/prosess/aktivitetspenger-forutgående-medlemskap/ForutgåendeMedlemskap.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { useSuspenseQueries } from '@tanstack/react-query';
import { useContext, useMemo } from 'react';
import { UngSakApi } from '../../data/UngSakApi';
import {
  aksjonspunkterQueryOptions,
  innloggetBrukerQueryOptions,
  vilkårQueryOptions,
} from '../../data/ungSakQueryOptions';

const PANEL_ID = prosessStegCodes.FORUTGAENDE_MEDLEMSKAP;

interface Props {
  api: UngSakApi;
  behandling: BehandlingDto;
  submitCallback: (data: any, aksjonspunkt: AksjonspunktDto[]) => Promise<any>;
}

export const ForutgåendeMedlemskapInitPanel = ({ api, behandling, submitCallback }: Props) => {
  const prosessPanelContext = useContext(ProsessPanelContext);
  const [{ data: aksjonspunkter = [] }, { data: vilkår }, { data: forutgåendeMedlemskap }, { data: innloggetBruker }] =
    useSuspenseQueries({
      queries: [
        aksjonspunkterQueryOptions(api, behandling),
        {
          ...vilkårQueryOptions(api, behandling),
          select: (data: VilkårMedPerioderDto[]) =>
            data.find(v => v.vilkarType === vilkarType.FORUTGÅENDE_MEDLEMSKAPSVILKÅRET),
        },
        {
          queryKey: ['forutgåendeMedlemskap', behandling.uuid, api.backend],
          queryFn: () => api.hentMedlemskapFraSøknad(behandling.uuid),
          select: (data: ForutgåendeMedlemskapResponse) => data.medlemskapFraBruker ?? [],
        },
        innloggetBrukerQueryOptions(api),
      ],
    });
  const erValgt = prosessPanelContext?.erValgt(PANEL_ID);
  const isReadOnly = useMemo(() => {
    return (
      !innloggetBruker.aktivitetspengerDel2SaksbehandlerTilgang?.kanBeslutte &&
      !innloggetBruker.aktivitetspengerDel2SaksbehandlerTilgang?.kanSaksbehandle
    );
  }, [innloggetBruker]);

  if (!erValgt || !vilkår) {
    return null;
  }

  const aksjonspunkt = aksjonspunkter.find(ap => ap.definisjon === AksjonspunktDefinisjon.AVKLAR_GYLDIG_MEDLEMSKAP);

  return (
    <ForutgåendeMedlemskap
      submitCallback={submitCallback}
      aksjonspunkt={aksjonspunkt}
      readOnly={isReadOnly}
      forutgåendeMedlemskap={forutgåendeMedlemskap}
      vilkår={vilkår}
    />
  );
};
