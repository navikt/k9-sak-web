import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/combined/kontrakt/vilkår/VilkårMedPerioderDto.js';
import { vilkårStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårStatus.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import { BodyShort, Box, Heading } from '@navikt/ds-react';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { useTiDagerBackendClient } from './TiDagerBackendClientContext.js';
import { TiDagerProsess, type TiDagerSubmitModel } from './TiDagerProsess.js';

interface TiDagerProsessIndexProps {
  submitCallback: (data: TiDagerSubmitModel[]) => Promise<void>;
  aksjonspunkter: Pick<AksjonspunktDto, 'definisjon' | 'begrunnelse' | 'status'>[];
  isReadOnly: boolean;
  behandlingUUID: string;
  saksnummer: string;
  arbeidsgiverOpplysningerPerId?: { [key: string]: { navn: string } };
  vilkar: VilkårMedPerioderDto[];
}

export const TiDagerProsessIndex = ({
  aksjonspunkter,
  submitCallback,
  isReadOnly,
  behandlingUUID,
  saksnummer,
  arbeidsgiverOpplysningerPerId,
  vilkar,
}: TiDagerProsessIndexProps) => {
  const api = useTiDagerBackendClient();
  const { data: opplysninger } = useSuspenseQuery(
    queryOptions({
      queryKey: ['rettFraDagEn', behandlingUUID],
      queryFn: () => api.hentRettFraDagEnOpplysninger(behandlingUUID),
    }),
  );

  const vilkår = vilkar?.[0];
  const harJournalposter = opplysninger.journalposter && opplysninger.journalposter.length > 0;

  if (
    vilkår?.perioder != undefined &&
    vilkår.perioder.length > 0 &&
    vilkår.perioder.every(p => p.vilkarStatus === vilkårStatus.OPPFYLT) &&
    !harJournalposter
  ) {
    return (
      <Box paddingInline="space-16 space-32" paddingBlock="space-8" width="fit-content">
        <Heading size="medium" level="2" spacing>
          Ti dager
        </Heading>
        <BodyShort>10 dager har blitt dekket - ref 9-8 3.ledd</BodyShort>
      </Box>
    );
  }

  return (
    <TiDagerProsess
      opplysninger={opplysninger}
      aksjonspunkter={aksjonspunkter}
      submitCallback={submitCallback}
      isReadOnly={isReadOnly}
      saksnummer={saksnummer}
      arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
    />
  );
};
