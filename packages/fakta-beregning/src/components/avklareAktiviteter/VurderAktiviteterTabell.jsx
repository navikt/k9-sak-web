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
  if (aktivitet.arbeidsgiverIdent) {
    if (aktivitet.eksternArbeidsforholdId) {
      return aktivitet.arbeidsgiverIdent + aktivitet.eksternArbeidsforholdId + aktivitet.fom.replace('.', '');
    }
    return aktivitet.arbeidsgiverIdent + aktivitet.fom.replace('.', '');
  }
  return aktivitet.arbeidsforholdType.kode + aktivitet.fom.replace('.', '');
};

export const skalVurdereAktivitet = (aktivitet, skalOverstyre, harAvklaringsbehov) => {
  if (!skalOverstyre && !harAvklaringsbehov) {
    return false;
  }
  return !(aktivitet.arbeidsforholdType && aktivitet.arbeidsforholdType.kode === opptjeningAktivitetTyper.AAP);
};

const lagTableRow = (
  readOnly,
  isAvklaringsbehovClosed,
  aktivitet,
  alleKodeverk,
  erOverstyrt,
  harAvklaringsbehov,
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
    {(erOverstyrt || harAvklaringsbehov) && (
      <>
    <TableColumn className={styles.radioMiddle}>
      <RadioGroupField
        name={`${fieldArrayID}.${lagAktivitetFieldId(aktivitet)}.skalBrukes`}
        readOnly={readOnly || !skalVurdereAktivitet(aktivitet, erOverstyrt, harAvklaringsbehov)}
      >
        {[<RadioOption key={`${lagAktivitetFieldId(aktivitet)}.bruk`} value />]}
      </RadioGroupField>
    </TableColumn>
    <TableColumn className={styles.radioMiddle}>
      <RadioGroupField
        name={`${fieldArrayID}.${lagAktivitetFieldId(aktivitet)}.skalBrukes`}
        readOnly={readOnly || !skalVurdereAktivitet(aktivitet, erOverstyrt, harAvklaringsbehov)}
      >
        {[<RadioOption key={`${lagAktivitetFieldId(aktivitet)}.ikkeBruk`} value={false} />]}
      </RadioGroupField>
    </TableColumn>
    {isAvklaringsbehovClosed && readOnly && (
      <TableColumn>{skalVurdereAktivitet(aktivitet, erOverstyrt, harAvklaringsbehov) && <EditedIcon />}</TableColumn>
    )}
    </>)}
  </TableRow>
);

const getHeaderTextCodes = (erOverstyrt, harAvklaringsbehov) => {
  if (erOverstyrt || harAvklaringsbehov) {
    return [
      'VurderAktiviteterTabell.Header.Aktivitet',
      'VurderAktiviteterTabell.Header.Periode',
      'VurderAktiviteterTabell.Header.Benytt',
      'VurderAktiviteterTabell.Header.IkkeBenytt',
    ];
  }
  return [
  'VurderAktiviteterTabell.Header.Aktivitet',
  'VurderAktiviteterTabell.Header.Periode',
  ];
}

const finnHeading = (aktiviteter, erOverstyrt, skjaeringstidspunkt) => {
  if (erOverstyrt) {
    return (
      <Element>
      <FormattedMessage
        id="VurderAktiviteterTabell.Overstyrt.Overskrift"
        values={{ skjaeringstidspunkt: moment(skjaeringstidspunkt, 'YYYY-MM-DD').format(DDMMYYYY_DATE_FORMAT) }}
      />
      </Element>
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
      <Element>
      <FormattedMessage
        id="VurderAktiviteterTabell.FullAAPKombinert.Overskrift"
        values={{ skjaeringstidspunkt: moment(skjaeringstidspunkt, 'YYYY-MM-DD').format(DDMMYYYY_DATE_FORMAT) }}
      />
      </Element>

    );
  }
  if (harVentelonnVartpenger) {
    return (
      <Element>
      <FormattedMessage
        id="VurderAktiviteterTabell.VentelonnVartpenger.Overskrift"
        values={{ skjaeringstidspunkt: moment(skjaeringstidspunkt, 'YYYY-MM-DD').format(DDMMYYYY_DATE_FORMAT) }}
      />
      </Element>
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
  isAvklaringsbehovClosed,
  aktiviteter,
  skjaeringstidspunkt,
  alleKodeverk,
  erOverstyrt,
  harAvklaringsbehov,
  fieldArrayID,
  arbeidsgiverOpplysningerPerId,
}) => (
  <>
    {finnHeading(aktiviteter, erOverstyrt, skjaeringstidspunkt)}
    <Table headerTextCodes={getHeaderTextCodes(erOverstyrt, harAvklaringsbehov)} noHover>
      {aktiviteter.map(aktivitet =>
        lagTableRow(
          readOnly,
          isAvklaringsbehovClosed,
          aktivitet,
          alleKodeverk,
          erOverstyrt,
          harAvklaringsbehov,
          fieldArrayID,
          arbeidsgiverOpplysningerPerId,
        ),
      )}
    </Table>
  </>
);

VurderAktiviteterTabell.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  isAvklaringsbehovClosed: PropTypes.bool.isRequired,
  aktiviteter: PropTypes.arrayOf(beregningAktivitetPropType).isRequired,
  skjaeringstidspunkt: PropTypes.string.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  erOverstyrt: PropTypes.bool.isRequired,
  harAvklaringsbehov: PropTypes.bool.isRequired,
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
      arbeidsforholdRef: aktivitet.arbeidsforholdId,
      fom: aktivitet.fom,
      tom: aktivitet.tom,
      opptjeningAktivitetType: aktivitet.arbeidsforholdType ? aktivitet.arbeidsforholdType.kode : null,
      arbeidsgiverIdentifikator: aktivitet.arbeidsgiverIdent,
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

const skalBrukesPretufylling = (aktivitet, erOverstyrt, harAvklaringsbehov) => {
  if (skalVurdereAktivitet(aktivitet, erOverstyrt, harAvklaringsbehov)) {
    return aktivitet.skalBrukes;
  }
  return aktivitet.skalBrukes === true || aktivitet.skalBrukes === null || aktivitet.skalBrukes === undefined;
};

const mapToInitialValues = (aktivitet, erOverstyrt, harAvklaringsbehov) => ({
  fom: aktivitet.fom,
  tom: aktivitet.tom,
  skalBrukes: skalBrukesPretufylling(aktivitet, erOverstyrt, harAvklaringsbehov),
});

VurderAktiviteterTabell.buildInitialValues = (
  aktiviteter,
  erOverstyrt,
  harAvklaringsbehov,
) => {
  if (!aktiviteter) {
    return {};
  }
  const initialValues = {};
  aktiviteter.forEach(aktivitet => {
    initialValues[lagAktivitetFieldId(aktivitet)] = mapToInitialValues(
      aktivitet,
      erOverstyrt,
      harAvklaringsbehov,
    );
  });
  return initialValues;
};

export default VurderAktiviteterTabell;
