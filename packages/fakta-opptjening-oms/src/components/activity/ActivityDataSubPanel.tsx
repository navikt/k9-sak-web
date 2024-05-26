import { DatepickerField, DecimalField, InputField } from '@fpsak-frontend/form';
import OAType from '@fpsak-frontend/kodeverk/src/opptjeningAktivitetType';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import {
  DDMMYYYY_DATE_FORMAT,
  ISO_DATE_FORMAT,
  hasValidDecimal,
  maxValue,
  minValue,
  required,
} from '@fpsak-frontend/utils';
import { ArbeidsgiverOpplysningerPerId, Kodeverk } from '@k9-sak-web/types';
import OpptjeningAktivitet from '@k9-sak-web/types/src/opptjening/opptjeningAktivitet';
import { BodyShort, Detail, HGrid } from '@navikt/ds-react';
import moment from 'moment';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import styles from './activityDataSubPanel.module.css';

const ytelseTypes = [
  OAType.SYKEPENGER,
  OAType.FORELDREPENGER,
  OAType.PLEIEPENGER,
  OAType.SVANGERSKAPSPENGER,
  OAType.UTENLANDSK_ARBEIDSFORHOLD,
];

const isOfType = (selectedActivityType: Kodeverk, ...opptjeningAktivitetType: string[]) =>
  selectedActivityType && opptjeningAktivitetType.includes(selectedActivityType.kode);

const formatDate = (date: string) => (date ? moment(date, ISO_DATE_FORMAT).format(DDMMYYYY_DATE_FORMAT) : '-');

const minValue0 = minValue(0);
const maxValue200 = maxValue(200);

const getOppdragsgiverMessageId = (selectedActivityType: Kodeverk) =>
  isOfType(selectedActivityType, OAType.FRILANS) ? 'ActivityPanel.Oppdragsgiver' : 'ActivityPanel.Arbeidsgiver';

const getArbeidsgiverText = (
  initialValues: Partial<OpptjeningAktivitet>,
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId,
) => {
  if (initialValues.privatpersonNavn && initialValues.privatpersonFødselsdato) {
    const fodselsdato = formatDate(initialValues.privatpersonFødselsdato);
    return `${initialValues.privatpersonNavn} (${fodselsdato})`;
  }

  if (initialValues.privatpersonNavn) {
    return initialValues.privatpersonNavn;
  }

  const arbeidsgiverId = initialValues.oppdragsgiverOrg || initialValues.arbeidsgiverIdentifikator;

  const arbeidsgiverOpplysninger =
    arbeidsgiverOpplysningerPerId && arbeidsgiverId ? arbeidsgiverOpplysningerPerId[arbeidsgiverId] : null;

  if (arbeidsgiverOpplysninger) {
    return `${arbeidsgiverOpplysninger.navn} (${arbeidsgiverId})`;
  }

  if (initialValues.arbeidsgiver && typeof initialValues.arbeidsgiver === 'string') {
    return initialValues.arbeidsgiver;
  }

  return '-';
};

const isManuallyAddedAndNotUtenlandskArbeidsforhold = (isManuallyAdded: boolean, selectedActivityType: Kodeverk) =>
  isManuallyAdded && !isOfType(selectedActivityType, OAType.UTENLANDSK_ARBEIDSFORHOLD);
const isManuallyAddedAndUtenlandskArbeidsforhold = (isManuallyAdded: boolean, selectedActivityType: Kodeverk) =>
  isManuallyAdded && isOfType(selectedActivityType, OAType.UTENLANDSK_ARBEIDSFORHOLD);

interface ActivityDataSubPanelProps {
  initialValues: Partial<OpptjeningAktivitet>;
  readOnly: boolean;
  isManuallyAdded: boolean;
  selectedActivityType?: Kodeverk;
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
}

/**
 * ActivityDataSubPanel
 *
 * Presentasjonskomponent. Viser informasjon om valgt aktivitet
 */
const ActivityDataSubPanel = ({
  initialValues,
  readOnly,
  isManuallyAdded,
  selectedActivityType,
  arbeidsgiverOpplysningerPerId,
}: ActivityDataSubPanelProps) => (
  <>
    {isOfType(selectedActivityType, ...[OAType.ARBEID, OAType.NARING, ...ytelseTypes]) && (
      <HGrid gap="1" columns={{ xs: '7fr 5fr' }}>
        <div>
          {!isManuallyAdded && (
            <>
              <Detail>
                <FormattedMessage id={getOppdragsgiverMessageId(selectedActivityType)} />
              </Detail>
              <div className={styles.arbeidsgiver}>
                <BodyShort size="small">{getArbeidsgiverText(initialValues, arbeidsgiverOpplysningerPerId)}</BodyShort>
              </div>
            </>
          )}
          {isManuallyAddedAndNotUtenlandskArbeidsforhold(isManuallyAdded, selectedActivityType) && (
            <InputField
              name="oppdragsgiverOrg"
              label={{ id: 'ActivityPanel.Organisasjonsnr' }}
              validate={[required]}
              readOnly={readOnly}
              htmlSize={14}
            />
          )}
          {isManuallyAddedAndUtenlandskArbeidsforhold(isManuallyAdded, selectedActivityType) && (
            <InputField
              name="arbeidsgiver"
              label={{ id: 'ActivityPanel.Arbeidsgiver' }}
              validate={[required]}
              readOnly={readOnly}
              htmlSize={40}
            />
          )}
        </div>
        {isOfType(selectedActivityType, OAType.ARBEID) && (
          <DecimalField
            name="stillingsandel"
            label={{ id: 'ActivityPanel.Stillingsandel' }}
            validate={[required, minValue0, maxValue200, hasValidDecimal]}
            readOnly={readOnly || !isManuallyAdded}
            htmlSize={14}
            format={value => (readOnly || !isManuallyAdded ? `${value} %` : value)}
            // @ts-ignore TODO Fiks denne!
            normalizeOnBlur={value => (Number.isNaN(value) ? value : parseFloat(value).toFixed(2))}
          />
        )}
      </HGrid>
    )}
    <VerticalSpacer eightPx />
    {isOfType(selectedActivityType, OAType.NARING) && (
      <HGrid gap="1" columns={{ xs: '8fr 4fr' }}>
        <DatepickerField name="naringRegistreringsdato" label={{ id: 'ActivityPanel.Registreringsdato' }} readOnly />
      </HGrid>
    )}
  </>
);

export default ActivityDataSubPanel;
