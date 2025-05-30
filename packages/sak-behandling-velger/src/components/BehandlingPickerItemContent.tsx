import calendarImg from '@fpsak-frontend/assets/images/calendar-2.svg';
import chevronBlueRightImg from '@fpsak-frontend/assets/images/chevron_blue_right.svg';
import { DateLabel, Image } from '@fpsak-frontend/shared-components';
import { Periode } from '@k9-sak-web/types';
import { BodyShort, Box, Heading } from '@navikt/ds-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
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
  avsluttet: string;
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
  avsluttet,
}) => (
  <Box
    background="surface-default"
    padding="4"
    className={erAutomatiskRevurdering ? styles.indent : ''}
    borderWidth="1"
    borderColor="border-subtle"
    borderRadius="medium"
  >
    <div className={styles.behandlingPicker}>
      <div>
        <Heading size="small" level="2">
          {`${index}. `}
          {behandlingTypeNavn}
          {erAutomatiskRevurdering ? getAutomatiskRevurderingText() : ''}
          {erUnntaksløype ? getUnntaksløypeText() : ''}
        </Heading>
        <div className={styles.dateContainer}>
          <Image className={styles.kalenderIcon} src={calendarImg} tooltip="Kalender" alignTooltipLeft />
          {søknadsperioder?.length > 0 && (
            <BodyShort size="small">{getFormattedSøknadserioder(søknadsperioder)}</BodyShort>
          )}
        </div>
        <div className={styles.resultContainer}>
          {getStatusIcon(behandlingsresultatTypeKode, styles.utfallImage, erFerdigstilt)}
          <BodyShort size="small">
            <FormattedMessage id="BehandlingPickerItemContent.Resultat" />
            {`: `}
            {getStatusText(behandlingsresultatTypeKode, behandlingsresultatTypeNavn, erFerdigstilt)}
            {avsluttet && (
              <BodyShort as="span" size="small">
                <DateLabel dateString={avsluttet} />
              </BodyShort>
            )}
          </BodyShort>
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
        <BodyShort size="small">
          <FormattedMessage id="BehandlingPickerItemContent.Behandling.Aapne" />
        </BodyShort>
        <Image className={styles.åpneChevron} src={chevronBlueRightImg} tooltip="Åpne" alignTooltipLeft />
      </div>
    </div>
  </Box>
);

export default BehandlingPickerItemContent;
