import { ArbeidsgiverOpplysningerPerId, Kodeverk } from '@k9-sak-web/types';
import { Alert, BodyShort, Table } from '@navikt/ds-react';
import React from 'react';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import { WrappedComponentProps, useIntl } from 'react-intl';
import { FieldArrayFieldsProps, FieldArrayMetaProps } from 'redux-form';
import { createVisningsnavnForAndel, getInntektskategori } from '../TilkjentYteleseUtils';

interface OwnProps {
  fields: FieldArrayFieldsProps<any>;
  meta: FieldArrayMetaProps;
  openSlettPeriodeModalCallback: (...args: any[]) => any;
  updatePeriode: (...args: any[]) => any;
  editPeriode: (...args: any[]) => any;
  cancelEditPeriode: (...args: any[]) => any;
  readOnly: boolean;
  perioder: any[];
  isNyPeriodeFormOpen: boolean;
  behandlingVersjon: number;
  behandlingId: number;
  behandlingStatus: Kodeverk;
  arbeidsgivere: ArbeidsgiverOpplysningerPerId;
}

const headerTextCodes = [
  'TilkjentYtelse.NyPeriode.Inntektskategori',
  'TilkjentYtelse.NyPeriode.Arbeidsgiver',
  'TilkjentYtelse.NyPeriode.TilSoker',
  'TilkjentYtelse.NyPeriode.Refusjon',
  'TilkjentYtelse.NyPeriode.Ubetalingsgrad',
];

const Andeler = ({ fields, meta, arbeidsgivere }: Partial<OwnProps> & WrappedComponentProps) => {
  const intl = useIntl();
  const { kodeverkNavnFraKode } = useKodeverkContext();

  return (
    <div>
      {meta.error && (
        <Alert size="small" variant="error">
          {meta.error}
        </Alert>
      )}
      {meta.warning && (
        <Alert size="small" variant="info">
          {meta.warning}
        </Alert>
      )}

      <Table>
        <Table.Header>
          <Table.Row>
            {headerTextCodes.map(textCode => (
              <Table.HeaderCell scope="col" key={textCode}>
                {intl.formatMessage({ id: textCode })}
              </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {fields.map((fieldId: string, index: number, field: FieldArrayFieldsProps<any>) => {
            const andel = field.get(index);
            const inntektskategori = getInntektskategori(andel.inntektskategori, kodeverkNavnFraKode);
            const arbeidsgiver = createVisningsnavnForAndel(andel, kodeverkNavnFraKode, arbeidsgivere);

            return (
              <Table.Row key={fieldId}>
                <Table.DataCell>
                  <BodyShort size="small">{inntektskategori}</BodyShort>
                </Table.DataCell>
                <Table.DataCell>
                  <BodyShort size="small">{arbeidsgiver}</BodyShort>
                </Table.DataCell>
                <Table.DataCell>
                  <BodyShort size="small">{andel.tilSoker}</BodyShort>
                </Table.DataCell>
                <Table.DataCell>
                  <BodyShort size="small">{andel.refusjon}</BodyShort>
                </Table.DataCell>
                <Table.DataCell>
                  <BodyShort size="small">{andel.utbetalingsgrad}</BodyShort>
                </Table.DataCell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
};

export default Andeler;
