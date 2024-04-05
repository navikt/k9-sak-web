import { InputField } from '@fpsak-frontend/form/index';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { Table, TableColumn, TableRow, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { hasValidFodselsnummer, maxLength, minLength, required } from '@fpsak-frontend/utils';
import { Delete } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { fosterbarnDto } from '../dto/FosterbarnDto';
import styles from './aksjonspunktForm.module.css';
import { valgValues } from './utils';

interface Props {
  fields: any;
  barn: fosterbarnDto[];
  isAksjonspunktOpen: boolean;
  valgValue: string;
  aksjonspunktkode: string;
}

const FosterbarnForm = ({ fields, barn, isAksjonspunktOpen, valgValue, aksjonspunktkode }: Props) => {
  useEffect(() => {
    if (aksjonspunktkode === aksjonspunktCodes.ÅRSKVANTUM_FOSTERBARN) {
      if (valgValue === valgValues.reBehandling && fields.length < 1) fields.push('');
    }
  }, [valgValue]);

  return (
    <>
      {fields.length > 0 && (
        <>
          <Table>
            <TableRow isHeader>
              <TableColumn />
              <TableColumn>
                <FormattedMessage id="Årskvantum.Aksjonspunkt.Avslått.Fosterbarn.Fnr" />
              </TableColumn>
              <TableColumn className={styles.sentrert}>
                <FormattedMessage id="Årskvantum.Aksjonspunkt.Avslått.Fosterbarn.Fjern" />
              </TableColumn>
            </TableRow>
            {fields.map((field, index) => {
              const fosterbarnObj = barn[index];
              const navn = fosterbarnObj && fosterbarnObj.navn ? fosterbarnObj.navn : `Fosterbarn ${index + 1}`;
              return (
                <TableRow key={`${navn}`}>
                  <TableColumn className={styles.vertikaltSentrert}>{navn}</TableColumn>
                  <TableColumn className={styles.vertikaltSentrert}>
                    <InputField
                      name={field}
                      type="text"
                      htmlSize={14}
                      validate={[required, minLength(11), maxLength(11), hasValidFodselsnummer]}
                      maxLength={11}
                      readOnly={!isAksjonspunktOpen}
                    />
                  </TableColumn>
                  <TableColumn className={`${styles.sentrert} ${styles.vertikaltSentrert}`}>
                    <Button
                      variant="tertiary"
                      type="button"
                      onClick={() => fields.remove(index)}
                      disabled={
                        !isAksjonspunktOpen ||
                        (aksjonspunktkode === aksjonspunktCodes.ÅRSKVANTUM_FOSTERBARN &&
                          index === 0 &&
                          fields.length < 2)
                      }
                      icon={<Delete />}
                      aria-label="Slett"
                    />
                  </TableColumn>
                </TableRow>
              );
            })}
          </Table>
          <VerticalSpacer eightPx />
        </>
      )}
      <Button variant="tertiary" type="button" onClick={() => fields.push('')} size="small">
        <FormattedMessage id="Årskvantum.Aksjonspunkt.Avslått.Fosterbarn.LeggTil" />
      </Button>
    </>
  );
};

export default FosterbarnForm;
