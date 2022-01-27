import calendarImg from '@fpsak-frontend/assets/images/calendar-2.svg';
import chevronBlueRightImg from '@fpsak-frontend/assets/images/chevron_blue_right.svg';
import { Image } from '@fpsak-frontend/shared-components';
import { Periode } from '@k9-sak-web/types';
import Panel from 'nav-frontend-paneler';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import styles from './behandlingPickerItemContent.less';
import { getFormattedPerioder, getStatusIcon } from './behandlingVelgerUtils';

const getAutomatiskRevurderingText = () => <span className={styles.smallerUndertittel}>(automatisk behandlet)</span>;

interface OwnProps {
  behandlingsresultatTypeKode?: string;
  behandlingsresultatTypeNavn?: string;
  erAutomatiskRevurdering: boolean;
  behandlingTypeNavn: string;
  søknadsperioder: Periode[];
}

/**
 * BehandlingPickerItemContent
 *
 * Presentasjonskomponent. Håndterer formatering av innholdet i den enkelte behandling i behandlingsvelgeren.
 */
const BehandlingPickerItemContent: React.FC<OwnProps> = ({
  behandlingsresultatTypeKode,
  behandlingsresultatTypeNavn,
  erAutomatiskRevurdering,
  behandlingTypeNavn,
  søknadsperioder,
}) => (
  <Panel className={erAutomatiskRevurdering ? styles.indent : ''} border>
    <div className={styles.behandlingPicker}>
      <div>
        <Undertittel>
          {behandlingTypeNavn}
          {erAutomatiskRevurdering ? getAutomatiskRevurderingText() : ''}
        </Undertittel>
        <div className={styles.dateContainer}>
          <Image
            className={styles.kalenderIcon}
            src={calendarImg}
            tooltip={<FormattedMessage id="BehandlingPickerItemContent.Kalender" />}
            alignTooltipLeft
          />
          {søknadsperioder?.length > 0 && <Normaltekst>{getFormattedPerioder(søknadsperioder)}</Normaltekst>}
        </div>
        <div className={styles.resultContainer}>
          {getStatusIcon(behandlingsresultatTypeKode, styles.utfallImage)}
          <Normaltekst>
            <FormattedMessage id="BehandlingPickerItemContent.Resultat" />
            {`: ${behandlingsresultatTypeKode ? behandlingsresultatTypeNavn : '-'}`}
          </Normaltekst>
        </div>
      </div>
      <div className={styles.åpneText}>
        <Normaltekst>
          <FormattedMessage id="BehandlingPickerItemContent.Behandling.Aapne" />
        </Normaltekst>
        <Image
          className={styles.åpneChevron}
          src={chevronBlueRightImg}
          tooltip={<FormattedMessage id="BehandlingPickerItemContent.Behandling.Aapne" />}
          alignTooltipLeft
        />
      </div>
    </div>
  </Panel>
);

export default BehandlingPickerItemContent;
