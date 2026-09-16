import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import { vilkårStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårStatus.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/k9sak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import type { VilkårPeriodeDto } from '@k9-sak-web/backend/k9sak/kontrakt/vilkår/VilkårPeriodeDto.js';
import { formatDate } from '@k9-sak-web/gui/utils/formatters.js';
import { CheckmarkCircleFillIcon, XMarkOctagonFillIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Detail, Heading, HStack, Loader } from '@navikt/ds-react';
import { SideMenu } from '@navikt/ft-plattform-komponenter';
import { queryOptions, useQuery } from '@tanstack/react-query';
import AksjonspunktIkon from '../../shared/aksjonspunkt-ikon/AksjonspunktIkon.js';
import { Lovreferanse } from '../../shared/lovreferanse/Lovreferanse.js';
import { hentAktivePerioderFraVilkar } from '../../utils/hentAktivePerioderFraVilkar.js';
import { useTiDagerBackendClient } from './TiDagerBackendClientContext.js';
import { TiDagerProsess, type TiDagerSubmitModel } from './TiDagerProsess.js';
import styles from './tiDagerProsessIndex.module.css';

const getIconForPerioder = (perioder: VilkårPeriodeDto[], erOverstyrt: boolean, harÅpentUløstAksjonspunkt: boolean) => {
  const harOppfyltPeriode = perioder.some(p => p.vilkarStatus === vilkårStatus.OPPFYLT);
  const harBareAvslåttePerioder = perioder.every(p => p.vilkarStatus === vilkårStatus.IKKE_OPPFYLT);
  if (erOverstyrt || harÅpentUløstAksjonspunkt) {
    return <AksjonspunktIkon size="small" />;
  }
  if (harOppfyltPeriode) {
    return <CheckmarkCircleFillIcon style={{ color: 'var(--ax-bg-success-strong)' }} />;
  }
  if (harBareAvslåttePerioder) {
    return <XMarkOctagonFillIcon style={{ color: 'var(--ax-bg-danger-strong)' }} />;
  }
  return null;
};

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
  const isAksjonspunktOpen = aksjonspunkter.some(ap => ap.status === aksjonspunktStatus.OPPRETTET);
  const perioder = hentAktivePerioderFraVilkar(vilkar, false);

  const api = useTiDagerBackendClient();
  const {
    data: opplysninger,
    isPending,
    isError,
  } = useQuery(
    queryOptions({
      queryKey: ['rettFraDagEn', behandlingUUID],
      queryFn: () => api.hentRettFraDagEnOpplysninger(behandlingUUID),
      throwOnError: false,
    }),
  );

  const vilkår = vilkar?.[0];
  const harJournalposter = (opplysninger?.journalposter?.length ?? 0) > 0;

  if (perioder.length === 0) {
    return null;
  }

  if (isPending) {
    return <Loader title="Laster opplysninger om rett fra dag én" />;
  }

  if (isError) {
    return (
      <Box paddingInline="space-16 space-32" paddingBlock="space-8">
        <BodyShort>Kunne ikke hente opplysninger om rett fra dag én.</BodyShort>
      </Box>
    );
  }

  if (!opplysninger) {
    return (
      <Box paddingInline="space-16 space-32" paddingBlock="space-8">
        <BodyShort>Kunne ikke hente opplysninger om rett fra dag én.</BodyShort>
      </Box>
    );
  }

  const allePerioderOppfyltUtenJournalposter =
    vilkår?.perioder != undefined &&
    vilkår.perioder.length > 0 &&
    vilkår.perioder.every(p => p.vilkarStatus === vilkårStatus.OPPFYLT) &&
    !harJournalposter;

  const vilkårErFerdigVurdert = perioder.every(p => p.vilkarStatus !== vilkårStatus.IKKE_VURDERT);
  const vilkårErOppfylt = perioder.some(p => p.vilkarStatus === vilkårStatus.OPPFYLT);

  return (
    <div className={styles.mainContainerWithSideMenu}>
      <div className="flex-shrink-0">
        <SideMenu
          links={perioder.map((p, i) => ({
            active: true,
            label: `${formatDate(p.periode.fom)} - ${formatDate(p.periode.tom)}${i < perioder.length - 1 ? ',' : ''}`,
            icon: i === perioder.length - 1 ? getIconForPerioder(perioder, false, isAksjonspunktOpen) : undefined,
          }))}
          onClick={() => {
            return;
          }}
          heading="Perioder"
        />
      </div>
      {allePerioderOppfyltUtenJournalposter && (
        <Box paddingInline="space-8" paddingBlock="space-8" width="fit-content">
          <HStack gap="space-16">
            <CheckmarkCircleFillIcon fontSize={24} style={{ color: 'var(--ax-bg-success-strong)' }} />
            <Heading size="small" level="2" spacing>
              Ti dager
            </Heading>
            <Detail className={styles.vilkar}>
              <Lovreferanse>§ 9-8 tredje ledd</Lovreferanse>
            </Detail>
          </HStack>
          <BodyShort size="small" weight="semibold">
            10 dager har blitt dekket
          </BodyShort>
        </Box>
      )}
      {!allePerioderOppfyltUtenJournalposter && (
        <TiDagerProsess
          opplysninger={opplysninger}
          aksjonspunkter={aksjonspunkter}
          submitCallback={submitCallback}
          isReadOnly={isReadOnly}
          saksnummer={saksnummer}
          arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
          vilkårErFerdigVurdert={vilkårErFerdigVurdert}
          vilkårErOppfylt={vilkårErOppfylt}
        />
      )}
    </div>
  );
};
