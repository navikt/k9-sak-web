import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Alert, Button, Heading } from '@navikt/ds-react';

import { Form, InputField } from '@navikt/ft-form-hooks';
import { hasValidSaksnummerOrFodselsnummerFormat } from '@navikt/ft-form-validators';
import { useForm } from 'react-hook-form';
import styles from './searchForm.module.css';

const isButtonDisabled = (searchStarted: boolean, searchString?: string): boolean =>
  !!(searchStarted || !searchString || searchString.length < 1);

interface PureOwnProps {
  searchStarted: boolean;
  searchResultAccessDenied?: {
    feilmelding: string;
  };
  onSubmit: (searchString: string) => void;
}

interface FormState {
  searchString: string;
}

/**
 * SearchForm
 *
 * Presentasjonskomponent. Definerer søkefelt og tilhørende søkeknapp.
 */
export const SearchForm = ({ searchStarted, searchResultAccessDenied, onSubmit }: PureOwnProps) => {
  const formMethods = useForm<FormState>({
    defaultValues: { searchString: '' },
  });
  const searchString = formMethods.watch('searchString');
  const submit = (formstate: FormState) => {
    onSubmit(formstate.searchString);
  };
  return (
    // <form className={styles.container} onSubmit={formProps.handleSubmit}>
    <Form formMethods={formMethods} onSubmit={submit}>
      <Heading size="small" level="2">
        Søk på sak eller person
      </Heading>
      <VerticalSpacer eightPx />
      <div className="flex gap-3">
        <InputField
          name="searchString"
          parse={(s = '') => {
            if (typeof s === 'string') {
              return s.trim();
            }
            return s;
          }}
          label="Saksnummer eller fødselsnummer/D-nummer"
          size="medium"
          validate={[hasValidSaksnummerOrFodselsnummerFormat]}
        />
        <Button
          size="small"
          className={styles.button}
          loading={searchStarted}
          disabled={isButtonDisabled(searchStarted, searchString)}
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
