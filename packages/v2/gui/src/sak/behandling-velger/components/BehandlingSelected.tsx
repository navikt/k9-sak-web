import {
  BehandlingDtoBehandlingResultatType,
  BehandlingDtoType,
  type Periode,
} from '@k9-sak-web/backend/k9sak/generated';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { CalendarIcon } from '@navikt/aksel-icons';
import { BodyShort, Heading, HStack, Label } from '@navikt/ds-react';
import classnames from 'classnames/bind';
import { type Location } from 'history';
import { NavLink, useLocation } from 'react-router';
import skjermlenkeCodes from '../../../shared/constants/skjermlenkeCodes';
import DateLabel from '../../../shared/dateLabel/DateLabel';
import styles from './behandlingSelected.module.css';
import { getFormattedSøknadserioder, getStatusIcon, getStatusText } from './behandlingVelgerUtils';

const cx = classnames.bind(styles);
interface BehandlingSelectedProps {
  opprettetDato: string;
  avsluttetDato?: string;
  behandlingsresultatTypeKode?: string;
  behandlingsresultatTypeNavn?: string;
  behandlingsårsaker: string[];
  behandlingTypeNavn: string;
  søknadsperioder: Periode[];
  behandlingTypeKode: string;
  createLocationForSkjermlenke: (behandlingLocation: Location, skjermlenkeCode: string) => Location;
  sakstypeKode: string;
}

const BehandlingSelected = ({
  avsluttetDato,
  behandlingsresultatTypeKode,
  behandlingsresultatTypeNavn,
  behandlingsårsaker,
  behandlingTypeKode,
  behandlingTypeNavn,
  opprettetDato,
  søknadsperioder,
  createLocationForSkjermlenke,
  sakstypeKode,
}: BehandlingSelectedProps) => {
  const location = useLocation();
  const erFerdigstilt = !!avsluttetDato;
  const containerCls = cx('behandlingSelectedContainer', {
    aapen:
      !behandlingsresultatTypeKode || behandlingsresultatTypeKode === BehandlingDtoBehandlingResultatType.IKKE_FASTSATT,
  });

  const getÅrsakerForBehandling = () => {
    if (behandlingTypeKode === BehandlingDtoType.FØRSTEGANGSSØKNAD || !behandlingsårsaker.length) {
      return null;
    }
    const funnedeÅrsaker: string[] = [];
    const unikeÅrsaker = behandlingsårsaker.filter(årsak => {
      if (årsak === 'Tilstøtende periode') {
        return false;
      }
      const erDuplikat = funnedeÅrsaker.includes(årsak);
      funnedeÅrsaker.push(årsak);
      return !erDuplikat;
    });

    return (
      <div className={styles.årsakerContainer}>
        <Heading size="small" level="3" className={styles.font18}>
          Årsaker for vurdering av perioder:
        </Heading>
        <ul className={styles.årsakerList}>
          {unikeÅrsaker.map((årsak, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <li key={`${årsak}_${index}`}>
              <BodyShort size="small">{årsak}</BodyShort>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const ytelserMedFaktapanelSøknadsperioder = [
    fagsakYtelsesType.PLEIEPENGER_SYKT_BARN,
    fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE,
  ];

  const visLenkeTilFaktapanel = ytelserMedFaktapanelSøknadsperioder.some(ytelse => ytelse === sakstypeKode);

  return (
    <div data-testid="behandlingSelected" className={containerCls}>
      <Heading size="small" level="2">
        {behandlingTypeNavn}
      </Heading>
      <div className={styles.infoContainer}>
        <div>
          {søknadsperioder?.length > 0 && (
            <HStack gap="2" align={'center'}>
              <CalendarIcon title="Kalender" fontSize="1.5rem" />
              <BodyShort size="small">{getFormattedSøknadserioder(søknadsperioder)}</BodyShort>
            </HStack>
          )}
          <HStack gap="2" align={'center'} className="mt-1">
            {getStatusIcon(behandlingsresultatTypeKode, styles.utfallImage, erFerdigstilt)}
            <BodyShort size="small">
              {getStatusText(behandlingsresultatTypeKode, behandlingsresultatTypeNavn, erFerdigstilt)}
            </BodyShort>
          </HStack>
        </div>
        <div className={styles.marginTop2}>
          <div className={styles.flexContainer}>
            <Label size="small" as="p" className={styles.marginRight4}>
              Opprettet:
            </Label>
            <BodyShort size="small">
              <DateLabel dateString={opprettetDato} />
            </BodyShort>
          </div>
          {avsluttetDato && (
            <div className={`${styles.flexContainer} ${styles.marginTop8}`}>
              <Label size="small" as="p" className={styles.marginRight4}>
                Avsluttet:
              </Label>
              <BodyShort size="small">
                <DateLabel dateString={avsluttetDato} />
              </BodyShort>
            </div>
          )}
        </div>
      </div>
      {getÅrsakerForBehandling()}
      {visLenkeTilFaktapanel && (
        <NavLink
          to={createLocationForSkjermlenke(location, skjermlenkeCodes.FAKTA_OM_SOKNADSPERIODER.kode)}
          onClick={() => window.scroll(0, 0)}
          className={styles.faktapanelLenke}
        >
          <BodyShort size="small">Søknadsperioder med årsaker for behandling</BodyShort>
        </NavLink>
      )}
    </div>
  );
};

export default BehandlingSelected;
