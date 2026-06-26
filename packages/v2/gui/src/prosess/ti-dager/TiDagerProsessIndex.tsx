import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import { vilkårStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårStatus.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/k9sak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import { formatDate } from '@k9-sak-web/gui/utils/formatters.js';
import { CheckmarkCircleFillIcon, XMarkOctagonFillIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Heading, Loader } from '@navikt/ds-react';
import { SideMenu } from '@navikt/ft-plattform-komponenter';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import AksjonspunktIkon from '../../shared/aksjonspunkt-ikon/AksjonspunktIkon.js';
import { hentAktivePerioderFraVilkar } from '../../utils/hentAktivePerioderFraVilkar.js';
import { useTiDagerBackendClient } from './TiDagerBackendClientContext.js';
import { TiDagerProsess, type TiDagerSubmitModel } from './TiDagerProsess.js';
import styles from './tiDagerProsessIndex.module.css';

const getIconForPeriode = (vilkarStatus: string, erOverstyrt: boolean, harÅpentUløstAksjonspunkt: boolean) => {
  if (erOverstyrt || harÅpentUløstAksjonspunkt) {
    return <AksjonspunktIkon size="small" />;
  }
  if (vilkarStatus === vilkårStatus.OPPFYLT) {
    return <CheckmarkCircleFillIcon style={{ color: 'var(--ax-bg-success-strong)' }} />;
  }
  if (vilkarStatus === vilkårStatus.IKKE_OPPFYLT) {
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
  const [activeTab, setActiveTab] = useState(0);

  const perioder = hentAktivePerioderFraVilkar(vilkar, false);

  const activePeriode = perioder.length === 1 ? perioder[0] : perioder[activeTab];

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
  const harJournalposter = opplysninger?.journalposter && opplysninger.journalposter.length > 0;
  if (!activePeriode) {
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

  const vilkårErFerdigVurdert = vilkår?.perioder?.every(p => p.vilkarStatus !== vilkårStatus.IKKE_VURDERT);
  const vilkårErOppfylt = vilkår?.perioder?.every(p => p.vilkarStatus === vilkårStatus.OPPFYLT);

  return (
    <>
      <div className={styles.mainContainerWithSideMenu}>
        <div className="flex-shrink-0">
          <SideMenu
            links={perioder.map(({ periode, vilkarStatus }, index) => ({
              active: activeTab === index,
              label: `${formatDate(periode.fom)} - ${formatDate(periode.tom)}`,
              icon: getIconForPeriode(vilkarStatus, false, isAksjonspunktOpen),
            }))}
            onClick={setActiveTab}
            heading="Perioder"
          />
        </div>
        <TiDagerProsess
          opplysninger={opplysninger}
          aksjonspunkter={aksjonspunkter}
          submitCallback={submitCallback}
          isReadOnly={isReadOnly}
          saksnummer={saksnummer}
          arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
          vilkårErFerdigVurdert={!!vilkårErFerdigVurdert}
          vilkårErOppfylt={!!vilkårErOppfylt}
        />
      </div>
    </>
  );
};
