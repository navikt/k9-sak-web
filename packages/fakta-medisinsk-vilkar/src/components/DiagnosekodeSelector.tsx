import { AutocompleteField } from '@fpsak-frontend/form';
import * as React from 'react';
import { FlexRow, FlexColumn } from '@fpsak-frontend/shared-components';
import axios from 'axios';
import styles from './medisinskVilkar.less';

const fetchDiagnosekoderByQuery = (queryString: string) =>
  axios.get(`http://localhost:8100/diagnosekoder?query=${queryString}&max=8`);

const getUpdatedSuggestions = async (queryString: string) => {
  if (queryString.length >= 3) {
    const diagnosekoder = await fetchDiagnosekoderByQuery(queryString);
    return diagnosekoder.data.map(({ kode, beskrivelse }) => ({
      key: kode,
      value: `${kode} - ${beskrivelse}`,
    }));
  }
  return [];
};

const DiagnosekodeSelector = ({ readOnly }) => {
  const [suggestions, setSuggestions] = React.useState([]);
  const [inputValue, setInputValue] = React.useState('');

  return (
    <FlexRow wrap>
      <FlexColumn className={styles.diagnosekodeColumn}>
        <AutocompleteField
          suggestions={suggestions}
          inputValue={inputValue}
          onInputValueChange={async v => {
            setInputValue(v);
            const newSuggestionList = await getUpdatedSuggestions(v);
            setSuggestions(newSuggestionList);
          }}
          id="test"
          placeholder="Søk etter diagnose"
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
