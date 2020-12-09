import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import { DateLabel, Image, PeriodLabel, Table, TableColumn, TableRow } from '@fpsak-frontend/shared-components';
import { decodeHtmlEntity, utledArbeidsforholdNavn } from '@fpsak-frontend/utils';
import erIBrukImageUrl from '@fpsak-frontend/assets/images/innvilget_hover.svg';
import { arbeidsforholdPropType } from '@fpsak-frontend/prop-types';
import advarselImageUrl from '@fpsak-frontend/assets/images/advarsel2.svg';
import chevronIkonUrl from '@fpsak-frontend/assets/images/pil_ned.svg';
import arbeidsforholdHandlingType from '@fpsak-frontend/kodeverk/src/arbeidsforholdHandlingType';
import FlexRow from '@fpsak-frontend/shared-components/src/flexGrid/FlexRow';
import IngenArbeidsforholdRegistrert from './IngenArbeidsforholdRegistrert';

import styles from './personArbeidsforholdTable.less';
import PersonArbeidsforholdDetailForm from '../arbeidsforholdDetaljer/PersonArbeidsforholdDetailForm';

const headerColumnContent = [
  <FormattedMessage key={1} id="PersonArbeidsforholdTable.Arbeidsforhold" values={{ br: <br /> }} />,
  <FormattedMessage key={2} id="PersonArbeidsforholdTable.Periode" values={{ br: <br /> }} />,
  <FormattedMessage key={3} id="PersonArbeidsforholdTable.Kilde" values={{ br: <br /> }} />,
  <FormattedMessage key={4} id="PersonArbeidsforholdTable.Stillingsprosent" values={{ br: <br /> }} />,
  <FormattedMessage key={5} id="PersonArbeidsforholdTable.MottattDato" values={{ br: <br /> }} />,
  <></>,
];

export const utledNøkkel = arbeidsforhold => {
  if (arbeidsforhold.lagtTilAvSaksbehandler) {
    return arbeidsforhold.navn;
  }
  return `${arbeidsforhold.eksternArbeidsforholdId}${arbeidsforhold.arbeidsforholdId}${arbeidsforhold.arbeidsgiverIdentifiktorGUI}`;
};

const updateArbeidsforhold = values => {
  const { selectedArbeidsforhold } = this.state;
  const { arbeidsforhold } = this.props;

  let fortsettBehandlingUtenInntektsmelding;
  if (values.inntektsmeldinger === undefined || !values.inntektsmeldinger) {
    fortsettBehandlingUtenInntektsmelding =
      values.arbeidsforholdHandlingField === arbeidsforholdHandlingType.BRUK_UTEN_INNTEKTSMELDING;
  }

  const inntektMedTilBeregningsgrunnlag =
    values.aktivtArbeidsforholdHandlingField === arbeidsforholdHandlingType.INNTEKT_IKKE_MED_I_BG ? false : undefined;

  const newValues = {
    ...values,
    brukMedJustertPeriode,
    brukArbeidsforholdet,
    fortsettBehandlingUtenInntektsmelding,
    inntektMedTilBeregningsgrunnlag,
    brukPermisjon,
    basertPaInntektsmelding: skalKunneLageArbeidsforholdBasertPaInntektsmelding,
  };

  const cleanedValues = cleanUpArbeidsforhold(newValues, selectedArbeidsforhold);

  let other = arbeidsforhold.filter(o => o.id !== cleanedValues.id);
  const oldState = arbeidsforhold.find(a => a.id === cleanedValues.id);
  let { fomDato } = cleanedValues;
  if (
    oldState !== undefined &&
    oldState !== null &&
    cleanedValues.erstatterArbeidsforholdId !== oldState.erstatterArbeidsforholdId
  ) {
    if (oldState.erstatterArbeidsforholdId) {
      other = other.map(o => (o.id === oldState.erstatterArbeidsforholdId ? { ...o, erSlettet: false } : o));
    }
    if (cleanedValues.erstatterArbeidsforholdId) {
      other = other.map(o => (o.id === cleanedValues.erstatterArbeidsforholdId ? { ...o, erSlettet: true } : o));
    }
    fomDato = findFomDato(
      cleanedValues,
      arbeidsforhold.find(a => a.id === cleanedValues.erstatterArbeidsforholdId),
    );
  }

  this.setFormField(
    'arbeidsforhold',
    other.concat({
      ...cleanedValues,
      fomDato,
      erEndret: true,
    }),
  );

  const unresolvedArbeidsforhold = removeDeleted(other);
  this.setSelectedArbeidsforhold(undefined, undefined, unresolvedArbeidsforhold);
};

const cancelArbeidsforhold = () => {
  this.setState({ selectedArbeidsforhold: undefined });
  this.initializeActivityForm({});
};

