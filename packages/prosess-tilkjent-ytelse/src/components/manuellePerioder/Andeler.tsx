import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { Table, TableColumn } from '@fpsak-frontend/shared-components';
import { getKodeverknavnFn } from '@fpsak-frontend/utils';
import { ArbeidsgiverOpplysningerPerId, Kodeverk, KodeverkMedNavn } from '@k9-sak-web/types';
import { BodyShort } from '@navikt/ds-react';
import AlertStripe from 'nav-frontend-alertstriper';
import React from 'react';
import { WrappedComponentProps } from 'react-intl';
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
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  arbeidsgivere: ArbeidsgiverOpplysningerPerId;
}

const headerTextCodes = [
  'TilkjentYtelse.NyPeriode.Inntektskategori',
  'TilkjentYtelse.NyPeriode.Arbeidsgiver',
  'TilkjentYtelse.NyPeriode.TilSoker',
  'TilkjentYtelse.NyPeriode.Refusjon',
  'TilkjentYtelse.NyPeriode.Ubetalingsgrad',
];

const Andeler = ({ fields, meta, alleKodeverk, arbeidsgivere }: Partial<OwnProps> & WrappedComponentProps) => {
  const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);

  return (
    <div>
      {meta.error && <AlertStripe type="feil">{meta.error}</AlertStripe>}
      {meta.warning && <AlertStripe type="info">{meta.warning}</AlertStripe>}

      <Table headerTextCodes={headerTextCodes}>
        {fields.map((fieldId: string, index: number, field: FieldArrayFieldsProps<any>) => {
          const andel = field.get(index);
          const inntektskategori = getInntektskategori(andel.inntektskategori, getKodeverknavn);
          const arbeidsgiver = createVisningsnavnForAndel(andel, getKodeverknavn, arbeidsgivere);

          return (
            <tr>
              <TableColumn>
                <BodyShort size="small">{inntektskategori}</BodyShort>
              </TableColumn>
              <TableColumn>
                <BodyShort size="small">{arbeidsgiver}</BodyShort>
              </TableColumn>
              <TableColumn>
                <BodyShort size="small">{andel.tilSoker}</BodyShort>
              </TableColumn>
              <TableColumn>
                <BodyShort size="small">{andel.refusjon}</BodyShort>
              </TableColumn>
              <TableColumn>
                <BodyShort size="small">{andel.utbetalingsgrad}</BodyShort>
              </TableColumn>
            </tr>
          );
        })}
      </Table>
    </div>
  );
};

export default Andeler;
