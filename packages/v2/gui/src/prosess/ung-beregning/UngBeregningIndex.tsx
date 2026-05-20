import type {
  ung_sak_kontrakt_aksjonspunkt_AksjonspunktDto as AksjonspunktDto,
  ung_sak_kontrakt_behandling_BehandlingDto as BehandlingDto,
} from '@k9-sak-web/backend/ungsak/generated/types.js';
import UngBeregning from './UngBeregning';
import UngBeregningBackendClient from './UngBeregningBackendClient';
import type { Barn } from './types/Barn';
import type { LegacyBekreftAksjonspunktCallback } from '../../utils/typehelp/AksjonspunktSubmitCallbackArgumentType.ts';
import type { ArbeidOgInntektProps } from '../../shared/kontroll-inntekt/ArbeidOgInntekt.tsx';
import type { FastsettInntektDto } from '@k9-sak-web/backend/ungsak/kontrakt/kontroll/FastsettInntektDto.ts';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { useCallback } from 'react';

interface Props {
  behandling: BehandlingDto;
  barn: Barn[];
  submitCallback: LegacyBekreftAksjonspunktCallback;
  aksjonspunkter: AksjonspunktDto[];
  isReadOnly: boolean;
}

const UngBeregningIndex = ({ barn, behandling, submitCallback, aksjonspunkter, isReadOnly }: Props) => {
  const ungBeregningBackendClient = new UngBeregningBackendClient();
  // Når UngBeregningIndex blir skrive om vekk frå å bruke legacy prosess steg panel, fjern denne wrapper og gjer ting
  // på samme måte som i AktivitetspengerBeregning.tsx
  const legacySubmitCallback: ArbeidOgInntektProps['inntektKontrollertCallback'] = useCallback(
    async (data: FastsettInntektDto) => {
      await submitCallback([
        {
          kode: AksjonspunktDefinisjon.KONTROLLER_INNTEKT,
          ...data,
        },
      ]);
    },
    [submitCallback],
  );
  return (
    <UngBeregning
      behandling={behandling}
      api={ungBeregningBackendClient}
      barn={barn}
      inntektKontrollertCallback={legacySubmitCallback}
      aksjonspunkter={aksjonspunkter}
      isReadOnly={isReadOnly}
    />
  );
};

export default UngBeregningIndex;
