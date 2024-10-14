import { XMarkIcon } from '@navikt/aksel-icons';
import { Alert, Button, HStack, Table } from '@navikt/ds-react';
import { Datepicker } from '@navikt/ft-form-hooks';
import { useFieldArray, useFormContext } from 'react-hook-form';
import type { ArbeidsgiverOpplysningerPerId } from '../../types/arbeidsgiverOpplysningerType';
import Andeler from './Andeler';
import type { TilkjentYtelseFormState } from './FormState';
import styles from './periode.module.css';

interface OwnProps {
  openSlettPeriodeModalCallback: (...args: any[]) => any;
  readOnly: boolean;
  isNyPeriodeFormOpen: boolean;
  isAnyFormOpen: () => boolean;
  arbeidsgivere: ArbeidsgiverOpplysningerPerId;
}

const headerTextCodes = ['Periode', 'Andeler'];

const PeriodeRad = ({
  openSlettPeriodeModalCallback,
  isNyPeriodeFormOpen,
  readOnly,
  arbeidsgivere,
  isAnyFormOpen,
}: OwnProps) => {
  const { control, formState } = useFormContext<TilkjentYtelseFormState>();
  const { fields } = useFieldArray({
    control,
    name: 'perioder',
    keyName: 'fieldId',
  });
  const isAnyFormOrNyPeriodeOpen = isAnyFormOpen() || isNyPeriodeFormOpen;
  const error = formState.errors?.perioder;
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
            {headerTextCodes.map(text => (
              <Table.HeaderCell scope="col" key={text}>
                {text}
              </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {fields.map((item, index) => {
            return (
              <Table.Row key={item.fieldId} id={item.fieldId}>
                <Table.DataCell>
                  <HStack gap="2">
                    <Datepicker name={`perioder.${index}.fom`} label="" isReadOnly />
                    <Datepicker name={`perioder.${index}.tom`} label="" isReadOnly />
                  </HStack>
                </Table.DataCell>
                <Table.DataCell>
                  <Andeler name={`perioder.${index}.andeler`} arbeidsgivere={arbeidsgivere} />
                </Table.DataCell>
                <Table.DataCell>
                  {!readOnly && (
                    <div className={styles['iconContainer']}>
                      <Button
                        icon={
                          <XMarkIcon title="Slett Perioden" fontSize="1.5rem" className="text-[var(--a-nav-red)]" />
                        }
                        variant="tertiary"
                        size="small"
                        onClick={
                          isAnyFormOrNyPeriodeOpen ? () => undefined : () => openSlettPeriodeModalCallback(item.id)
                        }
                      />
                    </div>
                  )}
                </Table.DataCell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
};

export default PeriodeRad;
