import { k9_kodeverk_behandling_BehandlingType as BehandlingDtoType } from '@k9-sak-web/backend/k9sak/generated';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import { KodeverkType } from '@k9-sak-web/lib/kodeverk/types.js';
import { CalendarIcon, ChevronRightIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Heading, HStack } from '@navikt/ds-react';
import React from 'react';
import DateLabel from '../../../shared/dateLabel/DateLabel';
import type { Behandling } from '../types/Behandling';
import type { K9UngPeriode } from '../types/PerioderMedBehandlingsId';
import styles from './behandlingPickerItemContent.module.css';
import {
  erFørstegangsbehandlingIUngdomsytelsen,
  erUngdomsytelse,
  getFormattedSøknadserioder,
  getStatusIcon,
  getStatusText,
} from './behandlingVelgerUtils';

const getAutomatiskRevurderingText = () => <span className={styles.smallerUndertittel}>(automatisk behandlet)</span>;
const getUnntaksløypeText = () => <span className={styles.smallerUndertittel}>(unntaksløype)</span>;

interface OwnProps {
  behandling: Behandling;
  erAutomatiskRevurdering: boolean;
  behandlingTypeNavn: string;
  søknadsperioder: K9UngPeriode[];
  index: number;
}

/**
 * BehandlingPickerItemContent
 *
 * Presentasjonskomponent. Håndterer formatering av innholdet i den enkelte behandling i behandlingsvelgeren.
 */
const BehandlingPickerItemContent: React.FC<OwnProps> = ({
  erAutomatiskRevurdering,
  behandlingTypeNavn,
  søknadsperioder,
  index,
  behandling,
}) => {
  const { kodeverkNavnFraKode } = useKodeverkContext();

  const behandlingsresultatTypeNavn = behandling.behandlingsresultat
    ? kodeverkNavnFraKode(behandling.behandlingsresultat.type, KodeverkType.BEHANDLING_RESULTAT_TYPE)
    : undefined;
  const behandlingsresultatTypeKode = behandling.behandlingsresultat ? behandling.behandlingsresultat.type : undefined;
  const erFerdigstilt = !!behandling.avsluttet;
  const erUnntaksløype = behandling.type === BehandlingDtoType.UNNTAKSBEHANDLING;
  const opprettet = behandling.opprettet;
  const avsluttet = behandling.avsluttet;
  const visKunStartdato = erFørstegangsbehandlingIUngdomsytelsen(behandling.sakstype, behandling.type);
  return (
    <Box.New
      padding="4"
      className={erAutomatiskRevurdering && !erUngdomsytelse(behandling.sakstype) ? styles.indent : ''}
      borderWidth="1"
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
          <HStack gap="space-8" align={'center'} className="mt-1">
            <CalendarIcon title="Kalender" fontSize="1.5rem" />

            {søknadsperioder?.length > 0 && (
              <BodyShort size="small">{getFormattedSøknadserioder(søknadsperioder, visKunStartdato)}</BodyShort>
            )}
          </HStack>
          <HStack gap="space-8" align={'center'} className="mt-1">
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
          <ChevronRightIcon
            title="Åpne"
            fontSize="1.5rem"
            style={{ color: 'var(--ax-accent-600)', fontSize: '1.5rem' }}
          />
        </div>
      </div>
    </Box.New>
  );
};

export default BehandlingPickerItemContent;
