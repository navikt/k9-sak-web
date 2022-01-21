import { Autocomplete, FieldError } from '@navikt/k9-react-components';
import { Label } from 'nav-frontend-skjema';
import NavFrontendSpinner from 'nav-frontend-spinner';
import * as React from 'react';
import Diagnosekode from '../../../types/Diagnosekode';
import styles from './diagnosekodeSelector.less';

interface DiagnosekodeSelectorProps {
    label: string;
    onChange: (value) => void;
    name: string;
    errorMessage?: string;
    initialDiagnosekodeValue: string;
    hideLabel?: boolean;
    showSpinner?: boolean;
}

const fetchDiagnosekoderByQuery = (queryString: string) =>
    fetch(`/k9/diagnosekoder/?query=${queryString}&max=8`).then((response) => response.json());

const PureDiagnosekodeSelector = ({
    label,
    onChange,
    name,
    errorMessage,
    initialDiagnosekodeValue,
    hideLabel,
    showSpinner,
}: DiagnosekodeSelectorProps): JSX.Element => {
    const [suggestions, setSuggestions] = React.useState([]);
    const [inputValue, setInputValue] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const getUpdatedSuggestions = async (queryString: string) => {
        if (queryString.length >= 3) {
            setIsLoading(true);
            const diagnosekoder: Diagnosekode[] = await fetchDiagnosekoderByQuery(queryString);
            setIsLoading(false);
            return diagnosekoder.map(({ kode, beskrivelse }) => ({
                key: kode,
                value: `${kode} - ${beskrivelse}`,
            }));
        }
        return [];
    };

    React.useEffect(() => {
        const getInitialDiagnosekode = async () => {
            const diagnosekode = await getUpdatedSuggestions(initialDiagnosekodeValue);
            if (diagnosekode.length > 0 && diagnosekode[0].value) {
                setInputValue(diagnosekode[0].value);
            }
        };
        getInitialDiagnosekode();
    }, [initialDiagnosekodeValue]);

    const onInputValueChange = async (v) => {
        setInputValue(v);
        const newSuggestionList = await getUpdatedSuggestions(v);
        setSuggestions(newSuggestionList);
    };
    return (
        <div className={styles.diagnosekodeContainer}>
            <div className={hideLabel ? styles.diagnosekodeContainer__hideLabel : ''}>
                <Label htmlFor={name}>{label}</Label>
            </div>
            <div className={styles.diagnosekodeContainer__autocompleteContainer}>
                <Autocomplete
                    id={name}
                    suggestions={suggestions}
                    value={inputValue}
                    onChange={onInputValueChange}
                    onSelect={(e) => {
                        onInputValueChange(e.value);
                        onChange(e);
                    }}
                    ariaLabel="Søk etter diagnose"
                    placeholder="Søk etter diagnose"
                    shouldFocusOnMount
                />
                {showSpinner && (
                    <div className={styles.diagnosekodeContainer__spinnerContainer}>
                        {isLoading && <NavFrontendSpinner />}
                    </div>
                )}
            </div>
            {errorMessage && <FieldError message={errorMessage} />}
        </div>
    );
};

export default PureDiagnosekodeSelector;
