import calendarImg from '@k9-sak-web/assets/images/calendar-2.svg';
import behandlingResultatType from '@k9-sak-web/kodeverk/src/behandlingResultatType';
import behandlingType from '@k9-sak-web/kodeverk/src/behandlingType';
import fagsakYtelseType from '@k9-sak-web/kodeverk/src/fagsakYtelseType';
import { skjermlenkeCodes } from '@k9-sak-web/konstanter';
import { DateLabel, Image } from '@k9-sak-web/shared-components';
import { Periode } from '@k9-sak-web/types';
import { BodyShort, Heading, Label } from '@navikt/ds-react';
import classnames from 'classnames/bind';
import { Location } from 'history';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { NavLink, useLocation } from 'react-router-dom';
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

const BehandlingSelected: React.FC<BehandlingSelectedProps> = props => {
  const {
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
  } = props;

  const location = useLocation();

  const erFerdigstilt = !!avsluttetDato;

  const containerCls = cx('behandlingSelectedContainer', {
    aapen: !behandlingsresultatTypeKode || behandlingsresultatTypeKode === behandlingResultatType.IKKE_FASTSATT,
  });

  const getÅrsakerForBehandling = () => {
    if (behandlingTypeKode === behandlingType.FORSTEGANGSSOKNAD || !behandlingsårsaker.length) {
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
          <FormattedMessage id="Behandlingspunkt.ÅrsakerForVurdering" />
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

  const ytelserMedFaktapanelSøknadsperioder = [fagsakYtelseType.PLEIEPENGER, fagsakYtelseType.PLEIEPENGER_SLUTTFASE];

  const visLenkeTilFaktapanel = ytelserMedFaktapanelSøknadsperioder.includes(sakstypeKode);

  return (
    <div data-testid="behandlingSelected" className={containerCls}>
      <Heading size="small" level="2">
        {behandlingTypeNavn}
      </Heading>
      <div className={styles.infoContainer}>
        <div>
          <div className={styles.dateContainer}>
            <Image
              className={styles.kalenderIcon}
              src={calendarImg}
              tooltip={<FormattedMessage id="BehandlingPickerItemContent.Kalender" />}
              alignTooltipLeft
            />
            {søknadsperioder?.length > 0 && (
              <BodyShort size="small">{getFormattedSøknadserioder(søknadsperioder)}</BodyShort>
            )}
          </div>
          <div className={`${styles.resultContainer} ${styles.marginTop8}`}>
            {getStatusIcon(behandlingsresultatTypeKode, styles.utfallImage, erFerdigstilt)}
            <BodyShort size="small">
              {getStatusText(behandlingsresultatTypeKode, behandlingsresultatTypeNavn, erFerdigstilt)}
            </BodyShort>
          </div>
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
          to={createLocationForSkjermlenke(location as Location, skjermlenkeCodes.FAKTA_OM_SOKNADSPERIODER.kode)}
          onClick={() => window.scroll(0, 0)}
          className={styles.faktapanelLenke}
        >
          <BodyShort size="small">
            <FormattedMessage id="Behandlingspunkt.BehandlingSelected.SøknadsperioderMedÅrsakerForBehandling" />
          </BodyShort>
        </NavLink>
      )}
    </div>
  );
};

export default BehandlingSelected;
