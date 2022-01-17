import advarselImg from '@fpsak-frontend/assets/images/advarsel-circle.svg';
import avslaattImg from '@fpsak-frontend/assets/images/avslaatt_valgt.svg';
import calendarImg from '@fpsak-frontend/assets/images/calendar-2.svg';
import innvilgetImg from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import { DateLabel, Image } from '@fpsak-frontend/shared-components';
import { Periode } from '@k9-sak-web/types';
import classnames from 'classnames/bind';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import getFormattedPerioder from './getFormattedPerioder';
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
          <div className={`${styles.resultContainer} ${styles.marginTop4}`}>
            {behandlingsresultatTypeKode === behandlingResultatType.INNVILGET && (
              <Image
                className={styles.utfallImage}
                src={innvilgetImg}
                tooltip={<FormattedMessage id="BehandlingPickerItemContent.Behandling.Innvilget" />}
                alignTooltipLeft
              />
            )}
            {behandlingsresultatTypeKode === behandlingResultatType.AVSLATT && (
              <Image
                className={styles.utfallImage}
                src={avslaattImg}
                tooltip={<FormattedMessage id="BehandlingPickerItemContent.Behandling.Avslaatt" />}
                alignTooltipLeft
              />
            )}
            {behandlingsresultatTypeKode === behandlingResultatType.IKKE_FASTSATT && (
              <Image
                className={styles.utfallImage}
                src={advarselImg}
                tooltip={<FormattedMessage id="BehandlingPickerItemContent.Behandling.UnderBehandling" />}
                alignTooltipLeft
              />
            )}
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
          <div className={`${styles.flexContainer} ${styles.marginTop4}`}>
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
