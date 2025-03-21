import { type UngdomsytelseSatsPeriodeDto } from '@k9-sak-web/backend/ungsak/generated';
import { Alert, Box, Heading, Loader, Tabs } from '@navikt/ds-react';
import { useQuery } from '@tanstack/react-query';
import { ArbeidOgInntekt } from './ArbeidOgInntekt';
import { DagsatsOgUtbetaling } from './DagsatsOgUtbetaling';
import UngBarnFakta from './UngBarnFakta';
import type { UngBeregningBackendApiType } from './UngBeregningBackendApiType';
import type { Barn } from './types/Barn';

interface Props {
  behandling: { uuid: string };
  api: UngBeregningBackendApiType;
  barn: Barn[];
  inntekt?: unknown[];
}

const sortSatser = (data: UngdomsytelseSatsPeriodeDto[]) =>
  data?.toSorted((a, b) => new Date(a.fom).getTime() - new Date(b.fom).getTime()).toReversed();

const UngBeregning = ({ api, behandling, barn, inntekt }: Props) => {
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

  if (satserIsLoading) {
    return <Loader size="large" />;
  }

  if (satserIsError) {
    return <Alert variant="error">Noe gikk galt, vennligst prøv igjen senere</Alert>;
  }

  const harBarn = barn.length > 0;
  const harInntekt = inntekt && inntekt.length > 0;

  return (
    <Box paddingInline="4 8" paddingBlock="2">
      <div className="min-h-svh">
        <Heading size="medium" level="1" spacing>
          Sats og beregning
        </Heading>
        <Tabs defaultValue="dagsats">
          <Tabs.List>
            {harInntekt && <Tabs.Tab value="arbeid" label="Arbeid og inntekt" />}
            {harBarn && <Tabs.Tab value="barn" label="Registrerte barn" />}
            {(harInntekt || harBarn) && <Tabs.Tab value="dagsats" label="Dagsats og utbetaling" />}
          </Tabs.List>
          <Tabs.Panel value="arbeid">
            <ArbeidOgInntekt />
          </Tabs.Panel>
          <Tabs.Panel value="dagsats">{satserSuccess && <DagsatsOgUtbetaling satser={satser} />}</Tabs.Panel>
          <Tabs.Panel value="barn">
            <UngBarnFakta barn={barn} />
          </Tabs.Panel>
        </Tabs>
      </div>
    </Box>
  );
};

export default UngBeregning;
