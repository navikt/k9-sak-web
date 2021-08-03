import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { DDMMYYYY_DATE_FORMAT, required } from '@fpsak-frontend/utils';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import opptjeningAktivitetTyper from '@fpsak-frontend/kodeverk/src/opptjeningAktivitetType';
import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import { EditedIcon, PeriodLabel, Table, TableColumn, TableRow } from '@fpsak-frontend/shared-components';
import { createVisningsnavnForAktivitet } from '../ArbeidsforholdHelper';
import beregningAktivitetPropType from './beregningAktivitetPropType';

import styles from './vurderAktiviteterTabell.less';

export const lagAktivitetFieldId = aktivitet => {
  if (aktivitet.arbeidsgiverId) {
    if (aktivitet.arbeidsforholdId) {
      return aktivitet.arbeidsgiverId + aktivitet.arbeidsforholdId + aktivitet.fom.replace('.', '');
    }
    return aktivitet.arbeidsgiverId + aktivitet.fom.replace('.', '');
  }
  if (aktivitet.aktørIdString) {
    if (aktivitet.arbeidsforholdId) {
      return aktivitet.aktørIdString + aktivitet.arbeidsforholdId + aktivitet.fom.replace('.', '');
    }
    return aktivitet.aktørIdString + aktivitet.fom.replace('.', '');
  }
  return aktivitet.arbeidsforholdType.kode + aktivitet.fom.replace('.', '');
};

export const skalVurdereAktivitet = (aktivitet, skalOverstyre, harAksjonspunkt) => {
  if (!skalOverstyre && !harAksjonspunkt) {
    return false;
  }
  if (aktivitet.arbeidsforholdType && aktivitet.arbeidsforholdType.kode === opptjeningAktivitetTyper.AAP) {
    return false;
  }
  return true;
};

const lagTableRow = (
  readOnly,
  isAksjonspunktClosed,
  aktivitet,
  alleKodeverk,
  erOverstyrt,
  harAksjonspunkt,
  fieldArrayID,
  arbeidsgiverOpplysningerPerId,
) => (
  <TableRow key={lagAktivitetFieldId(aktivitet)}>
    <TableColumn>
      <Normaltekst>
        {createVisningsnavnForAktivitet(aktivitet, alleKodeverk, arbeidsgiverOpplysningerPerId)}
      </Normaltekst>
    </TableColumn>
    <TableColumn>
      <Normaltekst>
        <PeriodLabel dateStringFom={aktivitet.fom} dateStringTom={aktivitet.tom} />
      </Normaltekst>
    </TableColumn>
    <TableColumn className={styles.radioMiddle}>
      <RadioGroupField
        name={`${fieldArrayID}.${lagAktivitetFieldId(aktivitet)}.skalBrukes`}
        readOnly={readOnly || !skalVurdereAktivitet(aktivitet, erOverstyrt, harAksjonspunkt)}
      >
        {[<RadioOption key={`${lagAktivitetFieldId(aktivitet)}.bruk`} value />]}
      </RadioGroupField>
    </TableColumn>
    <TableColumn className={styles.radioMiddle}>
      <RadioGroupField
        name={`${fieldArrayID}.${lagAktivitetFieldId(aktivitet)}.skalBrukes`}
        readOnly={readOnly || !skalVurdereAktivitet(aktivitet, erOverstyrt, harAksjonspunkt)}
      >
        {[<RadioOption key={`${lagAktivitetFieldId(aktivitet)}.ikkeBruk`} value={false} />]}
      </RadioGroupField>
    </TableColumn>
    {isAksjonspunktClosed && readOnly && (
      <TableColumn>{skalVurdereAktivitet(aktivitet, erOverstyrt, harAksjonspunkt) && <EditedIcon />}</TableColumn>
    )}
  </TableRow>
);

const getHeaderTextCodes = () => [
  'VurderAktiviteterTabell.Header.Aktivitet',
  'VurderAktiviteterTabell.Header.Periode',
  'VurderAktiviteterTabell.Header.Benytt',
  'VurderAktiviteterTabell.Header.IkkeBenytt',
];

const finnHeading = (aktiviteter, erOverstyrt, skjaeringstidspunkt) => {
  if (erOverstyrt) {
    return (
      <FormattedMessage
        id="VurderAktiviteterTabell.Overstyrt.Overskrift"
        values={{ skjaeringstidspunkt: moment(skjaeringstidspunkt).format(DDMMYYYY_DATE_FORMAT) }}
      />
    );
  }
  const harAAP = aktiviteter.some(
    aktivitet => aktivitet.arbeidsforholdType && aktivitet.arbeidsforholdType.kode === opptjeningAktivitetTyper.AAP,
  );
  const harVentelonnVartpenger = aktiviteter.some(
    aktivitet =>
      aktivitet.arbeidsforholdType &&
      aktivitet.arbeidsforholdType.kode === opptjeningAktivitetTyper.VENTELØNN_VARTPENGER,
  );
  if (harAAP) {
    return (
      <FormattedMessage
        id="VurderAktiviteterTabell.FullAAPKombinert.Overskrift"
        values={{ skjaeringstidspunkt: moment(skjaeringstidspunkt).format(DDMMYYYY_DATE_FORMAT) }}
      />
    );
  }
  if (harVentelonnVartpenger) {
    return (
      <FormattedMessage
        id="VurderAktiviteterTabell.VentelonnVartpenger.Overskrift"
        values={{ skjaeringstidspunkt: moment(skjaeringstidspunkt).format(DDMMYYYY_DATE_FORMAT) }}
      />
    );
  }
  return null;
};

