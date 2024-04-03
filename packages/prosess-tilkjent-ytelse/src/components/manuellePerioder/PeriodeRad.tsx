import removePeriod from '@fpsak-frontend/assets/images/remove.svg';
import removePeriodDisabled from '@fpsak-frontend/assets/images/remove_disabled.svg';
import { DatepickerField } from '@fpsak-frontend/form';
import { FlexColumn, FlexRow, Image, Table, TableColumn, TableRow } from '@fpsak-frontend/shared-components';
import { ArbeidsgiverOpplysningerPerId, Kodeverk, KodeverkMedNavn } from '@k9-sak-web/types';
import { Alert } from '@navikt/ds-react';
import React from 'react';
import { WrappedComponentProps, injectIntl } from 'react-intl';
import { FieldArray, FieldArrayFieldsProps, FieldArrayMetaProps } from 'redux-form';
import Andeler from './Andeler';
import styles from './periode.module.css';

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
  isAnyFormOpen: (...args: any[]) => any;
  arbeidsgivere: ArbeidsgiverOpplysningerPerId;
}

const headerTextCodes = ['TilkjentYtelse.Periode', 'TilkjentYtelse.Andeler'];

const PeriodeRad = ({
  fields,
  meta,
  openSlettPeriodeModalCallback,
  alleKodeverk,
  intl,
  isNyPeriodeFormOpen,
  readOnly,
  arbeidsgivere,
  isAnyFormOpen,
}: Partial<OwnProps> & WrappedComponentProps) => {
  const isAnyFormOrNyPeriodeOpen = isAnyFormOpen() || isNyPeriodeFormOpen;
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

      <Table headerTextCodes={headerTextCodes}>
        {fields.map((fieldId: string, index: number, field: FieldArrayFieldsProps<any>) => {
          const periode = field.get(index);
          return (
            <TableRow key={periode.id} id={periode.id}>
              <TableColumn>
                <FlexRow>
                  <FlexColumn>
                    <DatepickerField
                      name={`${fieldId}.fom`}
                      label=""
                      // @ts-ignore
                      value={periode.fom}
                      readOnly
                    />
                  </FlexColumn>
                  <FlexColumn>
                    <DatepickerField
                      name={`${fieldId}.tom`}
                      label=""
                      // @ts-ignore
                      value={periode.tom}
                      readOnly
                    />
                  </FlexColumn>
                </FlexRow>
              </TableColumn>
              <TableColumn>
                <FieldArray
                  name={`${fieldId}.andeler`}
                  // @ts-ignore
                  component={Andeler}
                  readOnly
                  alleKodeverk={alleKodeverk}
                  arbeidsgivere={arbeidsgivere}
                />
              </TableColumn>
              <TableColumn>
                {!readOnly && (
                  <div className={styles.iconContainer}>
                    <Image
                      className={styles.removeIcon}
                      src={isAnyFormOrNyPeriodeOpen ? removePeriodDisabled : removePeriod}
                      onClick={
                        isAnyFormOrNyPeriodeOpen ? () => undefined : () => openSlettPeriodeModalCallback(periode.id)
                      }
                      alt={intl.formatMessage({ id: 'TilkjentYtelse.SlettPerioden' })}
                    />
                  </div>
                )}
              </TableColumn>
            </TableRow>
          );
        })}
      </Table>
    </div>
  );
};

export default injectIntl(PeriodeRad);
