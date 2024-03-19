import calendarImg from '@fpsak-frontend/assets/images/calendar-2.svg';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { DateLabel, Image } from '@fpsak-frontend/shared-components';
import { skjermlenkeCodes } from '@k9-sak-web/konstanter';
import { Periode } from '@k9-sak-web/types';
import { Heading } from '@navikt/ds-react';
import classnames from 'classnames/bind';
import { Location } from 'history';
import { Element, Normaltekst } from 'nav-frontend-typografi';
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
              <Normaltekst>{årsak}</Normaltekst>
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
            {søknadsperioder?.length > 0 && <Normaltekst>{getFormattedSøknadserioder(søknadsperioder)}</Normaltekst>}
          </div>
          <div className={`${styles.resultContainer} ${styles.marginTop8}`}>
            {getStatusIcon(behandlingsresultatTypeKode, styles.utfallImage, erFerdigstilt)}
            <Normaltekst>
              {getStatusText(behandlingsresultatTypeKode, behandlingsresultatTypeNavn, erFerdigstilt)}
            </Normaltekst>
          </div>
        </div>
        <div className={styles.marginTop2}>
          <div className={styles.flexContainer}>
            <Element className={styles.marginRight4}>Opprettet:</Element>
            <Normaltekst>
              <DateLabel dateString={opprettetDato} />
            </Normaltekst>
          </div>
          {avsluttetDato && (
            <div className={`${styles.flexContainer} ${styles.marginTop8}`}>
              <Element className={styles.marginRight4}>Avsluttet:</Element>
              <Normaltekst>
                <DateLabel dateString={avsluttetDato} />
              </Normaltekst>
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
          <Normaltekst>
            <FormattedMessage id="Behandlingspunkt.BehandlingSelected.SøknadsperioderMedÅrsakerForBehandling" />
          </Normaltekst>
        </NavLink>
      )}
    </div>
  );
};

export default BehandlingSelected;
