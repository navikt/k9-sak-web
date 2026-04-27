import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';
import KontrollerEtterbetaling from './KontrollerEtterbetaling';
import type { BehandlingDto } from '@k9-sak-web/backend/combined/kontrakt/behandling/BehandlingDto.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/combined/kontrakt/aksjonspunkt/AksjonspunktDto.js';

interface Props {
  behandling: BehandlingDto;
  aksjonspunkt?: AksjonspunktDto;
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
