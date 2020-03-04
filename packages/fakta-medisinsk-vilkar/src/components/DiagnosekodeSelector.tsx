import { AutocompleteField } from '@fpsak-frontend/form';
import { FlexColumn, FlexRow } from '@fpsak-frontend/shared-components';
import { required } from '@fpsak-frontend/utils';
import axios from 'axios';
import * as React from 'react';
import styles from './diagnosekodeSelector.less';

const fetchDiagnosekoderByQuery = (queryString: string) => {
  const pathPrefix = window.location.hostname === 'localhost' ? 'http://localhost:8300' : '';
  return axios.get(`${pathPrefix}/diagnosekoder?query=${queryString}&max=8`);
};

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

const DiagnosekodeSelector = ({ readOnly, initialDiagnosekodeValue }) => {
  const [suggestions, setSuggestions] = React.useState([]);
  const [inputValue, setInputValue] = React.useState(initialDiagnosekodeValue || '');

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
          label="Er det fastsatt en diagnose?"
          readOnly={readOnly}
          name="diagnosekode"
          validate={[required]}
        />
      </FlexColumn>
    </FlexRow>
  );
};

export default DiagnosekodeSelector;
