import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import { DateLabel, Image, PeriodLabel, Table, TableColumn, TableRow } from '@fpsak-frontend/shared-components';
import { decodeHtmlEntity } from '@fpsak-frontend/utils';
import erIBrukImageUrl from '@fpsak-frontend/assets/images/innvilget_hover.svg';
import advarselImageUrl from '@fpsak-frontend/assets/images/advarsel2.svg';
import chevronIkonUrl from '@fpsak-frontend/assets/images/pil_ned.svg';
import FlexRow from '@fpsak-frontend/shared-components/src/flexGrid/FlexRow';
import arbeidsforholdHandlingType from '@fpsak-frontend/kodeverk/src/arbeidsforholdHandlingType';
import { arbeidsforholdV2PropType } from '@fpsak-frontend/prop-types/src/arbeidsforholdPropType';
import { utledArbeidsforholdYrkestittel } from '@fpsak-frontend/utils/src/arbeidsforholdUtils';
import IngenArbeidsforholdRegistrert from './IngenArbeidsforholdRegistrert';

import styles from './personArbeidsforholdTable.less';
import PersonArbeidsforholdDetailFormV2 from '../arbeidsforholdDetaljer/PersonArbeidsforholdDetailFormV2';
import PermisjonerInfo from '../arbeidsforholdDetaljer/PermisjonerInfo';

const headerColumnContent = [
  <FormattedMessage key={1} id="PersonArbeidsforholdTable.Arbeidsforhold" values={{ br: <br /> }} />,
  <FormattedMessage key={2} id="PersonArbeidsforholdTable.Periode" values={{ br: <br /> }} />,
  <FormattedMessage key={3} id="PersonArbeidsforholdTable.Kilde" values={{ br: <br /> }} />,
  <FormattedMessage key={4} id="PersonArbeidsforholdTable.Stillingsprosent" values={{ br: <br /> }} />,
  <FormattedMessage key={5} id="PersonArbeidsforholdTable.MottattDato" values={{ br: <br /> }} />,
  <></>,
];

export const utledNøkkel = ({ id, arbeidsforhold }) => {
  const arbeidsforholdId =
    id || (arbeidsforhold && arbeidsforhold.arbeidsforholdId ? arbeidsforhold.arbeidsforholdId : '');
  const internId = arbeidsforhold && arbeidsforhold.internArbeidsforholdId ? arbeidsforhold.internArbeidsforholdId : '';
  const eksternId =
    arbeidsforhold && arbeidsforhold.eksternArbeidsforholdId ? arbeidsforhold.eksternArbeidsforholdId : '';

  return `${arbeidsforholdId}${internId}${eksternId}`;
};