/**
 * VurderAktiviteterTabell
 *
 * Presentasjonskomponent.. Inneholder tabeller for avklaring av skjæringstidspunkt
 */
export const VurderAktiviteterTabell = ({
  readOnly,
  isAksjonspunktClosed,
  aktiviteter,
  skjaeringstidspunkt,
  alleKodeverk,
  erOverstyrt,
  harAksjonspunkt,
  fieldArrayID,
  arbeidsgiverOpplysningerPerId,
}) => (
  <>
    <Element>{finnHeading(aktiviteter, erOverstyrt, skjaeringstidspunkt)}</Element>
    <Table headerTextCodes={getHeaderTextCodes()} noHover>
      {aktiviteter.map(aktivitet =>
        lagTableRow(
          readOnly,
          isAksjonspunktClosed,
          aktivitet,
          alleKodeverk,
          erOverstyrt,
          harAksjonspunkt,
          fieldArrayID,
          arbeidsgiverOpplysningerPerId,
        ),
      )}
    </Table>
  </>
);

VurderAktiviteterTabell.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  aktiviteter: PropTypes.arrayOf(beregningAktivitetPropType).isRequired,
  skjaeringstidspunkt: PropTypes.string.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  erOverstyrt: PropTypes.bool.isRequired,
  harAksjonspunkt: PropTypes.bool.isRequired,
  fieldArrayID: PropTypes.string.isRequired,
  arbeidsgiverOpplysningerPerId: PropTypes.shape().isRequired,
};

VurderAktiviteterTabell.validate = (values, aktiviteter) => {
  const errors = {};
  let harError = false;
  aktiviteter.forEach(aktivitet => {
    const fieldId = lagAktivitetFieldId(aktivitet);
    const e = required(values[fieldId].skalBrukes);
    if (e) {
      errors[fieldId] = { skalBrukes: e };
      harError = true;
    }
  });
  if (harError) {
    return errors;
  }
  return null;
};

VurderAktiviteterTabell.transformValues = (values, aktiviteter) =>
  aktiviteter
    .filter(
      aktivitet =>
        values[lagAktivitetFieldId(aktivitet)].skalBrukes === false ||
        values[lagAktivitetFieldId(aktivitet)].tom != null,
    )
    .map(aktivitet => ({
      oppdragsgiverOrg: aktivitet.aktørIdString ? null : aktivitet.arbeidsgiverId,
      arbeidsforholdRef: aktivitet.arbeidsforholdId,
      fom: aktivitet.fom,
      tom: aktivitet.tom,
      opptjeningAktivitetType: aktivitet.arbeidsforholdType ? aktivitet.arbeidsforholdType.kode : null,
      arbeidsgiverIdentifikator: aktivitet.aktørIdString ? aktivitet.aktørIdString : null,
      skalBrukes: values[lagAktivitetFieldId(aktivitet)].skalBrukes,
    }));

VurderAktiviteterTabell.hasValueChangedFromInitial = (aktiviteter, values, initialValues) => {
  const changedAktiviteter = aktiviteter.map(lagAktivitetFieldId).find(fieldId => {
    if (values[fieldId] && initialValues[fieldId]) {
      if (values[fieldId].skalBrukes !== initialValues[fieldId].skalBrukes) {
        return true;
      }
    }
    return false;
  });
  return changedAktiviteter !== undefined;
};

const skalBrukesPretufylling = (aktivitet, erOverstyrt, harAksjonspunkt) => {
  if (skalVurdereAktivitet(aktivitet, erOverstyrt, harAksjonspunkt)) {
    return aktivitet.skalBrukes;
  }
  return aktivitet.skalBrukes === true || aktivitet.skalBrukes === null || aktivitet.skalBrukes === undefined;
};

const mapToInitialValues = (aktivitet, alleKodeverk, erOverstyrt, harAksjonspunkt, arbeidsgiverOpplysningerPerId) => ({
  beregningAktivitetNavn: createVisningsnavnForAktivitet(aktivitet, alleKodeverk, arbeidsgiverOpplysningerPerId),
  fom: aktivitet.fom,
  tom: aktivitet.tom,
  skalBrukes: skalBrukesPretufylling(aktivitet, erOverstyrt, harAksjonspunkt),
});

VurderAktiviteterTabell.buildInitialValues = (
  aktiviteter,
  alleKodeverk,
  erOverstyrt,
  harAksjonspunkt,
  arbeidsgiverOpplysningerPerId,
) => {
  if (!aktiviteter) {
    return {};
  }
  const initialValues = {};
  aktiviteter.forEach(aktivitet => {
    initialValues[lagAktivitetFieldId(aktivitet)] = mapToInitialValues(
      aktivitet,
      alleKodeverk,
      erOverstyrt,
      harAksjonspunkt,
      arbeidsgiverOpplysningerPerId,
    );
  });
  return initialValues;
};

export default VurderAktiviteterTabell;
