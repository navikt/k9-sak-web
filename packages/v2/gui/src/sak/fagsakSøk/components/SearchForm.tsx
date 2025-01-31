import { Alert, Button, Heading } from '@navikt/ds-react';
import { Form, InputField } from '@navikt/ft-form-hooks';
import { useForm } from 'react-hook-form';
import { hasValidSaksnummerOrFodselsnummerFormat } from '../../../utils/validation/validators';
import styles from './searchForm.module.css';

const isButtonDisabled = (searchStarted: boolean, searchString?: string): boolean =>
  !!(searchStarted || (searchString && searchString.length < 1));

interface SearchFormProps {
  searchStarted: boolean;
  searchResultAccessDenied?: {
    feilmelding: string;
  };
  onSubmit: (formValues: FormState) => void;
}

interface FormState {
  searchString?: string;
}

/**
 * SearchForm
 *
 * Presentasjonskomponent. Definerer søkefelt og tilhørende søkeknapp.
 */
export const SearchForm = ({ searchStarted, searchResultAccessDenied, onSubmit }: SearchFormProps) => {
  const formMethods = useForm<FormState>({
    defaultValues: {
      searchString: '',
    },
  });
  const [searchString] = formMethods.watch(['searchString']);
  const handleSubmit = (formValues: FormState) => {
    onSubmit(formValues);
  };
  return (
    <Form<FormState> formMethods={formMethods} className={styles.container} onSubmit={handleSubmit}>
      <Heading size="small" level="2">
        Søk på sak eller person
      </Heading>
      <div className="flex gap-3 mt-2">
        <InputField
          name="searchString"
          validate={[hasValidSaksnummerOrFodselsnummerFormat]}
          parse={(s = '') => (typeof s === 'string' ? s.trim() : s)}
          label="Saksnummer eller fødselsnummer/D-nummer"
          size="medium"
        />
        <Button
          size="small"
          className={styles.button}
          loading={searchStarted}
          disabled={isButtonDisabled(searchStarted, searchString)}
          type="submit"
        >
          Søk
        </Button>
      </div>
      {searchResultAccessDenied && (
        <Alert inline variant="warning">
          {searchResultAccessDenied.feilmelding}
        </Alert>
      )}
    </Form>
  );
};

export default SearchForm;
