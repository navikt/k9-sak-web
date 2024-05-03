import erIBrukImageUrl from '@k9-sak-web/assets/images/innvilget_hover.svg';
import chevronIkonUrl from '@k9-sak-web/assets/images/pil_ned.svg';
import arbeidsforholdHandlingType from '@k9-sak-web/kodeverk/src/arbeidsforholdHandlingType';
import { DateLabel, Image, PeriodLabel } from '@k9-sak-web/shared-components';
import FlexRow from '@k9-sak-web/shared-components/src/flexGrid/FlexRow';
import { KodeverkMedNavn } from '@k9-sak-web/types';
import ArbeidsforholdV2 from '@k9-sak-web/types/src/arbeidsforholdV2TsType';
import { decodeHtmlEntity } from '@k9-sak-web/utils';
import { arbeidsforholdHarAksjonspunktÅrsak } from '@k9-sak-web/utils/src/arbeidsforholdUtils';
import { BodyShort, Table } from '@navikt/ds-react';
import React, { Fragment, useState } from 'react';
import { FormattedMessage, IntlShape } from 'react-intl';
import PermisjonerInfo from '../arbeidsforholdDetaljer/PermisjonerInfo';
import PersonArbeidsforholdDetailForm from '../arbeidsforholdDetaljer/PersonArbeidsforholdDetailForm';
import IngenArbeidsforholdRegistrert from './IngenArbeidsforholdRegistrert';
import styles from './personArbeidsforholdTable.module.css';

const headerColumnContent = [
  <FormattedMessage key={1} id="PersonArbeidsforholdTable.ArbeidsforholdId" values={{ br: <br /> }} />,
  <FormattedMessage key={2} id="PersonArbeidsforholdTable.Periode" values={{ br: <br /> }} />,
  <FormattedMessage key={3} id="PersonArbeidsforholdTable.Kilde" values={{ br: <br /> }} />,
  <FormattedMessage key={4} id="PersonArbeidsforholdTable.Stillingsprosent" values={{ br: <br /> }} />,
  <FormattedMessage key={5} id="PersonArbeidsforholdTable.MottattDato" values={{ br: <br /> }} />,
  // eslint-disable-next-line react/jsx-no-useless-fragment
  <></>,
];

interface OwnProps {
  alleArbeidsforhold: ArbeidsforholdV2[];
  updateArbeidsforhold: (values: any) => void;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  selectedId?: string;
  behandlingId: number;
  behandlingVersjon: number;
  intl: IntlShape;
  harAksjonspunktAvklarArbeidsforhold: boolean;
}

