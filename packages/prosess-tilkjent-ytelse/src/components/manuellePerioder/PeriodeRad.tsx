import removePeriod from '@fpsak-frontend/assets/images/remove.svg';
import removePeriodDisabled from '@fpsak-frontend/assets/images/remove_disabled.svg';
import { FlexColumn, FlexRow, Image } from '@fpsak-frontend/shared-components';
import { ArbeidsgiverOpplysningerPerId } from '@k9-sak-web/types';
import { Alert, Table } from '@navikt/ds-react';
import { RhfDatepicker } from '@navikt/ft-form-hooks';
import { useFieldArray, useFormContext } from 'react-hook-form';
import Andeler from './Andeler';
import { TilkjentYtelseFormState } from './FormState';
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
}: Partial<OwnProps>) => {
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
          {/* @ts-expect-error Ser ut som vi forventer en string, men typen er noe annet */}
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
                  <FlexRow>
                    <FlexColumn>
                      <RhfDatepicker control={control} name={`perioder.${index}.fom`} label="" isReadOnly />
                    </FlexColumn>
                    <FlexColumn>
                      <RhfDatepicker control={control} name={`perioder.${index}.tom`} label="" isReadOnly />
                    </FlexColumn>
                  </FlexRow>
                </Table.DataCell>
                <Table.DataCell>
                  <Andeler name={`perioder.${index}.andeler`} arbeidsgivere={arbeidsgivere} />
                </Table.DataCell>
                <Table.DataCell>
                  {!readOnly && (
                    <div className={styles.iconContainer}>
                      <Image
                        className={styles.removeIcon}
                        src={isAnyFormOrNyPeriodeOpen ? removePeriodDisabled : removePeriod}
                        onClick={
                          isAnyFormOrNyPeriodeOpen ? () => undefined : () => openSlettPeriodeModalCallback(item.id)
                        }
                        alt="Slett Perioden"
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
