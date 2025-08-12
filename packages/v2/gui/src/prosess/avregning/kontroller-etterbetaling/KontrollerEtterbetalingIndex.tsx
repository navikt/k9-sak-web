import { useContext } from 'react';
import type {
  sak_kontrakt_aksjonspunkt_AksjonspunktDto as AksjonspunktDto,
  sak_kontrakt_behandling_BehandlingDto as BehandlingDto,
} from '@k9-sak-web/backend/k9sak/generated';
import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';
import { K9SakClientContext } from '../../../app/K9SakClientContext';
import BehandlingAvregningBackendClient from '../AvregningBackendClient';
import KontrollerEtterbetaling from './KontrollerEtterbetaling';

interface Props {
  behandling: BehandlingDto;
  aksjonspunkt: AksjonspunktDto;
  readOnly: boolean;
}

const KontrollerEtterbetalingIndex = ({ aksjonspunkt, behandling, readOnly }: Props) => {
  const k9SakClient = useContext(K9SakClientContext);
  const behandlingAvregningBackendClient = new BehandlingAvregningBackendClient(k9SakClient);

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

  /*
   * Midlertidig fiks for å oppdatere behandling etter å ha fullført aksjonspunkt. Ifm med
   * kodeverk-endringene kommer en context for behandlingsid og -versjon, denne kan nok
   * tilpasses til å kunne trigge oppdatering av behandling "on-demand"
   */
  const oppdaterBehandling = () => {
    // FIXME temp fiks for å håndtere oppdatering av behandling
    window.location.reload();
  };

  return (
    <KontrollerEtterbetaling
      behandling={deepCopyProps.behandling}
      aksjonspunkt={deepCopyProps.aksjonspunkt}
      readOnly={readOnly}
      api={behandlingAvregningBackendClient}
      oppdaterBehandling={oppdaterBehandling}
    />
  );
};

export default KontrollerEtterbetalingIndex;
