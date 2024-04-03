/* eslint-disable react/jsx-props-no-spreading */
import { Delete } from '@navikt/ds-icons';
import { Button, Box as DSBox, Heading, Table, TextField } from '@navikt/ds-react';
import validator from '@navikt/fnrvalidator';
import { Box, Margin } from '@navikt/ft-plattform-komponenter';
import React, { useContext, useEffect } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import ContainerContext from '../../context/ContainerContext';

interface FosterbarnProps {
  setFosterbarn: React.Dispatch<React.SetStateAction<string[]>>;
}

const Fosterbarn = ({ setFosterbarn }: FosterbarnProps) => {
  const { readOnly } = useContext(ContainerContext);
  const {
    control,
    register,
    formState: { errors },
  } = useForm({ mode: 'onBlur' });
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
    <Box marginBottom={Margin.large}>
      <DSBox background="surface-default" padding="4" borderWidth="1">
        <Box marginBottom={Margin.medium}>
          <Heading level="2" size="medium">
            Fosterbarn
          </Heading>
        </Box>
        {fields.length > 0 && (
          <Box marginBottom={Margin.medium}>
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
                      <TextField
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
                        error={errors.fosterbarn?.[index]?.fødselsnummer?.message}
                      />
                    </Table.DataCell>
                    <Table.DataCell>
                      <Button
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
          </Box>
        )}

        <Button variant="secondary" onClick={() => append({ fødselsnummer: '' })} size="small">
          Legg til fosterbarn
        </Button>
      </DSBox>
    </Box>
  );
};

export default Fosterbarn;
