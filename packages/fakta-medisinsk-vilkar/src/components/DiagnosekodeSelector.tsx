import { AutocompleteField } from '@fpsak-frontend/form';
import { FlexColumn, FlexRow } from '@fpsak-frontend/shared-components';
import axios from 'axios';
import React from 'react';
import styles from './diagnosekodeSelector.less';

const fetchDiagnosekoderByQuery = (queryString: string) => axios.get(`/k9/diagnosekoder?query=${queryString}&max=8`);

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
  const [inputValue, setInputValue] = React.useState('');

  React.useEffect(() => {
    const getInitialDiagnosekode = async () => {
      const diagnosekode = await getUpdatedSuggestions(initialDiagnosekodeValue);
      if (diagnosekode.length > 0 && diagnosekode[0].value) {
        setInputValue(diagnosekode[0].value);
      }
    };
    getInitialDiagnosekode();
  }, []);

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
          dataId="diagnosekodesokefelt"
        />
      </FlexColumn>
    </FlexRow>
  );
};

export default DiagnosekodeSelector;