const PersonArbeidsforholdTable = ({ alleArbeidsforhold, selectedId, selectArbeidsforholdCallback, alleKodeverk }) => {
  const [selectedArbeidsforhold, setSelectedArbeidsforhold] = useState(undefined);
  const intl = useIntl();

  const visAksjonspunktInfo = arbeidsforhold => {
    if (selectedArbeidsforhold === undefined) {
      return false;
    }
    return arbeidsforhold.id === selectedArbeidsforhold.id && arbeidsforhold.aksjonspunktÅrsaker.length > 0;
  };

  const setValgtArbeidsforhold = arbeidsforhold => {
    if (selectedArbeidsforhold === undefined) {
      setSelectedArbeidsforhold(arbeidsforhold);
    }
    if (arbeidsforhold.id === selectedArbeidsforhold.id) {
      setSelectedArbeidsforhold(undefined);
    }
  };

  if (alleArbeidsforhold.length === 0) {
    return <IngenArbeidsforholdRegistrert headerColumnContent={headerColumnContent} />;
  }

  return (
    <Table headerColumnContent={headerColumnContent}>
      {alleArbeidsforhold &&
        alleArbeidsforhold.map(a => {
          const stillingsprosent =
            a.stillingsprosent !== undefined && a.stillingsprosent !== null
              ? `${parseFloat(a.stillingsprosent).toFixed(2)} %`
              : '';
          const navn = utledArbeidsforholdNavn(a);
          const kilde = a.kilde.length > 1 ? a.kilde.map(k => k.kode).join(',') : a.kilde[0].kode;
          return (
            <>
              <TableRow
                key={utledNøkkel(a)}
                model={a}
                onMouseDown={selectArbeidsforholdCallback}
                onKeyDown={selectArbeidsforholdCallback}
                isSelected={a.id === selectedId}
                isApLeftBorder={a.aksjonspunktÅrsaker.length > 0}
              >
                <TableColumn>
                  <Normaltekst>{decodeHtmlEntity(navn)}</Normaltekst>
                </TableColumn>
                <TableColumn>
                  <Normaltekst>
                    <PeriodLabel
                      dateStringFom={a.perioder ? a.perioder[0].fom : {}}
                      dateStringTom={a.perioder ? a.perioder[0].tom : {}}
                    />
                  </Normaltekst>
                </TableColumn>
                <TableColumn>
                  <Normaltekst>{kilde}</Normaltekst>
                </TableColumn>
                <TableColumn>
                  <Normaltekst>{stillingsprosent}</Normaltekst>
                </TableColumn>
                <TableColumn>
                  {a.inntektsmeldinger[0] && (
                    <Normaltekst>
                      <DateLabel dateString={a.inntektsmeldinger[0].mottattTidspunkt} />
                    </Normaltekst>
                  )}
                </TableColumn>
                {a.aksjonspunktÅrsaker.length > 0 && (
                  <TableColumn className={styles.aksjonspunktColumn}>
                    <Image
                      src={advarselImageUrl}
                      alt=""
                      tooltip={<FormattedMessage id="PersonArbeidsforholdTable.TrengerAvklaring" />}
                    />
                    <button className={styles.knappContainer} type="button" onClick={() => setValgtArbeidsforhold(a)}>
                      <Normaltekst className={styles.visLukkAksjonspunkt}>
                        {intl.formatMessage(
                          selectedArbeidsforhold === a
                            ? {
                                id: 'PersonArbeidsforholdTable.LukkAksjospunkt',
                              }
                            : {
                                id: 'PersonArbeidsforholdTable.VisAksjospunkt',
                              },
                        )}
                      </Normaltekst>
                      <Image
                        className={
                          selectedArbeidsforhold && selectedArbeidsforhold.id === a.id
                            ? styles.chevronOpp
                            : styles.chevronNed
                        }
                        src={chevronIkonUrl}
                        alt=""
                      />
                    </button>
                  </TableColumn>
                )}
                <TableColumn>
                  {a.brukArbeidsforholdet && (
                    <Image
                      className={styles.image}
                      src={erIBrukImageUrl}
                      alt={intl.formatMessage({ id: 'PersonArbeidsforholdTable.ErIBruk' })}
                      tooltip={<FormattedMessage id="PersonArbeidsforholdTable.ErIBruk" />}
                      tabIndex="0"
                      alignTooltipLeft
                    />
                  )}
                </TableColumn>
              </TableRow>
              {visAksjonspunktInfo(a) && (
                <FlexRow className={styles.aktivRad}>
                  <PersonArbeidsforholdDetailForm
                    key={selectedArbeidsforhold.id}
                    arbeidsforhold={selectedArbeidsforhold}
                    hasAksjonspunkter
                    hasOpenAksjonspunkter
                    updateArbeidsforhold={updateArbeidsforhold}
                    cancelArbeidsforhold={cancelArbeidsforhold}
                    aktivtArbeidsforholdTillatUtenIM
                    skalKunneLeggeTilNyeArbeidsforhold
                    skalKunneLageArbeidsforholdBasertPaInntektsmelding
                    behandlingId={857547954}
                    behandlingVersjon={2}
                    alleKodeverk={alleKodeverk}
                  />{' '}
                </FlexRow>
              )}
            </>
          );
        })}
    </Table>
  );
};

PersonArbeidsforholdTable.propTypes = {
  alleArbeidsforhold: PropTypes.arrayOf(arbeidsforholdPropType).isRequired,
  selectedId: PropTypes.string,
  selectArbeidsforholdCallback: PropTypes.func.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
};

PersonArbeidsforholdTable.defaultProps = {
  selectedId: undefined,
};

export default PersonArbeidsforholdTable;