const PersonArbeidsforholdTable = ({
  alleArbeidsforhold,
  selectedId,
  alleKodeverk,
  behandlingId,
  behandlingVersjon,
  updateArbeidsforhold,
  intl,
  harAksjonspunktAvklarArbeidsforhold,
}: OwnProps) => {
  const [selectedArbeidsforhold, setSelectedArbeidsforhold] = useState(undefined);
  const [visAksjonspunktInfo, setVisAksjonspunktInfo] = useState(true);

  const visPermisjon = (arbeidsforhold: ArbeidsforholdV2) =>
    !(harAksjonspunktAvklarArbeidsforhold && arbeidsforholdHarAksjonspunktÅrsak(arbeidsforhold)) &&
    arbeidsforhold.permisjoner;

  const setValgtArbeidsforhold = (arbeidsforhold: ArbeidsforholdV2) => {
    if (selectedArbeidsforhold === undefined) {
      setVisAksjonspunktInfo(true);
      setSelectedArbeidsforhold(arbeidsforhold);
    }
    if (arbeidsforhold === selectedArbeidsforhold && !visAksjonspunktInfo) {
      setSelectedArbeidsforhold(undefined);
      setVisAksjonspunktInfo(true);
    }

    if (selectedArbeidsforhold === arbeidsforhold && visAksjonspunktInfo) {
      setSelectedArbeidsforhold(undefined);
      setVisAksjonspunktInfo(false);
    }
  };

  if (alleArbeidsforhold.length === 0) {
    return <IngenArbeidsforholdRegistrert headerColumnContent={headerColumnContent} />;
  }

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          {headerColumnContent.map(textCode => (
            <Table.HeaderCell scope="col" key={textCode.key}>
              {textCode}
            </Table.HeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {alleArbeidsforhold &&
          alleArbeidsforhold.map(a => {
            const stillingsprosent =
              a.stillingsprosent !== undefined && a.stillingsprosent !== null
                ? `${a.stillingsprosent.toFixed(2)} %`
                : '';
            const arbeidsforholdId = a.arbeidsforhold.eksternArbeidsforholdId;
            const kilde =
              Array.isArray(a.kilde) && (a.kilde.length > 1 ? a.kilde.map(k => k.kode).join(', ') : a.kilde[0].kode);
            const erValgt = selectedArbeidsforhold === a;
            const harPermisjoner = Array.isArray(a.permisjoner) && a.permisjoner.length > 0;
            const harPerioder = Array.isArray(a.perioder) && a.perioder.length > 0;
            const harInntektsmeldinger = Array.isArray(a.inntektsmeldinger) && a.inntektsmeldinger.length > 0;
            const harAksjonspunkt = harAksjonspunktAvklarArbeidsforhold && arbeidsforholdHarAksjonspunktÅrsak(a);

            return (
              <Fragment key={a.id}>
                <Table.Row
                  onClick={() => setVisAksjonspunktInfo(true)}
                  selected={a.id === selectedId}
                  className={harAksjonspunkt ? 'border-solid border-0 border-l-[5px] border-[#fa3]' : ''}
                >
                  <Table.DataCell>
                    <BodyShort size="small">{decodeHtmlEntity(arbeidsforholdId)}</BodyShort>
                  </Table.DataCell>
                  <Table.DataCell>
                    <BodyShort size="small">
                      {harPerioder ? (
                        <PeriodLabel dateStringFom={a.perioder[0].fom} dateStringTom={a.perioder[0].tom} />
                      ) : (
                        '-'
                      )}
                    </BodyShort>
                  </Table.DataCell>
                  <Table.DataCell>
                    <BodyShort size="small">{kilde}</BodyShort>
                  </Table.DataCell>
                  <Table.DataCell>
                    <BodyShort size="small">{stillingsprosent}</BodyShort>
                  </Table.DataCell>
                  <Table.DataCell>
                    {harInntektsmeldinger && a.inntektsmeldinger[0].mottattTidspunkt && (
                      <BodyShort size="small">
                        <DateLabel dateString={a.inntektsmeldinger[0].mottattTidspunkt} />
                      </BodyShort>
                    )}
                  </Table.DataCell>

                  <Table.DataCell className={styles.aksjonspunktColumn}>
                    {!harAksjonspunkt && harPermisjoner ? (
                      <button className={styles.knappContainer} type="button" onClick={() => setValgtArbeidsforhold(a)}>
                        <BodyShort size="small" className={styles.visLukkPermisjon}>
                          {intl.formatMessage(
                            erValgt && visAksjonspunktInfo
                              ? { id: 'PersonArbeidsforholdTable.LukkPermisjon' }
                              : { id: 'PersonArbeidsforholdTable.VisPermisjon' },
                          )}
                        </BodyShort>
                        <Image
                          className={erValgt ? styles.chevronOpp : styles.chevronNed}
                          src={chevronIkonUrl}
                          alt=""
                        />
                      </button>
                    ) : (
                      ''
                    )}
                  </Table.DataCell>
                  <Table.DataCell>
                    {a.handlingType && a.handlingType.kode === arbeidsforholdHandlingType.BRUK && !harAksjonspunkt && (
                      <Image
                        src={erIBrukImageUrl}
                        alt={intl.formatMessage({ id: 'PersonArbeidsforholdTable.ErIBruk' })}
                        tooltip={<FormattedMessage id="PersonArbeidsforholdTable.ErIBruk" />}
                        tabIndex={0}
                        alignTooltipLeft
                      />
                    )}
                  </Table.DataCell>
                </Table.Row>
                {visAksjonspunktInfo && harAksjonspunkt && (
                  <PersonArbeidsforholdDetailForm
                    key={a.id}
                    arbeidsforhold={a}
                    updateArbeidsforhold={updateArbeidsforhold}
                    skjulArbeidsforhold={() => setVisAksjonspunktInfo(false)}
                    behandlingId={behandlingId}
                    behandlingVersjon={behandlingVersjon}
                    alleKodeverk={alleKodeverk}
                  />
                )}
                {erValgt && visPermisjon(a) && (
                  <FlexRow>
                    <PermisjonerInfo arbeidsforhold={a} alleKodeverk={alleKodeverk} />
                  </FlexRow>
                )}
              </Fragment>
            );
          })}
      </Table.Body>
    </Table>
  );
};

export default PersonArbeidsforholdTable;
