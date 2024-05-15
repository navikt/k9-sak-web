import removePeriod from '@fpsak-frontend/assets/images/remove.svg';
import removePeriodDisabled from '@fpsak-frontend/assets/images/remove_disabled.svg';
import { DatepickerField } from '@fpsak-frontend/form';
import { FlexColumn, FlexRow, Image } from '@fpsak-frontend/shared-components';
import { ArbeidsgiverOpplysningerPerId, Kodeverk, KodeverkMedNavn } from '@k9-sak-web/types';
import { Alert, Table } from '@navikt/ds-react';
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

      <Table>
        <Table.Header>
          <Table.Row>
            {headerTextCodes.map(text => (
              <Table.HeaderCell scope="col" key={text}>
                {intl.formatMessage({ id: text })}
              </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {fields.map((fieldId: string, index: number, field: FieldArrayFieldsProps<any>) => {
            const periode = field.get(index);
            return (
              <Table.Row key={periode.id} id={periode.id}>
                <Table.DataCell>
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
                </Table.DataCell>
                <Table.DataCell>
                  <FieldArray
                    name={`${fieldId}.andeler`}
                    // @ts-ignore
                    component={Andeler}
                    readOnly
                    alleKodeverk={alleKodeverk}
                    arbeidsgivere={arbeidsgivere}
                  />
                </Table.DataCell>
                <Table.DataCell>
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
                </Table.DataCell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
};

export default injectIntl(PeriodeRad);
