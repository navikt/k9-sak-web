import { Delete } from '@navikt/ds-icons';
import { Box, Button, Heading, Table } from '@navikt/ds-react';
import validator from '@navikt/fnrvalidator';
import { RhfTextField } from '@navikt/ft-form-hooks';
import { useFieldArray, useFormContext } from 'react-hook-form';

export interface FosterbarnFormState {
  fosterbarn: { fødselsnummer: string }[];
}

interface FosterbarnProps {
  readOnly: boolean;
}

const Fosterbarn = ({ readOnly }: FosterbarnProps) => {
  const { control } = useFormContext<FosterbarnFormState>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'fosterbarn',
  });

  return (
    <Box marginBlock="space-0 space-6">
      <Box padding="space-16" borderWidth="1" borderRadius="4">
        <Box marginBlock="space-0 space-4">
          <Heading level="2" size="medium">
            Fosterbarn
          </Heading>
        </Box>
        {fields.length > 0 && (
          <Box marginBlock="space-0 space-4">
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
                      <RhfTextField
                        control={control}
                        name={`fosterbarn.${index}.fødselsnummer`}
                        label="Fødselsnummer"
                        htmlSize={11}
                        size="small"
                        minLength={11}
                        maxLength={11}
                        hideLabel
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
          </Box>
        )}

        <Button variant="secondary" onClick={() => append({ fødselsnummer: '' })} size="small">
          Legg til fosterbarn
        </Button>
      </Box>
    </Box>
  );
};

export default Fosterbarn;
