import React, { ReactElement } from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import chevronDown from '@fpsak-frontend/assets/images/pil_ned.svg';
import chevronUp from '@fpsak-frontend/assets/images/pil_opp.svg';
import stjerneImg from '@fpsak-frontend/assets/images/stjerne.svg';
import behandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import {
  DateLabel,
  FlexColumn,
  FlexContainer,
  FlexRow,
  Image,
  TimeLabel,
  Tooltip,
  VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import { BehandlingAppKontekst } from '@k9-sak-web/types';
import { BodyShort, Box, Detail, Label } from '@navikt/ds-react';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import { KodeverkType } from '@k9-sak-web/lib/types/KodeverkType.js';

import styles from './behandlingPickerItemContent.module.css';

const tilbakekrevingÅrsakTyperKlage = [behandlingArsakType.RE_KLAGE_KA, behandlingArsakType.RE_KLAGE_NFP];

const erTilbakekrevingÅrsakKlage = (årsak?: string): boolean => årsak && tilbakekrevingÅrsakTyperKlage.includes(årsak);

const renderChevron = (chevron: string, messageId: string): ReactElement => (
  <FormattedMessage id={messageId}>{altText => <Image src={chevron} alt={`${altText}`} />}</FormattedMessage>
);

interface OwnProps {
  withChevronDown?: boolean;
  withChevronUp?: boolean;
  behandlendeEnhetId?: string;
  behandlendeEnhetNavn?: string;
  opprettetDato: string;
  avsluttetDato?: string;
  behandlingsstatus: string;
  behandlingTypeKode: string;
  behandlingTypeNavn: string;
  førsteÅrsak?: BehandlingAppKontekst['førsteÅrsak'];
  erGjeldendeVedtak?: boolean;
  behandlingsresultatTypeKode?: string;
  behandlingsresultatTypeNavn?: string;
}

/**
 * BehandlingPickerItemContent
 *
 * Presentasjonskomponent. Håndterer formatering av innholdet i den enkelte behandling i behandlingsvelgeren.
 */
const BehandlingPickerItemContent = ({
  withChevronDown = false,
  withChevronUp = false,
  behandlendeEnhetId,
  behandlendeEnhetNavn,
  opprettetDato,
  avsluttetDato,
  behandlingsstatus,
  behandlingTypeNavn,
  erGjeldendeVedtak = false,
  behandlingsresultatTypeKode,
  behandlingsresultatTypeNavn,
  førsteÅrsak,
  behandlingTypeKode,
}: OwnProps) => {
  const { kodeverkNavnFraKode } = useKodeverkContext();
  return (
    <Box background="surface-default" padding="4" borderWidth="1" borderColor="border-subtle" borderRadius="medium">
      <FlexContainer>
        <FlexRow>
          <FlexColumn className={styles.arsakPadding}>
            <Label size="small" as="p">
              {behandlingTypeNavn}
            </Label>
          </FlexColumn>
          {behandlingTypeKode === behandlingType.REVURDERING && førsteÅrsak?.behandlingArsakType && (
            <>
              <FlexColumn className={styles.arsakPadding}>-</FlexColumn>
              <FlexColumn>
                <BodyShort size="small">
                  {kodeverkNavnFraKode(førsteÅrsak?.behandlingArsakType, KodeverkType.BEHANDLING_AARSAK)}
                  {/* <FormattedMessage id={getÅrsak(førsteÅrsak)} /> */}
                </BodyShort>
              </FlexColumn>
            </>
          )}
          {behandlingTypeKode === behandlingType.TILBAKEKREVING_REVURDERING &&
            erTilbakekrevingÅrsakKlage(førsteÅrsak?.behandlingArsakType) && (
              <>
                <FlexColumn className={styles.arsakPadding}>-</FlexColumn>
                <FlexColumn>
                  <BodyShort size="small">
                    <FormattedMessage id="Behandlingspunkt.Årsak.Klage" />
                  </BodyShort>
                </FlexColumn>
              </>
            )}
          <FlexColumn className={styles.pushRight}>
            {erGjeldendeVedtak && (
              <Image
                className={styles.starImage}
                src={stjerneImg}
                tooltip={<FormattedMessage id="BehandlingPickerItemContent.GjeldendeVedtak" />}
                alignTooltipLeft
              />
            )}
          </FlexColumn>
          <FlexColumn>
            {withChevronDown && renderChevron(chevronDown, 'BehandlingPickerItemContent.Open')}
            {withChevronUp && renderChevron(chevronUp, 'BehandlingPickerItemContent.Close')}
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
      <VerticalSpacer eightPx />
      <hr className={styles.line} />
      <VerticalSpacer sixteenPx />
      <FlexContainer>
        <FlexRow>
          <FlexColumn className={styles.firstColumnWidth}>
            <BodyShort size="small">
              <FormattedMessage id="BehandlingPickerItemContent.Behandlingstatus" />
            </BodyShort>
          </FlexColumn>
          <FlexColumn>
            <BodyShort size="small">{behandlingsstatus}</BodyShort>
          </FlexColumn>
        </FlexRow>
        <FlexRow>
          <FlexColumn className={styles.firstColumnWidth}>
            <BodyShort size="small">
              <FormattedMessage id="BehandlingPickerItemContent.Resultat" />
            </BodyShort>
          </FlexColumn>
          <FlexColumn>
            <BodyShort size="small">{behandlingsresultatTypeKode ? behandlingsresultatTypeNavn : '-'}</BodyShort>
          </FlexColumn>
        </FlexRow>
        <VerticalSpacer sixteenPx />
        <FlexRow>
          <FlexColumn className={styles.firstColumnWidth}>
            <BodyShort size="small">
              <FormattedMessage id="BehandlingPickerItemContent.Opprettet" />
            </BodyShort>
          </FlexColumn>
          <FlexColumn>
            <BodyShort size="small" className={styles.inline}>
              <DateLabel dateString={opprettetDato} />
            </BodyShort>
            <Detail className={classNames(styles.inline, styles.timePadding)}>
              <FormattedMessage id="DateTimeLabel.Kl" />
            </Detail>
            <Detail className={styles.inline}>
              <TimeLabel dateTimeString={opprettetDato} />
            </Detail>
          </FlexColumn>
        </FlexRow>
        <FlexRow>
          <FlexColumn className={styles.firstColumnWidth}>
            <BodyShort size="small">
              <FormattedMessage id="BehandlingPickerItemContent.Avsluttet" />
            </BodyShort>
          </FlexColumn>
          <FlexColumn>
            {avsluttetDato && (
              <>
                <BodyShort size="small" className={styles.inline}>
                  <DateLabel dateString={avsluttetDato} />
                </BodyShort>
                <Detail className={classNames(styles.inline, styles.timePadding)}>
                  <FormattedMessage id="DateTimeLabel.Kl" />
                </Detail>
                <Detail className={styles.inline}>
                  <TimeLabel dateTimeString={avsluttetDato} />
                </Detail>
              </>
            )}
          </FlexColumn>
          <FlexColumn className={styles.pushRightCorner}>
            <BodyShort size="small" className={styles.inline}>
              <FormattedMessage id="BehandlingPickerItemContent.Enhet" />
            </BodyShort>
            <Tooltip content={behandlendeEnhetNavn} alignLeft>
              <BodyShort size="small" className={styles.inline}>
                {behandlendeEnhetId}
              </BodyShort>
            </Tooltip>
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
      <VerticalSpacer fourPx />
    </Box>
  );
};

export default BehandlingPickerItemContent;
