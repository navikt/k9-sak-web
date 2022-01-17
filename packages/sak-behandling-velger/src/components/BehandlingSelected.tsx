import calendarImg from '@fpsak-frontend/assets/images/calendar-2.svg';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import { DateLabel, Image } from '@fpsak-frontend/shared-components';
import { Periode } from '@k9-sak-web/types';
import classnames from 'classnames/bind';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { getFormattedPerioder, getStatusIcon } from './behandlingVelgerUtils';
import styles from './behandlingSelected.less';

const cx = classnames.bind(styles);
interface BehandlingSelectedProps {
  opprettetDato: string;
  avsluttetDato?: string;
  behandlingsresultatTypeKode?: string;
  behandlingsresultatTypeNavn?: string;
  behandlingsårsaker: string[];
  behandlingTypeNavn: string;
  søknadsperioder: Periode[];
}

const BehandlingSelected: React.FC<BehandlingSelectedProps> = props => {
  const {
    opprettetDato,
    avsluttetDato,
    behandlingsresultatTypeKode,
    behandlingsresultatTypeNavn,
    behandlingsårsaker,
    behandlingTypeNavn,
    søknadsperioder,
  } = props;

  const containerCls = cx('behandlingSelectedContainer', {
    aapen: !behandlingsresultatTypeKode || behandlingsresultatTypeKode === behandlingResultatType.IKKE_FASTSATT,
  });

  const getÅrsakerForBehandling = () => (
    <div className={styles.årsakerContainer}>
      <Undertittel tag="h3" className={styles.font18}>
        <FormattedMessage id="Behandlingspunkt.ÅrsakerForBehandling" />
      </Undertittel>
      <ul className={styles.årsakerList}>
        {behandlingsårsaker.map((årsak, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <li key={`${årsak}_${index}`}>
            <Normaltekst>{årsak}</Normaltekst>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className={containerCls}>
      <Undertittel>{behandlingTypeNavn}</Undertittel>
      <div className={styles.infoContainer}>
        <div>
          <div className={styles.dateContainer}>
            <Image
              className={styles.kalenderIcon}
              src={calendarImg}
              tooltip={<FormattedMessage id="BehandlingPickerItemContent.Kalender" />}
              alignTooltipLeft
            />
            <Normaltekst>{getFormattedPerioder(søknadsperioder)}</Normaltekst>
          </div>
          <div className={`${styles.resultContainer} ${styles.marginTop8}`}>
            {getStatusIcon(behandlingsresultatTypeKode, styles.utfallImage)}
            <Normaltekst>{behandlingsresultatTypeKode ? behandlingsresultatTypeNavn : '-'}</Normaltekst>
          </div>
        </div>
        <div className={styles.marginTop2}>
          <div className={styles.flexContainer}>
            <Element className={styles.marginRight4}>Opprettet:</Element>
            <Normaltekst>
              <DateLabel dateString={opprettetDato} />
            </Normaltekst>
          </div>
          <div className={`${styles.flexContainer} ${styles.marginTop8}`}>
            <Element className={styles.marginRight4}>Avsluttet:</Element>
            <Normaltekst>
              <DateLabel dateString={avsluttetDato} />
            </Normaltekst>
          </div>
        </div>
      </div>
      {getÅrsakerForBehandling()}
    </div>
  );
};

export default BehandlingSelected;
