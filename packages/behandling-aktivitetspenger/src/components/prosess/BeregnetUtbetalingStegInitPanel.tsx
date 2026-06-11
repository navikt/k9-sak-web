import { aksjonspunktCodes } from '@k9-sak-web/backend/ungsak/kodeverk/AksjonspunktCodes.js';
import { AksjonspunktStatus as AksjonspunktDtoStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import { BehandlingStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/BehandlingStatus.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { FastsettInntektDto } from '@k9-sak-web/backend/ungsak/kontrakt/kontroll/FastsettInntektDto.js';
import type { KontrollerInntektDto } from '@k9-sak-web/backend/ungsak/kontrakt/kontroll/KontrollerInntektDto.js';
import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import { ProsessStegIkkeBehandlet } from '@k9-sak-web/gui/behandling/prosess/ProsessStegIkkeBehandlet.js';
import { AktivitetspengerBeregningBackendClient } from '@k9-sak-web/gui/prosess/aktivitetspenger-beregning/AktivitetspengerBeregningBackendClient.js';
import { AktivitetspengerApi } from '@k9-sak-web/gui/prosess/aktivitetspenger-prosess/AktivitetspengerApi.js';
import {
  aksjonspunkterQueryOptions,
  innloggetBrukerQueryOptions,
  satsOgUtbetalingPerioderQueryOptions,
} from '@k9-sak-web/gui/prosess/aktivitetspenger-prosess/aktivitetspengerQueryOptions.js';
import { DagsatsOgUtbetaling, sortSatser } from '@k9-sak-web/gui/shared/dagsats-og-utbetaling/DagsatsOgUtbetaling.js';
import { ArbeidOgInntekt } from '@k9-sak-web/gui/shared/kontroll-inntekt/ArbeidOgInntekt.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import { Alert, Box, Heading, Loader, Tabs, VStack } from '@navikt/ds-react';
import { useMutation, useQuery, useSuspenseQueries, useSuspenseQuery } from '@tanstack/react-query';
import { useContext, useMemo } from 'react';

const PANEL_ID = prosessStegCodes.KONTROLL_AV_INNTEKT;

const sortInntekt = (data: KontrollerInntektDto): KontrollerInntektDto => {
  const { kontrollperioder } = data;
  return {
    kontrollperioder: kontrollperioder
      ?.toSorted((a, b) => {
        if (!a.periode || !b.periode) {
          return 0;
        }
        return new Date(a.periode.fom).getTime() - new Date(b.periode.fom).getTime();
      })
      .toReversed(),
  };
};

interface Props {
  api: AktivitetspengerApi;
  behandling: BehandlingDto;
  onAksjonspunktBekreftet: () => void;
}

export const BeregnetUtbetalingStegInitPanel = ({ api, behandling, onAksjonspunktBekreftet }: Props) => {
  const prosessPanelContext = useContext(ProsessPanelContext);
  const erTilBehandlingEllerBehandlet = !!prosessPanelContext?.erTilBehandlingEllerBehandlet(PANEL_ID);

  const aktivitetspengerBeregningApi = useMemo(() => new AktivitetspengerBeregningBackendClient(), []);

  const { data: satser } = useSuspenseQuery({
    ...satsOgUtbetalingPerioderQueryOptions(api, behandling, erTilBehandlingEllerBehandlet),
    select: sortSatser,
  });

  const [{ data: aksjonspunkter }, { data: innloggetBruker }] = useSuspenseQueries({
    queries: [aksjonspunkterQueryOptions(api, behandling), innloggetBrukerQueryOptions(api)],
  });

  const {
    data: inntekt,
    isLoading: kontrollInntektIsLoading,
    isError: kontrollInntektIsError,
  } = useQuery({
    queryKey: ['aktivitetspenger-kontrollInntekt', behandling.uuid, behandling.versjon],
    queryFn: () => aktivitetspengerBeregningApi.getKontrollerInntekt(behandling.uuid),
    select: sortInntekt,
    throwOnError: false,
  });

  const { data: arbeidsgivere } = useQuery({
    queryKey: ['aktivitetspenger-arbeidsgivere', behandling.uuid],
    queryFn: () => aktivitetspengerBeregningApi.getArbeidsgiverOpplysninger(behandling.uuid),
  });

  const aksjonspunkt = aksjonspunkter?.find(ap => ap.definisjon === aksjonspunktCodes.KONTROLLER_INNTEKT);

  const { mutateAsync: inntektKontrollertMutation } = useMutation({
    mutationFn: async (data: FastsettInntektDto) => {
      if (!aksjonspunkt) {
        return;
      }
      await aktivitetspengerBeregningApi.bekreftKontrollerInntektAksjonspunkt(
        behandling.uuid,
        behandling.versjon,
        data,
      );
    },
    onSuccess: () => {
      onAksjonspunktBekreftet();
    },
  });

  const isReadOnly = useMemo(() => {
    const tilgang = innloggetBruker.aktivitetspengerDel2SaksbehandlerTilgang;
    const manglerTilgang = !tilgang?.kanBeslutte && !tilgang?.kanSaksbehandle;
    const behandlingErAvsluttet = behandling.status === BehandlingStatus.AVSLUTTET;
    const aksjonspunktErIkkeLøsbart = aksjonspunkt?.kanLoses === false;

    return manglerTilgang || behandlingErAvsluttet || aksjonspunktErIkkeLøsbart;
  }, [innloggetBruker, behandling, aksjonspunkt]);

  const erValgt = prosessPanelContext?.erValgt(PANEL_ID);

  if (!erValgt) {
    return null;
  }

  if (!erTilBehandlingEllerBehandlet) {
    return <ProsessStegIkkeBehandlet />;
  }

  if (!satser) {
    return null;
  }

  if (kontrollInntektIsError) {
    return <Alert variant="error">Innlasting av inntektskontrolldata feilet, vennligst prøv igjen senere</Alert>;
  }

  const harInntektKontroll = inntekt?.kontrollperioder && inntekt.kontrollperioder.length > 0;
  const harUløstAksjonspunkt = aksjonspunkt && aksjonspunkt.status === AksjonspunktDtoStatus.OPPRETTET;
  const defaultTab = harUløstAksjonspunkt && harInntektKontroll ? 'inntekt' : 'utbetaling';

  return (
    <VStack>
      <Heading size="medium" level="2">
        Beregnet utbetaling
      </Heading>
      {kontrollInntektIsLoading ? (
        <Loader size="large" />
      ) : harInntektKontroll ? (
        <Tabs defaultValue={defaultTab}>
          <Tabs.List>
            <Tabs.Tab value="utbetaling" label="Sats" />
            <Tabs.Tab
              value="inntekt"
              label="Inntektskontroll"
              icon={
                harUløstAksjonspunkt && (
                  <ExclamationmarkTriangleFillIcon fontSize="1.5rem" color="var(--ax-text-warning-decoration)" />
                )
              }
            />
          </Tabs.List>
          <Tabs.Panel value="utbetaling">
            <DagsatsOgUtbetaling satser={satser} />
          </Tabs.Panel>
          <Box maxWidth="860px">
            <Tabs.Panel value="inntekt">
              <ArbeidOgInntekt
                inntektKontrollertCallback={inntektKontrollertMutation}
                inntektKontrollperioder={inntekt?.kontrollperioder ?? []}
                isReadOnly={isReadOnly}
                arbeidsgivere={arbeidsgivere}
              />
            </Tabs.Panel>
          </Box>
        </Tabs>
      ) : (
        <DagsatsOgUtbetaling satser={satser} />
      )}
    </VStack>
  );
};
