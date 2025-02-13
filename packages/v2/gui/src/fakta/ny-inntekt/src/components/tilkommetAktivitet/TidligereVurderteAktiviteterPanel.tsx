import { type JSX } from 'react';

import { BodyShort, Label, Tag } from '@navikt/ds-react';
import { EditedIcon, Table, TableColumn, TableRow } from '@navikt/ft-ui-komponenter';
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
        <TableRow key={getInntektsforholdIdentifikator(inntektsforhold)}>
          <TableColumn>
            <BodyShort size="small">
              {getAktivitetNavnFraInnteksforhold(inntektsforhold, arbeidsgiverOpplysningerPerId)}
            </BodyShort>
          </TableColumn>
          <TableColumn>
            <BodyShort size="small">{inntektsforhold.skalRedusereUtbetaling ? 'Ja' : 'Nei'}</BodyShort>
          </TableColumn>
          {(harBruttoInntekt || harInntektsmelding) && (
            <TableColumn>
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
            </TableColumn>
          )}
        </TableRow>,
      );
    });
    return tableRows;
  };

  const harInntektsforholdMedÅrsinntekt = vurderInntektsforholdPeriode.inntektsforholdListe.some(
    inntektsforhold => inntektsforhold.bruttoInntektPrÅr,
  );

  const headerTexts = ['Aktivitet', 'Reduserer inntektstap', harInntektsforholdMedÅrsinntekt ? 'Årsinntekt' : ' '];
  const headerComponents = headerTexts.map(text => (
    <Label size="small" key={text}>
      {`${text} `}
    </Label>
  ));

  return (
    <div className={styles.aktivitetContainer}>
      <Table headerColumnContent={headerComponents} noHover classNameTable={styles.aktivitetTable}>
        {getInntektsforholdTableRows(vurderInntektsforholdPeriode)}
      </Table>
    </div>
  );
};
