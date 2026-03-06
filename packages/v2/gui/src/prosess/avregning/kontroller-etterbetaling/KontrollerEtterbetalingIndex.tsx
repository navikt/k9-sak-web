import type {
  k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto as AksjonspunktDto,
  k9_sak_kontrakt_behandling_BehandlingDto as BehandlingDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';
import KontrollerEtterbetaling from './KontrollerEtterbetaling';

interface Props {
  behandling: BehandlingDto;
  aksjonspunkt: AksjonspunktDto;
  readOnly: boolean;
}

const KontrollerEtterbetalingIndex = ({ aksjonspunkt, behandling, readOnly }: Props) => {
  /*
   * Kopierer props for å unngå at konverteringen av kodeverk endrer verdiene i props.
   * Dette er en midlertidig løsning inntil vi har fått oppdatert alle komponenter til å
   * bruke kodeverkene fra backend.
   */
  const deepCopyProps = JSON.parse(
    JSON.stringify({
      behandling: behandling,
      aksjonspunkt: aksjonspunkt,
    }),
  );
  konverterKodeverkTilKode(deepCopyProps, false);

  return (
    <KontrollerEtterbetaling
      behandling={deepCopyProps.behandling}
      aksjonspunkt={deepCopyProps.aksjonspunkt}
      readOnly={readOnly}
    />
  );
};

export default KontrollerEtterbetalingIndex;
