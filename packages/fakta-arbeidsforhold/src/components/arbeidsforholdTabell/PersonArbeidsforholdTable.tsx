import React, { Fragment, useState } from 'react';
import { FormattedMessage, IntlShape } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import { DateLabel, Image, PeriodLabel, Table, TableColumn, TableRow } from '@fpsak-frontend/shared-components';
import { decodeHtmlEntity } from '@fpsak-frontend/utils';
import erIBrukImageUrl from '@fpsak-frontend/assets/images/innvilget_hover.svg';
import chevronIkonUrl from '@fpsak-frontend/assets/images/pil_ned.svg';
import FlexRow from '@fpsak-frontend/shared-components/src/flexGrid/FlexRow';
import arbeidsforholdHandlingType from '@fpsak-frontend/kodeverk/src/arbeidsforholdHandlingType';
import {
  utledArbeidsforholdYrkestittel,
  arbeidsforholdHarAksjonspunktÅrsak,
} from '@fpsak-frontend/utils/src/arbeidsforholdUtils';
import ArbeidsforholdV2 from '@k9-sak-web/types/src/arbeidsforholdV2TsType';
import { KodeverkMedNavn } from '@k9-sak-web/types';
import IngenArbeidsforholdRegistrert from './IngenArbeidsforholdRegistrert';

import styles from './personArbeidsforholdTable.less';
import PersonArbeidsforholdDetailForm from '../arbeidsforholdDetaljer/PersonArbeidsforholdDetailForm';
import PermisjonerInfo from '../arbeidsforholdDetaljer/PermisjonerInfo';

const headerColumnContent = [
  <FormattedMessage key={1} id="PersonArbeidsforholdTable.Yrkestittel" values={{ br: <br /> }} />,
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
    <Table headerColumnContent={headerColumnContent}>
      {alleArbeidsforhold &&
        alleArbeidsforhold.map(a => {
          const stillingsprosent =
            a.stillingsprosent !== undefined && a.stillingsprosent !== null ? `${a.stillingsprosent.toFixed(2)} %` : '';
          const yrkestittel = utledArbeidsforholdYrkestittel(a);
          const kilde =
            Array.isArray(a.kilde) && (a.kilde.length > 1 ? a.kilde.map(k => k.kode).join(', ') : a.kilde[0].kode);
          const erValgt = selectedArbeidsforhold === a;
          const harPermisjoner = Array.isArray(a.permisjoner) && a.permisjoner.length > 0;
          const harPerioder = Array.isArray(a.perioder) && a.perioder.length > 0;
          const harInntektsmeldinger = Array.isArray(a.inntektsmeldinger) && a.inntektsmeldinger.length > 0;
          const harAksjonspunkt = harAksjonspunktAvklarArbeidsforhold && arbeidsforholdHarAksjonspunktÅrsak(a);

          return (
            <Fragment key={a.id}>
              <TableRow
                model={a}
                onMouseDown={() => setVisAksjonspunktInfo(true)}
                onKeyDown={() => setVisAksjonspunktInfo(true)}
                isSelected={a.id === selectedId}
                isApLeftBorder={harAksjonspunkt}
              >
                <TableColumn>
                  <Normaltekst>{decodeHtmlEntity(yrkestittel)}</Normaltekst>
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
                {!harAksjonspunkt && harPermisjoner && (
                  <TableColumn className={styles.aksjonspunktColumn}>
                    <button className={styles.knappContainer} type="button" onClick={() => setValgtArbeidsforhold(a)}>
                      <Normaltekst className={styles.visLukkPermisjon}>
                        {intl.formatMessage(
                          erValgt && visAksjonspunktInfo
                            ? { id: 'PersonArbeidsforholdTable.LukkPermisjon' }
                            : { id: 'PersonArbeidsforholdTable.VisPermisjon' },
                        )}
                      </Normaltekst>
                      <Image className={erValgt ? styles.chevronOpp : styles.chevronNed} src={chevronIkonUrl} alt="" />
                    </button>
                  </TableColumn>
                )}
                <TableColumn>
                  {a.handlingType && a.handlingType.kode === arbeidsforholdHandlingType.BRUK && !harAksjonspunkt && (
                    <Image
                      src={erIBrukImageUrl}
                      alt={intl.formatMessage({ id: 'PersonArbeidsforholdTable.ErIBruk' })}
                      tooltip={<FormattedMessage id="PersonArbeidsforholdTable.ErIBruk" />}
                      tabIndex={0}
                      alignTooltipLeft
                    />
                  )}
                </TableColumn>
              </TableRow>
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
                  <PermisjonerInfo arbeidsforhold={a} />
                </FlexRow>
              )}
            </Fragment>
          );
        })}
    </Table>
  );
};

export default PersonArbeidsforholdTable;
