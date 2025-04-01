import { CalendarIcon, ChevronRightIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Heading, HStack } from '@navikt/ds-react';
import React from 'react';
import DateLabel from '../../../shared/dateLabel/DateLabel';
import type { K9UngPeriode } from '../types/PerioderMedBehandlingsId';
import styles from './behandlingPickerItemContent.module.css';
import { getFormattedSøknadserioder, getStatusIcon, getStatusText } from './behandlingVelgerUtils';

const getAutomatiskRevurderingText = () => <span className={styles.smallerUndertittel}>(automatisk behandlet)</span>;
const getUnntaksløypeText = () => <span className={styles.smallerUndertittel}>(unntaksløype)</span>;

interface OwnProps {
  behandlingsresultatTypeKode?: string;
  behandlingsresultatTypeNavn?: string;
  erAutomatiskRevurdering: boolean;
  behandlingTypeNavn: string;
  søknadsperioder: K9UngPeriode[];
  erFerdigstilt: boolean;
  erUnntaksløype: boolean;
  index: number;
  opprettet: string;
  avsluttet?: string;
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
        <HStack gap="2" align={'center'} className="mt-1">
          <CalendarIcon title="Kalender" fontSize="1.5rem" />

          {søknadsperioder?.length > 0 && (
            <BodyShort size="small">{getFormattedSøknadserioder(søknadsperioder)}</BodyShort>
          )}
        </HStack>
        <HStack gap="2" align={'center'} className="mt-1">
          {getStatusIcon(behandlingsresultatTypeKode, styles.utfallImage, erFerdigstilt)}
          <BodyShort size="small">
            Resultat
            {`: `}
            {getStatusText(behandlingsresultatTypeKode, behandlingsresultatTypeNavn, erFerdigstilt)}
            {avsluttet && (
              <BodyShort as="span" size="small">
                {` `}
                <DateLabel dateString={avsluttet} />
              </BodyShort>
            )}
          </BodyShort>
        </HStack>
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
        <BodyShort size="small">Åpne</BodyShort>
        <ChevronRightIcon title="Åpne" fontSize="1.5rem" style={{ color: 'var(--a-blue-500)', fontSize: '1.5rem' }} />
      </div>
    </div>
  </Box>
);

export default BehandlingPickerItemContent;
