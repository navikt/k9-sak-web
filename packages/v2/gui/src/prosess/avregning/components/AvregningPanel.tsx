import tilbakekrevingVidereBehandling from '@fpsak-frontend/kodeverk/src/tilbakekrevingVidereBehandling';
import { k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon as AksjonspunktDtoDefinisjon } from '@k9-sak-web/backend/k9sak/generated/types.js';
import KontrollerEtterbetalingAlert from '@k9-sak-web/gui/prosess/avregning/kontroller-etterbetaling/KontrollerEtterbetalingAlert.js';
import KontrollerEtterbetalingIndex from '@k9-sak-web/gui/prosess/avregning/kontroller-etterbetaling/KontrollerEtterbetalingIndex.js';
import { Alert, BodyShort, Heading, Label, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import AvregningSummary from './AvregningSummary';
import AvregningTable from './AvregningTable';

import type { SimuleringDto } from '@k9-sak-web/backend/k9oppdrag/kontrakt/simulering/v1/SimuleringDto.js';
import type { FagsakDto } from '@k9-sak-web/backend/combined/kontrakt/fagsak/FagsakDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/combined/kontrakt/behandling/BehandlingDto.js';
import type { AksjonspunktDto as K9SakAksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { AksjonspunktDto as UngSakAksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { TilbakekrevingValgDto } from '@k9-sak-web/backend/k9oppdrag/kontrakt/økonomi/tilbakekreving/TilbakekrevingValgDto.js';
import { VurderFeilutbetaling } from '../vurder-feilutbetaling/VurderFeilutbetaling';

interface AvregningPanelProps {
  simuleringResultat: SimuleringDto;
  readOnly: boolean;
  previewCallback: (a: string, b: string, c: string, d: string) => void;
  aksjonspunkter: K9SakAksjonspunktDto[] | UngSakAksjonspunktDto[];
  behandling: BehandlingDto;
  fagsak: FagsakDto;
  tilbakekrevingvalg: TilbakekrevingValgDto;
}
export function AvregningPanel(props: AvregningPanelProps) {
  const [showDetails, setShowDetails] = useState<Array<{ id: number; show: boolean }>>([]);
  const { simuleringResultat, readOnly, previewCallback, aksjonspunkter, behandling, fagsak, tilbakekrevingvalg } =
    props;
  const hasOpenTilbakekrevingsbehandling =
    tilbakekrevingvalg !== undefined &&
    tilbakekrevingvalg.videreBehandling === tilbakekrevingVidereBehandling.TILBAKEKR_OPPDATER;
  const harVurderFeilutbetalingAP = aksjonspunkter.some(
    ap => ap.definisjon === AksjonspunktDtoDefinisjon.VURDER_FEILUTBETALING,
  );
  const harSjekkHøyEtterbetalingAP = aksjonspunkter.some(
    ap => ap.definisjon === AksjonspunktDtoDefinisjon.SJEKK_HØY_ETTERBETALING,
  );

  const toggleDetails = (id: number) => {
    const tableIndex = showDetails.findIndex(table => table.id === id);

    if (tableIndex !== -1) {
      const updatedTable = {
        id,
        show: !showDetails?.[tableIndex]?.show,
      };
      setShowDetails(showDetails.map((table, index) => (index === tableIndex ? updatedTable : table)));
    } else {
      setShowDetails([...showDetails, { id, show: true }]);
    }
  };

  const getSimuleringResult = () => {
    if (!simuleringResultat) {
      return simuleringResultat;
    }
    return simuleringResultat.simuleringResultatUtenInntrekk || simuleringResultat.simuleringResultat;
  };

  const simuleringResultatOption = getSimuleringResult();
  return (
    <>
      <VStack gap="space-16">
        <Heading size="small" level="2">
          Simulering
        </Heading>
        {harSjekkHøyEtterbetalingAP && <KontrollerEtterbetalingAlert />}
        {simuleringResultatOption && (
          <>
            {harVurderFeilutbetalingAP && (
              <Alert variant="warning" size="small">
                <BodyShort size="small">Vurder videre behandling av tilbakekreving</BodyShort>
              </Alert>
            )}
            <VStack gap="space-8">
              <AvregningSummary
                fom={simuleringResultatOption.periode?.fom}
                tom={simuleringResultatOption.periode?.tom}
                feilutbetaling={simuleringResultatOption.sumFeilutbetaling}
                etterbetaling={simuleringResultatOption.sumEtterbetaling}
                inntrekk={simuleringResultatOption.sumInntrekk}
                ingenPerioderMedAvvik={simuleringResultatOption.ingenPerioderMedAvvik}
              />

              <AvregningTable
                showDetails={showDetails}
                toggleDetails={toggleDetails}
                simuleringResultat={simuleringResultatOption}
              />
              {hasOpenTilbakekrevingsbehandling && (
                <Label size="small" as="p">
                  Det foreligger en åpen tilbakekrevingsbehandling, endringer i vedtaket vil automatisk oppdatere
                  eksisterende feilutbetalte perioder og beløp.
                </Label>
              )}
            </VStack>
          </>
        )}
        {!simuleringResultat && <>Ingen informasjon om simulering mottatt fra økonomiløsningen.</>}
        {harVurderFeilutbetalingAP && (
          <VurderFeilutbetaling
            readOnly={readOnly}
            previewCallback={previewCallback}
            aksjonspunkter={aksjonspunkter}
            tilbakekrevingvalg={tilbakekrevingvalg}
            saksnummer={fagsak.saksnummer}
          />
        )}
        {harSjekkHøyEtterbetalingAP && (
          <KontrollerEtterbetalingIndex
            aksjonspunkt={aksjonspunkter.find(
              ap => ap.definisjon === AksjonspunktDtoDefinisjon.SJEKK_HØY_ETTERBETALING,
            )}
            behandling={behandling}
            readOnly={readOnly}
          />
        )}
      </VStack>
    </>
  );
}
