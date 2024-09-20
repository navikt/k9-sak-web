import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import { ArbeidsgiverOpplysningerPerId } from '@k9-sak-web/types';
import { Alert, BodyShort, Table } from '@navikt/ds-react';
import { useFormContext } from 'react-hook-form';
import {
  createArbeidsgiverVisningsnavnForAndel,
  createPrivatarbeidsgiverVisningsnavnForAndel,
  getInntektskategori,
} from '../TilkjentYteleseUtils';
import { TilkjentYtelseFormState } from './FormState';

interface OwnProps {
  name: string;
  arbeidsgivere: ArbeidsgiverOpplysningerPerId;
}

const headerTextCodes = [
  'Inntektskategori',
  'Arbeidsgiver',
  'Arbeidsgiver (privatperson)',
  'Til søker',
  'Refusjon',
  'Uttaksgrad',
];

const Andeler = ({ name, arbeidsgivere }: Partial<OwnProps>) => {
  const { kodeverkNavnFraKode } = useKodeverkContext();
  const {
    formState: { errors },
    watch,
  } = useFormContext<TilkjentYtelseFormState>();

  const error = errors?.[name];

  const andeler = watch(name as 'perioder.0.andeler');
  return (
    <div>
      {error && (
        <Alert size="small" variant="error">
          {error}
        </Alert>
      )}

      <Table>
        <Table.Header>
          <Table.Row>
            {headerTextCodes.map(textCode => (
              <Table.HeaderCell scope="col" key={textCode}>
                {textCode}
              </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {andeler.map(andel => {
            const inntektskategori = getInntektskategori(andel.inntektskategori, kodeverkNavnFraKode);
            const arbeidsgiver = createArbeidsgiverVisningsnavnForAndel(andel, kodeverkNavnFraKode, arbeidsgivere);
            const arbeidsgiverPrivatperson = createPrivatarbeidsgiverVisningsnavnForAndel(
              andel,
              kodeverkNavnFraKode,
              arbeidsgivere,
            );

            return (
              <Table.Row key={andel.arbeidsgiverOrgnr}>
                <Table.DataCell>
                  <BodyShort size="small">{inntektskategori}</BodyShort>
                </Table.DataCell>
                <Table.DataCell>
                  <BodyShort size="small">{arbeidsgiver}</BodyShort>
                </Table.DataCell>
                <Table.DataCell>
                  <BodyShort size="small">{arbeidsgiverPrivatperson}</BodyShort>
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
