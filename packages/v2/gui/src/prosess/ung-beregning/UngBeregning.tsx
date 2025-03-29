import {
  type AksjonspunktDto,
  type KontrollerInntektDto,
  type UngdomsytelseSatsPeriodeDto,
} from '@k9-sak-web/backend/ungsak/generated';
import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import { Alert, Box, Heading, Loader, Tabs } from '@navikt/ds-react';
import { useQuery } from '@tanstack/react-query';
import { ArbeidOgInntekt } from './ArbeidOgInntekt';
import { BarnPanel } from './BarnPanel';
import { DagsatsOgUtbetaling } from './DagsatsOgUtbetaling';
import type { UngBeregningBackendApiType } from './UngBeregningBackendApiType';
import type { Barn } from './types/Barn';

interface Props {
  behandling: { uuid: string };
  api: UngBeregningBackendApiType;
  barn: Barn[];
  submitCallback: (data: unknown) => Promise<any>;
  aksjonspunkter: AksjonspunktDto[];
}

const sortSatser = (data: UngdomsytelseSatsPeriodeDto[]) =>
  data?.toSorted((a, b) => new Date(a.fom).getTime() - new Date(b.fom).getTime()).toReversed();

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

const UngBeregning = ({ api, behandling, barn, submitCallback, aksjonspunkter }: Props) => {
  const {
    data: satser,
    isLoading: satserIsLoading,
    isSuccess: satserSuccess,
    isError: satserIsError,
  } = useQuery<UngdomsytelseSatsPeriodeDto[]>({
    queryKey: ['satser', behandling.uuid],
    queryFn: () => api.getSatser(behandling.uuid),
    select: sortSatser,
  });

  const {
    data: inntekt,
    isLoading: kontrollInntektIsLoading,
    isError: kontrollInntektIsError,
  } = useQuery({
    queryKey: ['kontrollInntekt', behandling.uuid],
    queryFn: () => api.getKontrollerInntekt(behandling.uuid),
    select: sortInntekt,
  });

  if (satserIsLoading || kontrollInntektIsLoading) {
    return <Loader size="large" />;
  }

  if (satserIsError || kontrollInntektIsError) {
    return <Alert variant="error">Noe gikk galt, vennligst prøv igjen senere</Alert>;
  }

  const harBarn = barn.length > 0;
  const harInntekt = inntekt?.kontrollperioder && inntekt.kontrollperioder.length > 0;
  const harAksjonspunkt = aksjonspunkter?.filter(ap => ap.kanLoses).length > 0;
  return (
    <Box paddingInline="4 8" paddingBlock="2">
      <Box minHeight="100svh">
        <Heading size="medium" level="1" spacing>
          Sats og beregning
        </Heading>
        <Tabs defaultValue={harAksjonspunkt ? 'arbeid' : 'dagsats'}>
          <Tabs.List>
            {harInntekt && (
              <Tabs.Tab
                value="arbeid"
                label="Arbeid og inntekt"
                icon={
                  harAksjonspunkt && <ExclamationmarkTriangleFillIcon fontSize="1.5rem" color="var(--a-icon-warning)" />
                }
              />
            )}
            {harBarn && <Tabs.Tab value="barn" label="Registrerte barn" />}
            {(harInntekt || harBarn) && <Tabs.Tab value="dagsats" label="Dagsats og utbetaling" />}
          </Tabs.List>
          <Tabs.Panel value="arbeid">
            <ArbeidOgInntekt submitCallback={submitCallback} inntektKontrollperioder={inntekt?.kontrollperioder} />
          </Tabs.Panel>
          <Tabs.Panel value="barn">
            <BarnPanel barn={barn} />
          </Tabs.Panel>
          <Tabs.Panel value="dagsats">{satserSuccess && <DagsatsOgUtbetaling satser={satser} />}</Tabs.Panel>
        </Tabs>
      </Box>
    </Box>
  );
};

export default UngBeregning;
