import { AutocompleteField } from '@fpsak-frontend/form';
import * as React from 'react';
import { FlexRow, FlexColumn } from '@fpsak-frontend/shared-components';

// const fetchDiagnosekoderByQuery = (queryString: string) => axios.get('');

const DiagnosekodeSelector = ({ readOnly }) => {
  const [suggestions] = React.useState([
    { key: 'key1', value: '1st value' },
    { key: 'key2', value: '2nd value' },
  ]);
  const [inputValue, setInputValue] = React.useState('');

  return (
    <FlexRow wrap>
      <FlexColumn>
        <AutocompleteField
          suggestions={suggestions}
          inputValue={inputValue}
          onInputValueChange={async v => {
            setInputValue(v);
            // todo: http-call and setSuggestions
            // const diagnosekoder = await fetchDiagnosekoderByQuery(v);
            // setSuggestions([]);
          }}
          id="test"
          placeholder="Søk etter diagnose her"
          ariaLabel="test"
          label="Hvilken diagnose?"
          readOnly={readOnly}
          name="diagnosekode"
        />
      </FlexColumn>
    </FlexRow>
  );
};

export default DiagnosekodeSelector;
