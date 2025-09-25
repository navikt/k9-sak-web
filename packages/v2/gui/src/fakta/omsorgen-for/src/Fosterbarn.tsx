/* eslint-disable react/jsx-props-no-spreading */
import { Delete } from '@navikt/ds-icons';
import { Box, Button, Heading, Table } from '@navikt/ds-react';
import validator from '@navikt/fnrvalidator';
import { RhfTextField } from '@navikt/ft-form-hooks';
import React, { useEffect } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';

interface FosterbarnProps {
  setFosterbarn: React.Dispatch<React.SetStateAction<string[]>>;
  readOnly: boolean;
}

const Fosterbarn = ({ setFosterbarn, readOnly }: FosterbarnProps) => {
  const { control } = useForm({ mode: 'onBlur' });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'fosterbarn',
  });

  const fosterbarnFormValues: { fødselsnummer: string }[] = useWatch({ name: 'fosterbarn', control });

  useEffect(() => {
    const unikeFosterbarn = new Set(fosterbarnFormValues?.map(fosterbarn => fosterbarn.fødselsnummer));
    setFosterbarn([...unikeFosterbarn]);
  }, [fosterbarnFormValues]);

  return (
    <Box.New marginBlock="0 6">
      <Box.New padding="4" borderWidth="1" borderRadius="medium">
        <Box.New marginBlock="0 4">
          <Heading level="2" size="medium">
            Fosterbarn
          </Heading>
        </Box.New>
        {fields.length > 0 && (
          <Box.New marginBlock="0 4">
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell scope="col" />
                  <Table.HeaderCell scope="col">Fødselsnummer</Table.HeaderCell>
                  <Table.HeaderCell scope="col">Fjern</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {fields.map((field, index) => (
                  <Table.Row key={field.id}>
                    <Table.DataCell>{`Fosterbarn ${index + 1}`}</Table.DataCell>
                    <Table.DataCell>
                      {/* <TextField
                        {...register(`fosterbarn.${index}.fødselsnummer`, {
                          minLength: {
                            value: 11,
                            message: 'Fødselsnummer må være 11 siffer',
                          },
                          maxLength: {
                            value: 11,
                            message: 'Fødselsnummer må være 11 siffer',
                          },
                          validate: {
                            hasValidFodselsnummer: value => {
                              if (validator.fnr(value).status === 'valid') {
                                return '';
                              }
                              return 'Ugyldig fødselsnummer';
                            },
                          },
                        })}
                        hideLabel
                        label="Fødselsnummer"
                        size="small"
                        htmlSize={11}
                      /> */}
                      <RhfTextField
                        control={control}
                        name={`fosterbarn.${index}.fødselsnummer`}
                        label="Fødselsnummer"
                        htmlSize={11}
                        size="small"
                        minLength={11}
                        maxLength={11}
                        validate={[
                          (value: string) => {
                            if (validator.fnr(value).status === 'valid') {
                              return '';
                            }
                            return 'Ugyldig fødselsnummer';
                          },
                        ]}
                      />
                    </Table.DataCell>
                    <Table.DataCell>
                      <Button
                        size="small"
                        variant="tertiary"
                        onClick={() => remove(index)}
                        disabled={readOnly}
                        icon={<Delete />}
                        aria-label="Fjern fosterbarn"
                      />
                    </Table.DataCell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Box.New>
        )}

        <Button variant="secondary" onClick={() => append({ fødselsnummer: '' })} size="small">
          Legg til fosterbarn
        </Button>
      </Box.New>
    </Box.New>
  );
};

export default Fosterbarn;
