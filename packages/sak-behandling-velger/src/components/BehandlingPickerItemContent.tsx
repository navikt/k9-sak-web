import calendarImg from '@fpsak-frontend/assets/images/calendar-2.svg?react';
import chevronBlueRightImg from '@fpsak-frontend/assets/images/chevron_blue_right.svg?react';
import { DateLabel, Image } from '@fpsak-frontend/shared-components';
import { Periode } from '@k9-sak-web/types';
import Panel from 'nav-frontend-paneler';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { BodyShort } from '@navikt/ds-react';
import styles from './behandlingPickerItemContent.module.css';
import { getFormattedSøknadserioder, getStatusIcon, getStatusText } from './behandlingVelgerUtils';

const getAutomatiskRevurderingText = () => (
  <span className={styles.smallerUndertittel}>
    (<FormattedMessage id="BehandlingPickerItemContent.AutomatiskBehandlet" />)
  </span>
);
const getUnntaksløypeText = () => (
  <span className={styles.smallerUndertittel}>
    (<FormattedMessage id="BehandlingPickerItemContent.Unntaksløype" />)
  </span>
);

interface OwnProps {
  behandlingsresultatTypeKode?: string;
  behandlingsresultatTypeNavn?: string;
  erAutomatiskRevurdering: boolean;
  behandlingTypeNavn: string;
  søknadsperioder: Periode[];
  erFerdigstilt: boolean;
  erUnntaksløype: boolean;
  index: number;
  opprettet: string;
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
  erFerdigstilt,
  erUnntaksløype,
  index,
  opprettet,
}) => (
  <Panel className={erAutomatiskRevurdering ? styles.indent : ''} border>
    <div className={styles.behandlingPicker}>
      <div>
        <Undertittel>
          {`${index}. `}
          {behandlingTypeNavn}
          {erAutomatiskRevurdering ? getAutomatiskRevurderingText() : ''}
          {erUnntaksløype ? getUnntaksløypeText() : ''}
        </Undertittel>
        <div className={styles.dateContainer}>
          <Image
            className={styles.kalenderIcon}
            src={calendarImg}
            tooltip={<FormattedMessage id="BehandlingPickerItemContent.Kalender" />}
            alignTooltipLeft
          />
          {søknadsperioder?.length > 0 && <Normaltekst>{getFormattedSøknadserioder(søknadsperioder)}</Normaltekst>}
        </div>
        <div className={styles.resultContainer}>
          {getStatusIcon(behandlingsresultatTypeKode, styles.utfallImage, erFerdigstilt)}
          <Normaltekst>
            <FormattedMessage id="BehandlingPickerItemContent.Resultat" />
            {`: `}
            {getStatusText(behandlingsresultatTypeKode, behandlingsresultatTypeNavn, erFerdigstilt)}
          </Normaltekst>
        </div>
        {opprettet && (
          <div className={styles.opprettetDatoContainer}>
            <BodyShort weight="semibold" size="small">
              Opprettet:
            </BodyShort>
            <BodyShort size="small">
              <DateLabel dateString={opprettet} />
            </BodyShort>
          </div>
        )}
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
