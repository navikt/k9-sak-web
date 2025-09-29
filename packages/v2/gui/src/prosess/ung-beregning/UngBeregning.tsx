import {
  ung_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus as AksjonspunktDtoStatus,
  type ung_sak_kontrakt_aksjonspunkt_AksjonspunktDto as AksjonspunktDto,
  type ung_sak_kontrakt_kontroll_KontrollerInntektDto as KontrollerInntektDto,
} from '@k9-sak-web/backend/ungsak/generated/types.js';
import { aksjonspunktCodes } from '@k9-sak-web/backend/ungsak/kodeverk/AksjonspunktCodes.js';
import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import { Alert, Box, Heading, Loader, Tabs } from '@navikt/ds-react';
import { useQuery } from '@tanstack/react-query';
import { ArbeidOgInntekt } from './ArbeidOgInntekt';
import { BarnPanel } from './BarnPanel';
import { DagsatsOgUtbetaling } from './dagsats-og-utbetaling/DagsatsOgUtbetaling';
import type { Barn } from './types/Barn';
import type { UngBeregningBackendApiType } from './UngBeregningBackendApiType';

interface Props {
  behandling: { uuid: string; versjon: number };
  api: UngBeregningBackendApiType;
  barn: Barn[];
  submitCallback: (data: unknown) => Promise<any>;
  aksjonspunkter: AksjonspunktDto[];
  isReadOnly: boolean;
}

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

const UngBeregning = ({ api, behandling, barn, submitCallback, aksjonspunkter, isReadOnly }: Props) => {
  useQuery({
    queryKey: ['satser', behandling.uuid],
    queryFn: () => api.getSatsOgUtbetalingPerioder(behandling.uuid),
  });

  const {
    data: inntekt,
    isLoading: kontrollInntektIsLoading,
    isError: kontrollInntektIsError,
  } = useQuery({
    queryKey: ['kontrollInntekt', behandling.uuid, behandling.versjon],
    queryFn: () => api.getKontrollerInntekt(behandling.uuid),
    select: sortInntekt,
  });

  useQuery({
    queryKey: ['ungdomsprogramInformasjon', behandling.uuid],
    queryFn: () => api.getUngdomsprogramInformasjon(behandling.uuid),
  });

  if (kontrollInntektIsError) {
    return <Alert variant="error">Noe gikk galt, vennligst prøv igjen senere</Alert>;
  }

  const harBarn = barn.length > 0;
  const harInntekt = inntekt?.kontrollperioder && inntekt.kontrollperioder.length > 0;
  const aksjonspunkt = aksjonspunkter?.find(ap => ap.definisjon === aksjonspunktCodes.KONTROLLER_INNTEKT);
  const harUløstAksjonspunkt = aksjonspunkt && aksjonspunkt.status === AksjonspunktDtoStatus.OPPRETTET;
  return (
    <Box.New paddingInline="4 8" paddingBlock="2">
      <Box.New minHeight="100svh">
        <Heading size="medium" level="1" spacing>
          Sats og beregning
        </Heading>
        {kontrollInntektIsLoading ? (
          <Loader size="large" />
        ) : (
          <Tabs defaultValue={aksjonspunkt ? 'inntekt' : 'dagsats'}>
            <Tabs.List>
              {harInntekt && (
                <Tabs.Tab
                  value="inntekt"
                  label="Inntekt"
                  icon={
                    harUløstAksjonspunkt && (
                      <ExclamationmarkTriangleFillIcon fontSize="1.5rem" color="var(--ax-text-warning-decoration)" />
                    )
                  }
                />
              )}
              {harBarn && <Tabs.Tab value="barn" label="Registrerte barn" />}
              {(harInntekt || harBarn) && <Tabs.Tab value="dagsats" label="Dagsats og utbetaling" />}
            </Tabs.List>
            <Box.New maxWidth="860px">
              <Tabs.Panel value="inntekt">
                {inntekt?.kontrollperioder && (
                  <ArbeidOgInntekt
                    submitCallback={submitCallback}
                    inntektKontrollperioder={inntekt.kontrollperioder}
                    isReadOnly={isReadOnly}
                  />
                )}
              </Tabs.Panel>
            </Box.New>
            <Tabs.Panel value="barn">
              <BarnPanel barn={barn} />
            </Tabs.Panel>
            <Tabs.Panel value="dagsats">
              <DagsatsOgUtbetaling api={api} behandling={behandling} />
            </Tabs.Panel>
          </Tabs>
        )}
      </Box.New>
    </Box.New>
  );
};

export default UngBeregning;
