import { aksjonspunktCodes } from '@k9-sak-web/backend/ungsak/kodeverk/AksjonspunktCodes.js';
import { AksjonspunktStatus as AksjonspunktDtoStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BeregningsgrunnlagDto } from '@k9-sak-web/backend/ungsak/kontrakt/aktivitetspenger/BeregningsgrunnlagDto.js';
import type { KontrollerInntektDto } from '@k9-sak-web/backend/ungsak/kontrakt/kontroll/KontrollerInntektDto.js';
import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import { Alert, Box, Heading, Loader, Tabs } from '@navikt/ds-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ArbeidOgInntekt } from '../../shared/kontroll-inntekt/ArbeidOgInntekt';
import type { AktivitetspengerBeregningBackendApiType } from './AktivitetspengerBeregningBackendApiType';
import AktivitetspengerBeregningsgrunnlag from './AktivitetspengerBeregningsgrunnlag';
import type { FastsettInntektDto } from '@k9-sak-web/backend/ungsak/kontrakt/kontroll/FastsettInntektDto.js';

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
  data: BeregningsgrunnlagDto;
  behandling: { uuid: string; versjon: number };
  api: AktivitetspengerBeregningBackendApiType;
  aksjonspunkter: AksjonspunktDto[];
  onAksjonspunktBekreftet: () => void;
  isReadOnly: boolean;
}

export const AktivitetspengerBeregning = ({
  data,
  behandling,
  api,
  aksjonspunkter,
  onAksjonspunktBekreftet,
  isReadOnly,
}: Props) => {
  const {
    data: inntekt,
    isLoading: kontrollInntektIsLoading,
    isError: kontrollInntektIsError,
  } = useQuery({
    queryKey: ['aktivitetspenger-kontrollInntekt', behandling.uuid, behandling.versjon],
    queryFn: () => api.getKontrollerInntekt(behandling.uuid),
    select: sortInntekt,
  });

  const { data: arbeidsgivere } = useQuery({
    queryKey: ['aktivitetspenger-arbeidsgivere', behandling.uuid],
    queryFn: () => api.getArbeidsgiverOpplysninger(behandling.uuid),
  });

  const aksjonspunkt = aksjonspunkter?.find(ap => ap.definisjon === aksjonspunktCodes.KONTROLLER_INNTEKT);

  const { mutateAsync: inntektKontrollertMutation } = useMutation({
    mutationFn: async (data: FastsettInntektDto) => {
      if (!aksjonspunkt) {
        return;
      }
      await api.bekreftKontrollerInntektAksjonspunkt(behandling.uuid, behandling.versjon, data);
    },
    onSuccess: () => {
      onAksjonspunktBekreftet();
    },
  });

  if (kontrollInntektIsError) {
    return <Alert variant="error">Noe gikk galt, vennligst prøv igjen senere</Alert>;
  }

  const harInntektKontroll = inntekt?.kontrollperioder && inntekt.kontrollperioder.length > 0;
  const harUløstAksjonspunkt = aksjonspunkt && aksjonspunkt.status === AksjonspunktDtoStatus.OPPRETTET;
  const defaultTab = aksjonspunkt && harInntektKontroll ? 'inntekt' : 'beregningsgrunnlag';

  return (
    <Box paddingInline="space-16 space-32" paddingBlock="space-8">
      <Box minHeight="100svh">
        <Heading size="medium" level="1" spacing>
          Grunnlag for beregning
        </Heading>
        {kontrollInntektIsLoading ? (
          <Loader size="large" />
        ) : (
          <Tabs defaultValue={defaultTab}>
            <Tabs.List>
              <Tabs.Tab value="beregningsgrunnlag" label="Beregningsgrunnlag" />
              {harInntektKontroll && (
                <Tabs.Tab
                  value="inntekt"
                  label="Inntektskontroll"
                  icon={
                    harUløstAksjonspunkt && (
                      <ExclamationmarkTriangleFillIcon fontSize="1.5rem" color="var(--ax-text-warning-decoration)" />
                    )
                  }
                />
              )}
            </Tabs.List>
            <Tabs.Panel value="beregningsgrunnlag">
              <AktivitetspengerBeregningsgrunnlag data={data} />
            </Tabs.Panel>
            {harInntektKontroll && (
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
            )}
          </Tabs>
        )}
      </Box>
    </Box>
  );
};