const PersonArbeidsforholdTableV2 = ({
  alleArbeidsforhold,
  selectedId,
  selectArbeidsforholdCallback,
  alleKodeverk,
  behandlingId,
  behandlingVersjon,
  updateArbeidsforhold,
}) => {
  const [selectedArbeidsforhold, setSelectedArbeidsforhold] = useState(undefined);
  const [visAksjonspunktInfo, setVisAksjonspunktInfo] = useState(false);
  const intl = useIntl();

  const visPermisjon = arbeidsforhold => {
    if (selectedArbeidsforhold === undefined) {
      return false;
    }
    return (
      arbeidsforhold.id === selectedArbeidsforhold.id &&
      arbeidsforhold.aksjonspunktÅrsaker.length === 0 &&
      arbeidsforhold.permisjoner
    );
  };

  const setValgtArbeidsforhold = arbeidsforhold => {
    if (selectedArbeidsforhold === undefined) {
      setVisAksjonspunktInfo(true);
      setSelectedArbeidsforhold(arbeidsforhold);
    }
    if (arbeidsforhold.id === selectedArbeidsforhold.id && !visAksjonspunktInfo) {
      setSelectedArbeidsforhold(undefined);
      setVisAksjonspunktInfo(true);
    }

    if (arbeidsforhold.id === selectedArbeidsforhold.id && visAksjonspunktInfo) {
      setSelectedArbeidsforhold(undefined);
      setVisAksjonspunktInfo(false);
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
          const navn = utledArbeidsforholdYrkestittel(a);
          const kilde =
            Array.isArray(a.kilde) && (a.kilde.length > 1 ? a.kilde.map(k => k.kode).join(', ') : a.kilde[0].kode);

          const harAksjonspunktÅrsaker = Array.isArray(a.aksjonspunktÅrsaker) && a.aksjonspunktÅrsaker.length > 0;
          const harPermisjoner = Array.isArray(a.permisjoner) && a.permisjoner.length > 0;
          const harPerioder = Array.isArray(a.perioder) && a.perioder.length > 0;
          const harInntektsmeldinger = Array.isArray(a.inntektsmeldinger) && a.inntektsmeldinger.length > 0;

          return (
            <>
              <TableRow
                key={utledNøkkel(a)}
                model={a}
                onMouseDown={selectArbeidsforholdCallback}
                onKeyDown={selectArbeidsforholdCallback}
                isSelected={a.id === selectedId}
                isApLeftBorder={harAksjonspunktÅrsaker}
              >
                <TableColumn>
                  <Normaltekst>{decodeHtmlEntity(navn)}</Normaltekst>
                </TableColumn>
                <TableColumn>
                  <Normaltekst>
                    {harPerioder ? (
                      <PeriodLabel dateStringFom={a.perioder[0].fom} dateStringTom={a.perioder[0].tom} />
                    ) : (
                      '-'
                    )}
                  </Normaltekst>
                </TableColumn>
                <TableColumn>
                  <Normaltekst>{kilde}</Normaltekst>
                </TableColumn>
                <TableColumn>
                  <Normaltekst>{stillingsprosent}</Normaltekst>
                </TableColumn>
                <TableColumn>
                  {harInntektsmeldinger && a.inntektsmeldinger[0].mottattTidspunkt && (
                    <Normaltekst>
                      <DateLabel dateString={a.inntektsmeldinger[0].mottattTidspunkt} />
                    </Normaltekst>
                  )}
                </TableColumn>
                {harAksjonspunktÅrsaker && (
                  <TableColumn className={styles.aksjonspunktColumn}>
                    <button className={styles.knappContainer} type="button" onClick={() => setValgtArbeidsforhold(a)}>
                      <Image
                        src={advarselImageUrl}
                        alt=""
                        tooltip={<FormattedMessage id="PersonArbeidsforholdTable.TrengerAvklaring" />}
                      />
                      <Normaltekst className={styles.visLukkAksjonspunkt}>
                        {intl.formatMessage(
                          selectedArbeidsforhold === a && visAksjonspunktInfo
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
                          selectedArbeidsforhold && selectedArbeidsforhold.id === a.id && visAksjonspunktInfo
                            ? styles.chevronOpp
                            : styles.chevronNed
                        }
                        src={chevronIkonUrl}
                        alt=""
                      />
                    </button>
                  </TableColumn>
                )}
                {(!harAksjonspunktÅrsaker || a.aksjonspunktÅrsaker.length === 0) && harPermisjoner && (
                  <TableColumn className={styles.aksjonspunktColumn}>
                    <button className={styles.knappContainer} type="button" onClick={() => setValgtArbeidsforhold(a)}>
                      <Normaltekst className={styles.visLukkAksjonspunkt}>
                        {intl.formatMessage(
                          selectedArbeidsforhold === a && visAksjonspunktInfo
                            ? { id: 'PersonArbeidsforholdTable.LukkPermisjon' }
                            : { id: 'PersonArbeidsforholdTable.VisPermisjon' },
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
                  {a.handlingType === arbeidsforholdHandlingType.BRUK && a.aksjonspunktÅrsaker.length === 0 && (
                    <Image
                      src={erIBrukImageUrl}
                      alt={intl.formatMessage({ id: 'PersonArbeidsforholdTable.ErIBruk' })}
                      tooltip={<FormattedMessage id="PersonArbeidsforholdTable.ErIBruk" />}
                      tabIndex="0"
                      alignTooltipLeft
                    />
                  )}
                </TableColumn>
              </TableRow>
              {selectedArbeidsforhold && selectedArbeidsforhold.id === a.id && visAksjonspunktInfo && (
                <PersonArbeidsforholdDetailFormV2
                  key={a.id}
                  arbeidsforhold={selectedArbeidsforhold}
                  hasAksjonspunkter
                  hasOpenAksjonspunkter
                  updateArbeidsforhold={updateArbeidsforhold}
                  skjulArbeidsforhold={() => setVisAksjonspunktInfo(false)}
                  aktivtArbeidsforholdTillatUtenIM
                  behandlingId={behandlingId}
                  behandlingVersjon={behandlingVersjon}
                  alleKodeverk={alleKodeverk}
                />
              )}
              {visPermisjon(a) && (
                <FlexRow>
                  <PermisjonerInfo arbeidsforhold={a} />
                </FlexRow>
              )}
            </>
          );
        })}
    </Table>
  );
};

PersonArbeidsforholdTableV2.propTypes = {
  alleArbeidsforhold: PropTypes.arrayOf(arbeidsforholdV2PropType).isRequired,
  selectedId: PropTypes.string,
  selectArbeidsforholdCallback: PropTypes.func.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  updateArbeidsforhold: PropTypes.func.isRequired,
};

PersonArbeidsforholdTableV2.defaultProps = {
  selectedId: undefined,
};

export default PersonArbeidsforholdTableV2;
