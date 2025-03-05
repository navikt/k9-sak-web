import { type JSX } from 'react';

import { BodyShort, Table, Tag } from '@navikt/ds-react';
import { EditedIcon } from '@navikt/ft-ui-komponenter';
import { formatCurrencyWithKr } from '@navikt/ft-utils';

import { getAktivitetNavnFraInnteksforhold } from './TilkommetAktivitetUtils';
import { getInntektsforholdIdentifikator } from './TilkommetInntektsforholdField';

import type { ArbeidsgiverOpplysningerPerId } from '../../types/ArbeidsgiverOpplysninger';
import type { VurderInntektsforholdPeriode } from '../../types/BeregningsgrunnlagFordeling';
import styles from './tilkommetAktivitet.module.css';

type Props = {
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  vurderInntektsforholdPeriode: VurderInntektsforholdPeriode;
};

const erDefinert = (tall?: number) => !!tall && +tall > 0;

export const TidligereVurderteAktiviteterPanel = ({
  arbeidsgiverOpplysningerPerId,
  vurderInntektsforholdPeriode,
}: Props) => {
  const getInntektsforholdTableRows = (inntektsforholdPeriode: VurderInntektsforholdPeriode): JSX.Element[] => {
    const tableRows: JSX.Element[] = [];
    inntektsforholdPeriode.inntektsforholdListe.forEach(inntektsforhold => {
      const harBruttoInntekt = erDefinert(inntektsforhold.bruttoInntektPrÅr);
      const harInntektsmelding = erDefinert(inntektsforhold.inntektFraInntektsmeldingPrÅr);
      tableRows.push(
        <Table.Row key={getInntektsforholdIdentifikator(inntektsforhold)}>
          <Table.DataCell>
            <BodyShort size="small">
              {getAktivitetNavnFraInnteksforhold(inntektsforhold, arbeidsgiverOpplysningerPerId)}
            </BodyShort>
          </Table.DataCell>
          <Table.DataCell>
            <BodyShort size="small">{inntektsforhold.skalRedusereUtbetaling ? 'Ja' : 'Nei'}</BodyShort>
          </Table.DataCell>
          {(harBruttoInntekt || harInntektsmelding) && (
            <Table.DataCell>
              <BodyShort size="small">
                {harBruttoInntekt && (
                  <>
                    {formatCurrencyWithKr(inntektsforhold.bruttoInntektPrÅr || 0)}
                    <EditedIcon />
                  </>
                )}
                {harInntektsmelding && !harBruttoInntekt && (
                  <>
                    {formatCurrencyWithKr(inntektsforhold.inntektFraInntektsmeldingPrÅr || 0)}
                    <Tag className={styles.inntektsmeldingTag} variant="neutral" size="xsmall">
                      IM
                    </Tag>
                  </>
                )}
              </BodyShort>
            </Table.DataCell>
          )}
        </Table.Row>,
      );
    });
    return tableRows;
  };

  const harInntektsforholdMedÅrsinntekt = vurderInntektsforholdPeriode.inntektsforholdListe.some(
    inntektsforhold => inntektsforhold.bruttoInntektPrÅr,
  );

  const headerTexts = ['Aktivitet', 'Reduserer inntektstap', harInntektsforholdMedÅrsinntekt ? 'Årsinntekt' : ' '];

  return (
    <div className={styles.aktivitetContainer}>
      <Table size="small" className={styles.aktivitetTable}>
        <Table.Header>
          <Table.Row>
            {headerTexts.map(text => (
              <Table.HeaderCell scope="col" key={text}>
                {text}
              </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>{getInntektsforholdTableRows(vurderInntektsforholdPeriode)}</Table.Body>
      </Table>
    </div>
  );
};
